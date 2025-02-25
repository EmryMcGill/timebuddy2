//style imports
import styles from "../styles/SettingsModal.module.css";
// package imports
import { useState } from "react";
// component imports
import Switch from "./Switch";

const SettingsModal = ({ closeModal, handleSubmit, bkInit, workInit }) => {
    const [autoBreak, setAutoBreak] = useState(false);
    const [bk, setBk] = useState(bkInit/60);
    const [work, setWork] = useState(workInit/60);

    const handleDoneClick = async () => {
        // make changes
        await handleSubmit(bk*60, work*60, autoBreak);

        // close modal
        closeModal();
    }

    return (
        <>
            <div onClick={handleDoneClick} className='overlay'></div>
            
            <div className={styles.card}>
                <h2>Settings</h2>

                <h3 style={{fontWeight: "600"}}>Timer (minutes)</h3>

                <div className={styles.input_container}>
                    <h3>Work</h3>
                    <input 
                        className={styles.inp} 
                        type="number"
                        value={work}
                        onChange={(e) => setWork(e.target.value)} />
                </div>

                <div className={styles.input_container}>
                    <h3>Break</h3>
                    <input 
                        className={styles.inp} 
                        type="number"
                        value={bk}
                        onChange={(e) => setBk(e.target.value)} />
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