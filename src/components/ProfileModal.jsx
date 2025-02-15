//style imports
import styles from "../styles/ProfileModal.module.css";
// package imports
import { useState } from "react";
// component imports
import Switch from "./Switch";
import defaultAvatar from '../../public/default_avatar.webp'

const ProfileModal = ({ closeModal, logout }) => {
    const [autoBreak, setAutoBreak] = useState(false);

    const handleDoneClick = () => {
        // make changes
        // TODO

        // close modal
        closeModal();
    }

    return (
        <>
            <div onClick={closeModal} className='overlay'></div>
            
            <div className={styles.card}>
                <h2>Account</h2>

                <div className={styles.content_container}>
                    <img className={styles.img} src={defaultAvatar} />

                    <div className={styles.input_container}>
                        <h3>Name</h3>
                        <input className={styles.inp} type="text" />
                    </div>
                </div>

                <div className={styles.btn_container}>
                    <button onClick={logout} className={styles.btn_logout}>Logout</button>
                    <button onClick={handleDoneClick} className={styles.btn}>Done</button>
                </div>
            </div>
        </>
    );
}

export default ProfileModal;