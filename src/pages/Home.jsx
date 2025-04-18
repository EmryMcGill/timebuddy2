//style imports
import styles from "../styles/Home.module.css";
// package imports
import { useEffect, useRef, useState } from "react";
import { GiPauseButton } from "react-icons/gi";
// API imports
import { usePocket } from "../PbContext"; 
// component import 
import ProjectCard from "../components/ProjectCard";
import ProjectEditCard from "../components/ProjectEditCard";
import Loading from "../components/Loading";
import TopBar from "../components/TopBar";
import clock_yellow from '../../public/clock_yellow.svg';
import clock_blue from '../../public/clock_blue.svg';
import clock_white from '../../public/clock.svg';

const Home = () => {
    // hooks
    const { 
        user,
        createProject,
        updateProject,
        deleteProject,
        projects,
        activeProject,
        setActiveProjectPublic,
        loading,
        startTimer,
        stopTimer,
        pauseTimer,
        clock,
        mode,
        setModePublic,
        timerActive
     } = usePocket();

     const timerContainerRef = useRef();
     const btnRef = useRef();

     useEffect(() => {
        let progress;
        if (mode === 'focus') {
            document.title = `${formatTime(clock)} - Focus`;
            progress = Math.min((user.work - clock) / user.work * 360, 360);

            if (timerActive) {
                let link = document.querySelector("link[rel~='icon']");
                link.href = clock_yellow;
                document.getElementsByTagName('head')[0].appendChild(link);
            }
        }
        else {
            document.title = `${formatTime(clock)} - Break`;
            progress = Math.min((user.break - clock) / user.break * 360, 360);

            if (timerActive) {
                let link = document.querySelector("link[rel~='icon']");
                link.href = clock_blue;
                document.getElementsByTagName('head')[0].appendChild(link);
            }
        }

        if (!timerActive) {
            let link = document.querySelector("link[rel~='icon']");
            link.href = clock_white;
            document.getElementsByTagName('head')[0].appendChild(link);
        }

        timerContainerRef.current.style.setProperty('--progress', `${progress}deg`);
        if (mode === 'focus') {
            timerContainerRef.current.style.setProperty('--col', 'var(--blue)');
        }
        else {
            timerContainerRef.current.style.setProperty('--col', '#35A6EF');
        }
    }, [clock]);

    // local state
    const [newProject, setNewProject] = useState(false);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }

    const handleSwitchMode = () => {
        // stop timer
        stopTimer();
        if (mode === 'focus') {
            // change mode
            setModePublic('break');
        }
        else {
            // change mode
            setModePublic('focus');   
        }
    }

    return (
        <div className='page'>
            
            <TopBar />

            <div className={styles.timer_container} ref={timerContainerRef}>
                <div className={styles.mode_container}>
                    <button 
                        className={`${styles.btn_mode} ${mode === 'focus' ? styles.btn_mode_active : ''}`}
                        onClick={handleSwitchMode}
                        >
                            Focus
                    </button>
                    <button 
                        className={`${styles.btn_mode} ${mode === 'break' ? styles.btn_mode_active : ''}`}
                        onClick={handleSwitchMode}
                        >
                            Break
                    </button>
                </div>

                <h1 className={styles.timer}>{formatTime(clock)}</h1>

                {mode === 'focus' ?
                    timerActive ? 
                    <div className={styles.btn_container}>
                        <button
                            onClick={() => pauseTimer()}
                            className={styles.btn_focus}
                            style={{aspectRatio: '1 / 1', paddingLeft: '0.5rem', paddingRight: '0.5rem'}}
                            ref={btnRef}>
                                <GiPauseButton />
                        </button>
                        <button 
                            onClick={() => stopTimer()} 
                            className={styles.btn_focus}
                            ref={btnRef}>
                                End Focus
                        </button>
                    </div>
                    :
                        <button 
                            onClick={() => startTimer(true)} 
                            className={styles.btn_focus}
                            ref={btnRef}>
                                Focus
                        </button>
                    
                :
                    timerActive ? 
                        <div className={styles.btn_container}>
                            <button
                                onClick={() => pauseTimer()}
                                className={styles.btn_break}
                                style={{aspectRatio: '1 / 1', paddingLeft: '0.5rem', paddingRight: '0.5rem'}}
                                ref={btnRef}>
                                    <GiPauseButton />
                            </button>
                            <button 
                                onClick={stopTimer} 
                                className={styles.btn_break}
                                ref={btnRef}>
                                    End Break
                            </button> 
                        </div>
                    : 
                        <button 
                            onClick={startTimer} 
                            className={styles.btn_break}
                            ref={btnRef}>
                                Break
                        </button>
                }
            </div>

            

            <div className={styles.projects_container}>
                <h3>Projects</h3>
                <div className={styles.projects_map}>
                    {!loading ? projects.sort((a, b) => new Date(a.created) - new Date(b.created)).map(proj => 
                        <ProjectCard 
                            activate={(id) => {
                                mode === 'focus' ? stopTimer() : '';
                                setActiveProjectPublic(id);
                            }}
                            title={proj.title}
                            id={proj.id}
                            key={proj.id} 
                            isActive={proj.id === activeProject ? true : false}
                            handleDelete={deleteProject}
                            handleUpdate={updateProject} />
                    ) : <Loading />}
                    {newProject ? 
                        <ProjectEditCard
                        handleSubmit={createProject}
                        closeCreateProject={() => setNewProject(false)} /> :
                        <button 
                        className={styles.btn_add_project}
                        onClick={() => setNewProject(true)}>+ Add Project</button>
                    } 
                </div>
            </div>
        </div>
    );
}

export default Home;