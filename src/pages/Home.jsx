//style imports
import styles from "../styles/Home.module.css";
// package imports
import { useState } from "react";
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
        loading,
        work,
        stopWork,
        startBreak,
        clock,
     } = usePocket();

    // local state
    const [activeProject, setActiveProject] = useState(null);
    const [newProject, setNewProject] = useState(false);
    const [isBreak, setIsBreak] = useState(false);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }

    return (
        <div className='page'>
            
            <TopBar />

            <h1 className={styles.timer}>{formatTime(clock)}</h1>
            
            {!isBreak ? <button onClick={() => {
                startBreak(() => setIsBreak(), activeProject);
                setActiveProject(null);
                setIsBreak(true);
            }} className={styles.btn_start}>Start Break</button> : ''}

            {isBreak ? <button onClick={() => {
                setIsBreak(false);
                stopWork();
            }} className={styles.btn_start}>End Break</button> : ''}

            <div className={styles.projects_container}>
                <h3>Projects</h3>
                <div className={styles.projects_map}>
                    {!loading ? projects.sort((a, b) => new Date(a.created) - new Date(b.created)).map(proj => 
                        <ProjectCard 
                            handleStart={() => work((p) => setActiveProject(p), proj.id)}
                            handleStop={() => stopWork(proj.id)}
                            title={proj.title}
                            id={proj.id}
                            key={proj.id}
                            setActiveProject={(id) => setActiveProject(id)} 
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