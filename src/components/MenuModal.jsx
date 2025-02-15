//style imports
import styles from "../styles/MenuModal.module.css";
// package imports
import { CgProfile } from "react-icons/cg";
import { PiCrownSimpleFill } from "react-icons/pi";
import { IoSettingsSharp } from "react-icons/io5";
import { useRef, useEffect } from "react";

const MenuModal = ({ 
    closeModal, 
    buttonRef, 
    openSettingsModal, 
    openProfileModal }) => {

    const menuRef = useRef(null);

    // Close the menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if  (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)) {
                closeModal();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSettingsClick = () => {
        closeModal();
        openSettingsModal();
    }

    const handleProfileClick = () => {
        closeModal();
        openProfileModal();
    }

    return (
        <div className={styles.card} ref={menuRef}>
            <button onClick={handleProfileClick} className={styles.btn}><CgProfile /> Account</button>
            <button className={styles.btn}><PiCrownSimpleFill /> Premium</button>
            <button onClick={handleSettingsClick} className={styles.btn}><IoSettingsSharp /> Settings</button>
        </div>
    );
}

export default MenuModal;