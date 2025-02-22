//style imports
import styles from "../styles/Stats.module.css";
// API imports
import { usePocket } from "../PbContext"; 
import { useEffect, useState } from "react";
// component imports
import TopBar from "../components/TopBar";

const Stats = () => {
    // hooks
    const { 
        logout,
        projects,
        time,
        loading,
        user,
        updateSettings,
     } = usePocket();

     // local state
     const [maxTime, setMaxTime] = useState();
     const [projectTimes, setProjectTimes] = useState({});

     useEffect(() => {
        // create the project time list
        let projectTimesLocal = {};
        projects.forEach(proj => {
            projectTimesLocal[proj.id] = 0;
            const times = time.filter(t => t.project === proj.id);
            times.forEach(t => projectTimesLocal[proj.id] += t.time);
        });

        // conver to array
        const totalTimeArray = Object.entries(projectTimesLocal).map(([project, time]) => ({
            project,
            time,
        }));

        // find the largest time
        const m = Math.max(...totalTimeArray.map(t => t.time))
        setMaxTime(m);
        setProjectTimes(projectTimesLocal);
    }, [time]);

    // render
    return (
        <div className="page">
            <TopBar />

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