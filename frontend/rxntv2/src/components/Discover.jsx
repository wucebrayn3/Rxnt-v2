import axiosInstance from "../axiosInstance";
import { useState, useEffect } from "react";
import { useTheme } from "../utils/ThemeContext";

import FollowButton from "./FollowButton";
import Header from "./Header";

import styles from '../styles/Discover.module.css';

export default function Discover () {

    const {mode, color, fontColor, shadow, bg2} = useTheme();
    const [users, setUsers] = useState([])

    const loadUsers = async () => {
        try {
            const response = await axiosInstance('discover/')

            console.log(response.data)
            setUsers(response.data)
        } catch (err) {
            console.error(`Pambihirang error: ${err}`)
        }
    }

    const loadFollow = async () => {
        try {
            const response = await axiosInstance.get('discovery/')
            console.log(response.data)
        } catch (err) {
            console.error(ee)
        }
    }

    const reload = () => {
        loadUsers();
    }

    useEffect(() => {
        loadUsers();
    }, [])

    // users.length > 0 && users.map((u) => {
    //     u.followers;
    //     u.
    // })

    return (
        <div className={styles.main} style={{ backgroundColor: mode, color: fontColor }}>
            <div className={styles.maine_mendoza}>
                <Header />
                {users.map(u => (
                    <div key={u.id} className={styles.user} style={{boxShadow: `0 2px 4px ${shadow}`, backgroundColor: bg2}}>
                        <div className={styles.upper_section}>
                            <h3 >{u.username}</h3>
                            <FollowButton is_following_user={u.is_following} id={u.id} onBtnClick={reload}/>
                        </div>
                        <div className={styles.connection_count}>
                            <p>Followers: {u.followers_count}</p>
                            <p>Following: {u.following_count}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}