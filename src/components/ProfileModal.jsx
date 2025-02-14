//style imports
import styles from "../styles/ProfileModal.module.css";
// package imports
import { CgProfile } from "react-icons/cg";
import { PiCrownSimpleFill } from "react-icons/pi";
import { IoSettingsSharp } from "react-icons/io5";
import { useRef, useEffect } from "react";

const ProfileModal = ({ closeModal }) => {

    const menuRef = useRef(null);

    // Close the menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                closeModal();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={styles.card} ref={menuRef}>
            <button className={styles.btn}><CgProfile /> Account</button>
            <button className={styles.btn}><PiCrownSimpleFill /> Premium</button>
            <button className={styles.btn}><IoSettingsSharp /> Settings</button>
        </div>
    );
}

export default ProfileModal;