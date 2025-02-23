//style imports
import styles from "../styles/DropMenu.module.css";
// package imports
import { useRef, useEffect } from "react";

const DropMenu = ({ 
    closeModal, 
    buttonRef, 
    setTimeRange
 }) => {

    const menuRef = useRef(null);

    // Close the menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if  (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)) {
                closeModal();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClick = (e) => {
        setTimeRange(e);
        closeModal();
    }

    return (
        <div className={styles.card} ref={menuRef}>
            <button onClick={() => handleClick('Today')} className={styles.btn}>Today</button>
            <button onClick={() => handleClick('Last 7 days')} className={styles.btn}>Last 7 days</button>
            <button onClick={() => handleClick('Last 30 days')} className={styles.btn}>Last 30 days</button>
        </div>
    );
}

export default DropMenu;