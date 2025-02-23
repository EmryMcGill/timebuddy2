//style imports
import styles from "../styles/Home.module.css";
// package imports
import { act, useState } from "react";
// API imports
import { usePocket } from "../PbContext"; 
// component import 
import ProjectCard from "../components/ProjectCard";
import ProjectEditCard from "../components/ProjectEditCard";
import Loading from "../components/Loading";
import TopBar from "../components/TopBar";

const Home = () => {
    // hooks
    const { 
        createProject,
        updateProject,
        deleteProject,
        projects,
        activeProject,
        setActiveProjectPublic,
        loading,
        startTimer,
        stopTimer,
        clock,
        mode,
        setModePublic,
        timerActive
     } = usePocket();

    // local state
    const [newProject, setNewProject] = useState(false);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }

    const handleStartFocus = () => {
        startTimer(true);
        setIsFocus(true);
    }

    const handleStopFocus = () => {
        stopTimer();
        setIsFocus(false);
    }

    return (
        <div className='page'>
            
            <TopBar />

            <div className={styles.mode_container}>
                <button 
                    className={`${styles.btn_mode} ${mode === 'focus' ? styles.btn_mode_active : ''}`}
                    onClick={() => setModePublic('focus')}
                    >
                        Focus
                </button>
                <button 
                    className={`${styles.btn_mode} ${mode === 'break' ? styles.btn_mode_active : ''}`}
                    onClick={() => setModePublic('break')}
                    >
                        Break
                </button>
            </div>

            <h1 className={styles.timer}>{formatTime(clock)}</h1>
            
            {mode === 'focus' ?
                timerActive ? 
                    <button 
                        onClick={handleStopFocus} 
                        className={styles.btn_start}>
                            End Focus
                    </button>
                :
                    <button 
                        onClick={handleStartFocus} 
                        className={styles.btn_start}>
                            Focus
                    </button>
                
            :
                timerActive ? 
                    <button onClick={() => {
                        setIsBreak(false);
                        stopTimer();
                    }} className={styles.btn_start}>End Break</button> 
                : 
                    <button onClick={() => {
                        startTimer();
                        setIsBreak(true);
                    }} className={styles.btn_start}>Start Break</button>
            }

            <div className={styles.projects_container}>
                <h3>Projects</h3>
                <div className={styles.projects_map}>
                    {!loading ? projects.sort((a, b) => new Date(a.created) - new Date(b.created)).map(proj => 
                        <ProjectCard 
                            activate={(id) => {
                                mode === 'focus' ? handleStopFocus() : '';
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