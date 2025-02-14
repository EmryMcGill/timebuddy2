//style imports
import styles from "../styles/Home.module.css";
// package imports
import { IoStatsChart } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
// component import 
import ProjectCard from "../components/ProjectCard";

const Home = () => {
    return (
        <div className='page'>
            <div className={styles.top_container}>
                <button className={styles.btn_icon}>
                    <IoStatsChart size={'2rem'} />
                </button>
                <button className={styles.btn_icon}>
                    <CgProfile size={'2rem'} />
                </button>
            </div>

            <h1 className={styles.timer}>05:32</h1>

            <button className={styles.btn_start}>Start Break</button>

            <div className={styles.projects_container}>
                <h3>Projects</h3>
                <ProjectCard isActive={true} />
                <ProjectCard />
                <ProjectCard />
                <button className={styles.btn_add_project}>+ Add Project</button>
            </div>
        </div>
    );
}

export default Home;