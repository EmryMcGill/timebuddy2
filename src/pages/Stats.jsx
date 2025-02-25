//style imports
import styles from "../styles/Stats.module.css";
import { IoIosArrowDown } from "react-icons/io";
// API imports
import { usePocket } from "../PbContext"; 
import { useEffect, useRef, useState } from "react";
// component imports
import TopBar from "../components/TopBar";
import DropMenu from "../components/DropMenu";

const Stats = () => {
    // hooks
    const { 
        projects,
        time,
        mode,
        clock
     } = usePocket();
     const dropRef = useRef();

     // local state
     const [maxTime, setMaxTime] = useState();
     const [projectTimes, setProjectTimes] = useState({});
     const [drop, setDrop] = useState(false);
     const [timeRange, setTimeRange] = useState('Today');

     useEffect(() => {
        // create the project time list
        let projectTimesLocal = {};
        projects.forEach(proj => {
            projectTimesLocal[proj.id] = 0;
            const times = time.filter(t => {
                if (timeRange === 'Today') {
                    const today = new Date();
                    const created = new Date(t.created);

                    return t.project === proj.id && created.toDateString() === today.toDateString();
                }
                else if (timeRange === 'Last 7 days') {
                    const today = new Date();
                    const cutoff = new Date().setDate(today.getDate() - 7);
                    const created = new Date(t.created);

                    return t.project === proj.id && created >= cutoff && created <= today;
                }
                else if (timeRange === 'Last 30 days') {
                    const today = new Date();
                    const cutoff = new Date().setDate(today.getDate() - 30);
                    const created = new Date(t.created);

                    return t.project === proj.id && created >= cutoff && created <= today;
                }
                return t.project === proj.id
            });
            times.forEach(t => projectTimesLocal[proj.id] += t.time);
        });

        // conver to array
        const totalTimeArray = Object.entries(projectTimesLocal).map(([project, time]) => ({
            project,
            time,
        }));

        // find the largest time
        let m = Math.max(...totalTimeArray.map(t => t.time));
        // round to next hour
        m = Math.ceil(m / 3600);
        
        if (m === 0) {
            m = 1;
        }

        setMaxTime(m * 3600);
        setProjectTimes(projectTimesLocal);
    }, [time, timeRange]);

    useEffect(() => {
        if (mode === 'focus') {
            document.title = `${formatTime(clock)} - Focus`;
        }
        else {
            document.title = `${formatTime(clock)} - Break`;
        }
     });

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
    }

    // render
    return (
        <div className="page">
            <TopBar />

            <div className={styles.time_range_container}>
            <h2>Time Range</h2>
            <div style={{position: 'relative'}}>
                <button ref={dropRef} onClick={() => setDrop(!drop)} className={styles.btn_drop}>{timeRange} <IoIosArrowDown /></button>
                {drop ? <DropMenu
                            closeModal={() => setDrop(!drop)}
                            buttonRef={dropRef}
                            setTimeRange={(e) => setTimeRange(e)} /> : ''}
                </div>
            </div>

            <div className={styles.stats_container}>
                {projects.map((proj, index) => (
                    <div key={index} className={styles.grid_row}>
                        <div className={styles.grid_item}>
                            <h2>{proj.title}</h2>
                        </div>
                        <div 
                            className={styles.time_bar} 
                            style={{width: `${projectTimes[proj.id] / maxTime * 100}%`}}></div>
                        <h2 style={{marginLeft: '1rem'}}>
                            {projectTimes[proj.id] >= 3600 ? Math.floor(projectTimes[proj.id] / 3600) + ' hr ' : ''}
                            {projectTimes[proj.id] >= 60 ? Math.floor((projectTimes[proj.id] % 3600) / 60) + ' min ' : ''}
                            {projectTimes[proj.id] < 60 ? Math.floor(projectTimes[proj.id] % 60) + ' sec ' : ''}
                        </h2>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Stats;