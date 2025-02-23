import Pocketbase from 'pocketbase';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const BASE_URL = import.meta.env.VITE_PB_URI;

// create the pb context
const PbContext = createContext();

export const PbProvider = ({ children }) => {
    // define the pb object 
    const pb = useMemo(() => new Pocketbase(BASE_URL));

    // define global states
    const [user, setUser] = useState(pb.authStore.record);
    const [token, setToken] = useState(pb.authStore.token);
    // list of all users projects
    const [projects, setProjects] = useState([]);
    // the users active project
    const [activeProject, setActiveProject] = useState(null);
    // list of all users time logs
    const [time, setTime] = useState([]);
    // to check if the data has loaded
    const [loading, setLoading] = useState(true);
    // value to display on clock
    const [clock, setClock] = useState(user?.work);
    // the timer interval object
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        // init projects and time
        getProjects().then(() => 
            getTime().then(() => 
                setLoading(false)
            )
        );

        // real-time sub PROJECTS
        pb.collection('projects').subscribe('*', async function (e) { 
            setProjects(oldProjects => {
                // update projects
                if (e.action === "create") {
                    return [e.record, ...oldProjects];
                }
                if (e.action === "update") {
                    return oldProjects.map(project => 
                        project.id === e.record.id ? e.record : project
                    );
                }
                if (e.action === "delete") {
                    return oldProjects.filter(project => project.id !== e.record.id);
                }
                return oldProjects;
            });
        }, {});

        // real-time sub TIME
        pb.collection('time').subscribe('*', async function (e) { 
            setTime(oldTime => {
                // update time
                if (e.action === "create") {
                    return [e.record, ...oldTime];
                }
                if (e.action === "delete") {
                    return oldTime.filter(t => t.id !== e.record.id);
                }
                return oldTime;
            });
        }, {});

        // real-time sub USER
        pb.collection('users').subscribe(user.id, (e) => {
            setUser(e.record);
            setClock(e.record.work);
        });
        
        
        // listen for changes to the authStore state
        const unsubscribe = pb.authStore.onChange((token, record) => {
            setUser(record);
            setToken(token);
            setClock(record.work);
        });
        
        return () => {
            unsubscribe();
        };
    }, []);

    // ========= AUTH ==============

    const googleAuth = async () => {
        const res = await pb.collection('users').authWithOAuth2({ provider: 'google' });
    }

    const login = async (email, pass) => {
        // attempt to login user
        try {
            await pb.collection("users").authWithPassword(email, pass);
            setUser(pb.authStore.record);
            return null;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    const signup = async (data) => {
        // attempt to register user
        try {
            const res = await pb.collection("users").create(data);

            // log in user
            await login(data.email, data.password);
            
            return null;
        }
        catch (err) {
            console.log(err.data)
            return err;
        }
    }

    const logout = () => {
        try {
            pb.authStore.clear();
            setUser(pb.authStore.record);
        }
        catch (err) {
            console.log(err);
        }
    }

    // ====== SETTINGS ========

    const updateSettings = async (bk, work, autoBreak) => {
        try {
            await pb.collection('users').update(user.id, {
                break: bk,
                work: work,
                autoBreak: autoBreak
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    // ====== Projects ========

    const getProjects = async () => {
        try {
            const res = await pb.collection('projects').getFullList();
            setProjects([...res]);
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }

    const createProject = async (title) => {
        if (!title) {
            return null;
        }

        try {
            return await pb.collection('projects').create({
                title: title,
                user: user.id
            });
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }

    const updateProject = async (id, title) => {
        try {
            await pb.collection('projects').update(id, {title: title});
        }
        catch (err) {
            console.log(err);
        }
    }

    const deleteProject = async (id) => {
        try {
            await pb.collection('projects').delete(id);
        }
        catch (err) {
            console.log(err);
        }
    }

    // ===== TIME LOGS ======
    
    const getTime = async () => {
        try {
            const res = await pb.collection('time').getFullList();
            setTime([...res]);
        }
        catch (err) {
            console.log(err);
        }
    }

    const createTime = async (time, project) => {
        try {
            await pb.collection('time').create({
                time: time,
                project: project,
                user: user.id
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    // ===== CLOCK FUNCTIONALITY =====

    // function to start a focus session for the active project
    const startTimer = async (project) => {
        // 1. stop any current clock use
        await stopTimer();

        // set active project, and calc end time
        let end;
        setActiveProject(project);
        if (project) {
            end = Date.now() + user.work * 1000;
        }
        else {
            end = Date.now() + user.break * 1000;
        }

        // 3. updateClock function
        const updateClock = async () => {
            const remaining = Math.ceil((end - Date.now()) / 1000); 
            setClock(remaining);

            if (remaining === 0) {
                // end of timer session
                await stopTimer();
            }
        };
        updateClock();
        
        // 4. create and start interval
        const timerLocal = setInterval(updateClock, 1000);
        setTimer(timerLocal);
    }

    // function to clear the timer and create a time log
    const stopTimer = async () => {
        // 1. create a time log
        setClock(prevClock => {
            setActiveProject(prevProj => {
                if (prevProj !== null && prevProj !== undefined) {
                    createTime(
                        parseInt(user.work - prevClock),
                        prevProj,
                    );
                }
                return null;
            });
            return user.work;
        });

        // 2. stop the interval
        setTimer(prevTimer => {
            if (prevTimer !== null) {
                clearInterval(prevTimer);
            }
            return null;
        });
    }

    return (
        <PbContext.Provider value={{ 
            user,
            updateSettings,
            googleAuth,
            login,
            logout,
            signup,
            projects,
            activeProject,
            createProject,
            updateProject,
            deleteProject,
            time,
            loading,
            startTimer,
            stopTimer,
            clock,
         }}>
        {children}
        </PbContext.Provider>
    );
}

// export custom hook to simplify using useContext
export const usePocket = () => useContext(PbContext);