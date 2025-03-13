import styles from "../styles/TopBar.module.css";
// package imports
import { IoStatsChart } from "react-icons/io5";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useLocation } from 'react-router-dom';
import { FaRegClock } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
// API imports
import { usePocket } from "../PbContext"; 
// component imports
import MenuModal from "../components/MenuModal";
import SettingsModal from "../components/SettingsModal";
import ProfileModal from "../components/ProfileModal";

const TopBar = () => {
    // hooks
    const { 
        logout,
        user,
        updateSettings,
    } = usePocket();
    const profileBtnRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // local state
    const [menuModal, setMenuModal] = useState(false);
    const [profileModal, setProfileModal] = useState(false);
    const [settingsModal, setSettingsModal] = useState(false);
    
    // render
    return (
        <div className={styles.top_container}>
            {settingsModal ? <SettingsModal 
                                closeModal={() => setSettingsModal(false)}
                                handleSubmit={updateSettings}
                                bkInit={user.break}
                                workInit={user.work} /> : ''}
            {profileModal ? <ProfileModal 
                                logout={logout}
                                closeModal={() =>setProfileModal(false)} /> : ''}
            {location.pathname === '/stats' ? 
                <button onClick={() => navigate('/app')} className={styles.btn_icon}>
                    <FaRegClock size={'2rem'} />
                </button>
            :
                <button onClick={() => navigate('/stats')} className={styles.btn_icon}>
                    <IoStatsChart size={'2rem'} />
                </button>
            }  
            <div style={{position: 'relative'}}>
                <button onClick={() => setMenuModal(!menuModal)} ref={profileBtnRef} className={styles.btn_icon}>
                    <CgProfile size={'2rem'} />
                </button>
                {menuModal ? 
                    <MenuModal 
                        buttonRef={profileBtnRef} 
                        closeModal={() => setMenuModal(false)}
                        openSettingsModal={() => setSettingsModal(true)}
                        openProfileModal={() => setProfileModal(true)} 
                        logout={logout}
                    />
                : 
                    ''
                }
            </div>
        </div>
    );
}

export default TopBar;