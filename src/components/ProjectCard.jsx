//style imports
import styles from "../styles/ProjectCard.module.css";
// package imports
import { FaPlay } from "react-icons/fa";
import { FaStop } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";
// component imports
import { useState } from "react";

const ProjectCard = ({ title, isActive, id, setActiveProject, handleStart, handleStop }) => {
    
    const [titleEdit, setTitleEdit] = useState(title);
    const [edit, setEdit] = useState(false);


    const handleAction = () => {
        if (isActive) {
            setActiveProject(null);
            handleStop();
        }
        else {
            console.log('start')
            setActiveProject(id);
            handleStart();
        }
    }
    
    return (
        <div className={`${styles.card} ${isActive ? styles.card_active : ''}`}>
            <div className={`${styles.normal}`} style={edit ? { display: 'none' } : {}} >
                <h2>{title}</h2>
                <div className={styles.right_container}>
                    <div style={{position: 'relative'}}>
                        <button 
                            className={`${styles.btn_icon} ${styles.options}`}
                            onClick={() => setEdit(!edit)}>
                            <HiDotsHorizontal size={'1rem'} />
                        </button>
                    </div>
                    
                    <button className={styles.btn_icon} onClick={handleAction}>
                        {!isActive ? <FaPlay size={'1rem'} /> : '' }
                        {isActive ? <FaStop size={'1rem'} /> : '' }
                    </button>
                </div>
            </div>

            <div className={styles.edit} style={edit ? { display: 'flex' } : {}}>
                <input 
                    className={styles.inp} 
                    autoFocus 
                    type="text" 
                    value={titleEdit} 
                    onChange={(e) => setTitleEdit(e.target.value)} />
                <div className={styles.btn_container}>
                    <button className={styles.btn}>Delete</button>
                    <button style={{marginLeft: 'auto'}} className={styles.btn}>Cancel</button>
                    <button className={`${styles.btn} ${styles.btn_save}`}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;