import { useState } from "react";
import styles from "../styles/Home.module.css";
import { GiPauseButton } from "react-icons/gi";


const Landing = () => {

    const [mode, setMode] = useState("focus");
    const [clock, setClock] = useState(1500);
    const [timerActive, setTimerActive] = useState(false);
    const [timer, setTimer] = useState(null);


    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }

    const handleChangeMode = () => {
        if (mode == 'focus') {
            setMode('break');
            stopTimer();
            setClock(300);
        }
        else {
            setMode('focus');
            setClock(1500);
            stopTimer();
        }
    }

    const startTimer = async (focus) => {
        // 1. stop any current clock use
        if (timer) {
            await stopTimer();
        }

        let end;
        if (focus) {
            end = Date.now() + clock * 1000;
            setTimerActive('focus');
        }
        else {
            end = Date.now() + clock * 1000;
            setTimerActive('break');
        }

        // 2. updateClock function
        const updateClock = async () => {
            const remaining = Math.ceil((end - Date.now()) / 1000); 
            setClock(remaining);

            if (remaining <= 0) {
                //audio.play();
                // end of timer session
                await stopTimer();

                handleChangeMode();
            }
        };
        updateClock();
        
        // 4. create and start interval
        const timerLocal = setInterval(updateClock, 1000);
        setTimer(timerLocal);
    }

    const stopTimer = async () => {
        setTimerActive(false);

        // 2. stop the interval
        setTimer(prevTimer => {
            if (prevTimer !== null) {
                clearInterval(prevTimer);
            }
            return null;
        });

        // reset clock
        if (mode == 'focus') {
            setClock(1500);
        }
    }

    const pauseTimer = async () => {
        setTimerActive(null);
        clearInterval(timer);
        setTimer(null);
    }

    return (
        <div className='page'>
            <div 
                style={{
                    display: 'flex',
                    width: '100%',
                    gap: '1rem',
                    justifyContent: 'flex-end',
                    padding: '1rem'
                }}
            >
                <button
                    style={{
                        padding: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                    }}
                >Login</button>
                <button
                    style={{
                        padding: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        borderRadius: '8px'
                    }}
                >Sign Up</button>
            </div>
            <div className={styles.timer_container}>
                <div className={styles.mode_container}>
                    <button 
                        className={`${styles.btn_mode} ${mode === 'focus' ? styles.btn_mode_active : ''}`}
                        onClick={handleChangeMode}
                        >
                            Focus
                    </button>
                    <button 
                        className={`${styles.btn_mode} ${mode === 'break' ? styles.btn_mode_active : ''}`}
                        onClick={handleChangeMode}
                        >
                            Break
                    </button>
                </div>

                <h1 className={styles.timer}>{formatTime(clock)}</h1>

                {mode === 'focus' ?
                    timerActive ? 
                    <div className={styles.btn_container}>
                        <button
                            onClick={() => pauseTimer()}
                            className={styles.btn_focus}
                            style={{aspectRatio: '1 / 1', paddingLeft: '0.5rem', paddingRight: '0.5rem'}}
                        >
                                <GiPauseButton />
                        </button>
                        <button 
                            onClick={() => stopTimer()} 
                            className={styles.btn_focus}
                        >
                                End Focus
                        </button>
                    </div>
                    :
                        <button 
                            onClick={() => startTimer(true)} 
                            className={styles.btn_focus}
                        >
                                Focus
                        </button>
                    
                :
                    timerActive ? 
                        <div className={styles.btn_container}>
                            <button
                                onClick={() => pauseTimer()}
                                className={styles.btn_break}
                                style={{aspectRatio: '1 / 1', paddingLeft: '0.5rem', paddingRight: '0.5rem'}}
                            >
                                    <GiPauseButton />
                            </button>
                            <button 
                                onClick={stopTimer} 
                                className={styles.btn_break}
                            >
                                    End Break
                            </button> 
                        </div>
                    : 
                        <button 
                            onClick={startTimer} 
                            className={styles.btn_break}
                        >
                                Break
                        </button>
                }
            </div>

            <p style={{marginTop: '2rem', fontSize: '1.5rem'}}>Sign up for free to create projects, stay focused, and track your time effortlessly.</p>
        </div>
    );
}

export default Landing;