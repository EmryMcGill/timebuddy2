//style imports
import styles from "../styles/SettingsModal.module.css";
// package imports
import { useState } from "react";
// component imports
import Switch from "./Switch";

const SettingsModal = ({ closeModal }) => {
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
                <h2>Settings</h2>

                <h3 style={{fontWeight: "600"}}>Timer (minutes)</h3>

                <div className={styles.input_container}>
                    <h3>Break</h3>
                    <input className={styles.inp} type="number" />
                </div>

                <div className={styles.input_container}>
                    <h3>Work</h3>
                    <input className={styles.inp} type="number" />
                </div>

                <div className={styles.input_container}>
                    <h3>Auto Start Breaks</h3>
                    <Switch
                        isOn={autoBreak}
                        handleToggle={() => setAutoBreak(!autoBreak)}
                    />
                </div>

                <button onClick={handleDoneClick} className={styles.btn}>Done</button>
            </div>
        </>
    );
}

export default SettingsModal;