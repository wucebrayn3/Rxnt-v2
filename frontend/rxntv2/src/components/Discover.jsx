import axiosInstance from "../axiosInstance";
import { useState, useEffect } from "react";

import FollowButton from "./FollowButton";

import styles from '../styles/Discover.module.css';

export default function Discover () {

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
        <div className={styles.main}>
            {users.map(u => (
                <div key={u.id}>
                    <div className={styles.upper_section}>
                        <h3 >{u.username}</h3>
                        <FollowButton is_following_user={u.is_following} id={u.id} onBtnClick={reload}/>
                    </div>
                    <div className={styles.connection_count}>
                        <p>Followers:</p>
                        <p>Following:</p>
                    </div>
                </div>
            ))}
        </div>
    )
}