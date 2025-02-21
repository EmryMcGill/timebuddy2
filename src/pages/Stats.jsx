// API imports
import { usePocket } from "../PbContext"; 


const Stats = () => {
    // hooks
    const { 
        logout,
        projects,
        loading,
        user,
        updateSettings,
     } = usePocket();
    return (
        <div className="page">

        </div>
    );
}

export default Stats;