//style imports
import styles from "../styles/ProjectCard.module.css";
// package imports
import { FaPlay } from "react-icons/fa";
import { FaStop } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";
// component imports
import { useState, useRef, useEffect } from "react";

const ProjectCard = ({ 
    title, 
    isActive, 
    id, 
    handleStart, 
    handleStop,
    handleDelete,
    handleUpdate }) => {
    
    const [titleEdit, setTitleEdit] = useState(title);
    const [edit, setEdit] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        if (edit && inputRef.current) {
            inputRef.current.focus();
        }
    }, [edit]);


    const handleAction = () => {
        if (isActive) {
            handleStop();
        }
        else {
            handleStart();
        }
    }

    const handleUpdateClick = async () => {
        await handleUpdate(id, titleEdit);
        setEdit(false);
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
                    type="text" 
                    value={titleEdit} 
                    onChange={(e) => setTitleEdit(e.target.value)}
                    ref={inputRef} />
                <div className={styles.btn_container}>
                    <button 
                        className={styles.btn}
                        onClick={() => handleDelete(id)}>Delete</button>
                    <button 
                        style={{marginLeft: 'auto'}} 
                        className={styles.btn}
                        onClick={() => setEdit(false)}>Cancel</button>
                    <button 
                        className={`${styles.btn} ${styles.btn_save}`}
                        onClick={handleUpdateClick}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;