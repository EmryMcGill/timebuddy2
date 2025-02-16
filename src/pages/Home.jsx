//style imports
import styles from "../styles/Home.module.css";
// package imports
import { IoStatsChart } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
// API imports
import { usePocket } from "../PbContext"; 
// component import 
import defaultAvatar from '../../public/default_avatar.webp'
import ProjectCard from "../components/ProjectCard";
import MenuModal from "../components/MenuModal";
import SettingsModal from "../components/SettingsModal";
import ProfileModal from "../components/ProfileModal";
import ProjectEditCard from "../components/ProjectEditCard";
import Loading from "../components/Loading";

const Home = () => {
    // hooks
    const { 
        logout,
        createProject,
        projects,
        loading,
        user,
        work,
        clock
     } = usePocket();
    const profileBtnRef = useRef(null);
    // local state
    const [menuModal, setMenuModal] = useState(false);
    const [profileModal, setProfileModal] = useState(false);
    const [settingsModal, setSettingsModal] = useState(false);
    const [activeProject, setActiveProject] = useState(null);
    const [newProject, setNewProject] = useState(false);

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${hours ? String(hours).padStart(2, '0') + ':' : ''}${minutes ? String(minutes).padStart(2, '0') + ':' : ''}${String(seconds).padStart(2, '0')}`;
    }

    return (
        <div className='page'>

            {settingsModal ? <SettingsModal closeModal={() => setSettingsModal(false)} /> : ''}
            {profileModal ? <ProfileModal 
                                logout={logout}
                                closeModal={() =>setProfileModal(false)} /> : ''}
            
            <div className={styles.top_container}>
                <button className={styles.btn_icon}>
                    <IoStatsChart size={'2rem'} />
                </button>
                
                <div style={{position: 'relative'}}>
                    <button onClick={() => setMenuModal(!menuModal)} ref={profileBtnRef} className={styles.btn_icon}>
                        <img className={styles.avatar} src={defaultAvatar} />
                    </button>
                    {menuModal ? <MenuModal 
                                        buttonRef={profileBtnRef} 
                                        closeModal={() => setMenuModal(false)}
                                        openSettingsModal={() => setSettingsModal(true)}
                                        openProfileModal={() => setProfileModal(true)} /> : ''}
                </div>
            </div>

            <h1 className={styles.timer}>{formatTime(clock)}</h1>

            <button className={styles.btn_start}>Start Break</button>

            <div className={styles.projects_container}>
                <h3>Projects</h3>
                <div className={styles.projects_map}>
                    {!loading ? projects.sort((a, b) => new Date(a.created) - new Date(b.created)).map(proj => 
                        <ProjectCard 
                            handleStart={() => work(user.work)}
                            title={proj.title}
                            id={proj.id}
                            key={proj.id}
                            setActiveProject={(id) => setActiveProject(id)} 
                            isActive={proj.id === activeProject ? true : false} />
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