import axiosInstance from "../axiosInstance";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../utils/ThemeContext";

import styles from '../styles/FollowedUsersTray.module.css';

export default function FollowedUsersTray () {

    const user = localStorage.getItem('username')

    const {fontColor, bg2, bg3, shadow} = useTheme();

    const [following, setFollowing] = useState([]);
    const [containerStyle, setContainerStyle] = useState(0);
    const [mainStyle, setMainStyle] = useState(50);

    const loadFollowedUsers = async () => {
        try {
            const response = await axiosInstance.get(`app/get/following/${user}`)
            console.log(response)
            setFollowing(response.data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        loadFollowedUsers();
    }, [])

    const toggle = () => {
        setContainerStyle(h => h === 0 ? 250 : 0)
        setMainStyle(h => h === 50 ? 300 : 50)
    }

    return (
        <div className={styles.main} style={{height:`${mainStyle}px`, color: fontColor, backgroundColor: bg2, border: 'none'}}>
            <div className={styles.header} onClick={toggle} style={{color: fontColor, backgroundColor: bg3, boxShadow: `0 4px 4px ${shadow}`}}>{following.length} Following</div>
            <div className={styles.container} style={{height:`${containerStyle}px`, backgroundColor: bg2}}>
                {following.map(f => (
                    <div key={f.id} style={{backgroundColor: bg2}}>
                        <Link to={`/user/${f.id}/`}><h4 style={{color: fontColor, backgroundColor: bg2}}>{f.username}</h4></Link>
                    </div>
                ))}
            </div>
        </div>
        
    )

}