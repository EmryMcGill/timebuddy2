import Pocketbase from 'pocketbase';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const BASE_URL = import.meta.env.VITE_PB_URI;

// create the pb context
const PbContext = createContext();

export const PbProvider = ({ children }) => {
    // define the pb object 
    const pb = useMemo(() => new Pocketbase(BASE_URL));

    // define user
    const [user, setUser] = useState(pb.authStore.record);
    const [token, setToken] = useState(pb.authStore.token);
    const [projects, setProjects] = useState([]);
    const [time, setTime] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clock, setClock] = useState(user?.work);
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        // init projects and time
        getProjects().then(() => setLoading(false));
        getTime();

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

    // ===== TIME ======
    
    const getTime = async () => {
        try {
            const res = await pb.collection('time').getFullList();
            setTime([...res]);
        }
        catch (err) {
            console.log(err);
        }
    }

    const createTime = async (time, project) => {
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

    // ===== CLOCK =====

    const work = (setActiveProject, project) => {
        const length = user.work;

        // clear any active timer
        if (timer !== null) {
            clearInterval(timer);
        }

        const end = Date.now() + length * 1000;
        
        const updateTimer = async () => {
            const remaining = Math.ceil((end - Date.now()) / 1000); 
            setClock(remaining);

            if (remaining === 0) {
                // timer reached 0, stop timer

                // create time log
                await createTime({
                    time: length,
                    project: project,
                    user: user.id
                });

                clearInterval(timer2);
                setTimer(null);

                // reset project btn
                setActiveProject(null);

                // set clock back
                setClock(length);
            }
        };

        updateTimer();
        
        const timer2 = setInterval(updateTimer, 1000);
        setTimer(timer2);
    }

    const stopWork = async (project) => {
        // create time log
        await createTime(
            parseInt(user.work - clock),
            project,
        );

        // stop the timer
        clearInterval(timer);
        setTimer(null);

        // reset the clock
        setClock(user.work)
    }

    const startBreak = async (setIsBreak, project) => {
        // create time log
        await createTime(
            parseInt(user.work - clock),
            project,
        );
        
        const length = user.break;

        // need to stop timer
        clearInterval(timer);

        // start a break timer
        const end = Date.now() + length * 1000;
        
        const updateTimer = () => {
            const remaining = Math.ceil((end - Date.now()) / 1000); 
            setClock(remaining);

            if (remaining === 0) {
                // timer reached 0, stop timer
                clearInterval(timer2);
                setTimer(null);

                // set clock back
                setClock(user.work);

                setIsBreak(false);
            }
        };

        updateTimer();
        
        const timer2 = setInterval(updateTimer, 1000);
        setTimer(timer2);
    }

    return (
        <PbContext.Provider value={{ 
            user,
            updateSettings,
            googleAuth,
            login,
            logout,
            signup,
            createProject,
            updateProject,
            deleteProject,
            projects,
            loading,
            time,
            work,
            stopWork,
            startBreak,
            clock,
            timer
         }}>
        {children}
        </PbContext.Provider>
    );
}

// export custom hook to simplify using useContext
export const usePocket = () => useContext(PbContext);