//style imports
import { useState } from "react";
import styles from "../styles/ProjectEditCard.module.css";
// package imports

const ProjectEdiCard = ({ handleSubmit, closeCreateProject }) => {

    const [title, setTitle] = useState('');

    const handleSubmitClick = async () => {
        closeCreateProject();
        await handleSubmit(title);
    }

    return (
        <>
            <div onClick={handleSubmitClick} className='overlay'></div>
            <div className={styles.card}>
                <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className={styles.inp} autoFocus type="text"
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        handleSubmitClick();
                    }
                  }} />
                <button 
                className={styles.btn} 
                onClick={handleSubmitClick}>Create</button>
            </div>
        </>
    );
}

export default ProjectEdiCard;