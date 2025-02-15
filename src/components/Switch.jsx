import React from 'react';
import styles from "../styles/Switch.module.css";

const Switch = ({ isOn, handleToggle }) => {
    return (
        <>
          <input
            checked={isOn}
            onChange={handleToggle}
            className={styles.reactSwitchCheckbox}
            id="react-switch-new"
            type="checkbox"
          />
          <label className={`${styles.reactSwitchLabel} ${isOn ? styles.reactSwitchLabelOpen : ''}`} htmlFor="react-switch-new">
            <span className={styles.reactSwitchButton} />
          </label>
        </>
      );
};

export default Switch;