//style imports
import styles from "../styles/Home.module.css";
// package imports
import { IoStatsChart } from "react-icons/io5";
import { useRef, useState } from "react";
// API imports
import { usePocket } from "../PbContext"; 
// component import 
import defaultAvatar from '../../public/default_avatar.webp'
import ProjectCard from "../components/ProjectCard";
import MenuModal from "../components/MenuModal";
import SettingsModal from "../components/SettingsModal";
import ProfileModal from "../components/ProfileModal";

const Home = () => {
    // hooks
    const { logout } = usePocket();
    // local state
    const [menuModal, setMenuModal] = useState(false);
    const [profileModal, setProfileModal] = useState(false);
    const [settingsModal, setSettingsModal] = useState(false);
    const [activeProject, setActiveProject] = useState(null);
    const profileBtnRef = useRef(null);

    const projects = [
        {
            title: "project1",
            id: 0
        },
        {
            title: "project2",
            id: 1
        },
        {
            title: "project3",
            id: 2
        }
    ]

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

            <h1 className={styles.timer}>05:32</h1>

            <button className={styles.btn_start}>Start Break</button>

            <div className={styles.projects_container}>
                <h3>Projects</h3>
                {projects.map(proj => 
                    <ProjectCard 
                        title={proj.title}
                        id={proj.id}
                        key={proj.id}
                        setActiveProject={(id) => setActiveProject(id)} 
                        isActive={proj.id === activeProject ? true : false} />
                )}
                <button className={styles.btn_add_project}>+ Add Project</button>
            </div>
        </div>
    );
}

export default Home;