//style imports
import styles from "../styles/ProjectCard.module.css";
// package imports
import { FaPlay } from "react-icons/fa";
import { FaStop } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";

const ProjectCard = ({ title, isActive, id, setActiveProject, handleStart, handleStop }) => {
    
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
            <h2>{title}</h2>
            <div className={styles.right_container}>
                <button className={`${styles.btn_icon} ${styles.options}`}>
                    <HiDotsHorizontal size={'1rem'} />
                </button>
                <button className={styles.btn_icon} onClick={handleAction}>
                    {!isActive ? <FaPlay size={'1rem'} /> : '' }
                    {isActive ? <FaStop size={'1rem'} /> : '' }
                </button>
            </div>
        </div>
    );
}

export default ProjectCard;