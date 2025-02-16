//style imports
import styles from "../styles/Loading.module.css";
// package imports
import { AiOutlineLoading } from "react-icons/ai";

const Loading = () => {
    return (
        <div className={styles.container}>
                <AiOutlineLoading size={"2rem"} className={styles.icon} />
        </div>
    );
}

export default Loading;