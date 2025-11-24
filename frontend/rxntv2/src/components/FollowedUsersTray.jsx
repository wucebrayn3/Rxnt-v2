// Contains all followed users
// Summarizes all followed users
// Summarizes active followed users as well
// If empty, display link to discover page

import axiosInstance from "../axiosInstance";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import styles from '../styles/FollowedUsersTray.module.css';

export default function FollowedUsersTray () {

    const user = localStorage.getItem('username')

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
        <div className={styles.main} style={{height:`${mainStyle}px`}}>
            <div className={styles.header} onClick={toggle}>Followed users: {following.length}</div>
            <div className={styles.container} style={{height:`${containerStyle}px`}}>
                {following.map(f => (
                    <div key={f.id}>
                        <Link to={`/user/${f.id}/`}>{f.username}</Link>
                    </div>
                ))}
            </div>
        </div>
        
    )

}