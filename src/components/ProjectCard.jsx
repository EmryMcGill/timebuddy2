//style imports
import styles from "../styles/ProjectCard.module.css";
// package imports
import { FaPlay } from "react-icons/fa";
import { FaStop } from "react-icons/fa6";
const ProjectCard = ({ title, isActive, id, setActiveProject, handleStart, handleStop }) => {
    return (
        <div className={`${styles.card} ${isActive ? styles.card_active : ''}`}>
            <h2>{title}</h2>
            <button className={styles.btn_icon} onClick={() => {
                if (isActive) {
                    setActiveProject(null);
                    handleStop();
                }
                else {
                    console.log('start')
                    setActiveProject(id);
                    handleStart();
                }
            }}>
                {!isActive ? <FaPlay size={'1rem'} /> : '' }
                {isActive ? <FaStop size={'1rem'} /> : '' }
            </button>
        </div>
    );
}

export default ProjectCard;