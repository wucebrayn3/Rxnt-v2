// Contains all followed users
// Summarizes all followed users
// Summarizes active followed users as well
// If empty, display link to discover page

import axiosInstance from "../axiosInstance";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import styles from '../styles/NotificationTray.module.css';

export default function NotificationTray ({ me }) {

    

    const [notifications, setNotifications] = useState([]);
    const [containerStyle, setContainerStyle] = useState(0);
    const [mainStyle, setMainStyle] = useState(50);

    const loadNotifications = async () => {
        try {
            const response = await axiosInstance.get(`app/get/notifications/`)
            console.log(response.data)
            setNotifications(response.data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        loadNotifications();
    }, [])

   

    return (
        
        <div className={styles.main}>

        </div>
        
    )

}