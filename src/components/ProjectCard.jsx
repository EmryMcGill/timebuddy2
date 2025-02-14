//style imports
import styles from "../styles/ProjectCard.module.css";
// package imports
import { FaPlay } from "react-icons/fa";
import { GiPauseButton } from "react-icons/gi";
const ProjectCard = ({ title, isActive }) => {
    return (
        <div className={`${styles.card} ${isActive ? styles.card_active : ''}`}>
            <h2>Title</h2>
            <button className={styles.btn_icon}>
                {!isActive ? <FaPlay size={'1rem'} /> : '' }
                {isActive ? <GiPauseButton size={'1rem'} /> : '' }
            </button>
        </div>
    );
}

export default ProjectCard;