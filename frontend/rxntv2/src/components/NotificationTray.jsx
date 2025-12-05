import axiosInstance from "../axiosInstance";
import { useEffect, useState } from "react";
import { useTheme } from "../utils/ThemeContext";

import ViewNotification from "./ViewNotification";

import styles from '../styles/NotificationTray.module.css';
import noNotif from '../assets/notification (1).png';

export default function NotificationTray () {

    const {color, mode, bg2, fontColor} = useTheme();

    const [toggle, setToggle] = useState(false)
    const [notifications, setNotifications] = useState([]);
    const [toggleView, setToggleView] = useState(false);
    const [notifId, setNotifId] = useState(null);
    const [notifTopic, setNotifTopic] = useState(null);
    const [notifContent, setNotifContent] = useState(null);

    const loadNotifications = async () => {
        try {
            const response = await axiosInstance.get(`app/notifications/`);
            setNotifications(response.data);
            console.log(response.data)
        } catch (err) {
            console.error(err);
        };
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const viewNotif = (id, topic, content) => {
        setToggleView(t => t ? false : true);
        setNotifId(id);
        setNotifTopic(topic);
        setNotifContent(content);
    };

    const closeNotif = () => {
        setToggleView(t => t ? false : true);
    }

   const handleToggle = () => {
    
    setToggle(t => t ? false : true);
   };

   const reload = () => {
    loadNotifications();
   }

    return (
        <>
            <div className={styles.main} onClick={handleToggle} style={{'--shadow': color, color: fontColor}}>
                <img src={noNotif} alt="" />
            </div>
            {toggle && 
                <div className={styles.notifications} onWheel={e => e.stopPropagation()} onClick={e => e.stopPropagation()} style={{backgroundColor: mode, color: fontColor}}>
                    {!toggleView && notifications.map(notif => (
                        <div className={styles.notif} key={notif.id} onClick={() => viewNotif(notif.id, notif.topic, notif.content)} style={notif.is_read ? {backgroundColor: color, '--highlight': bg2} : {'--highlight': bg2}}>
                            <h5>{notif.topic}</h5>
                            <p>{notif.content.length > 20 ? `${notif.content.slice(0,20)}...` : notif.content}</p>
                        </div>
                    ))}
                    {toggleView && <><button onClick={closeNotif} className={styles.close}>Close</button><ViewNotification id={notifId} topic={notifTopic} content={notifContent} reload={reload}/></>}
                </div>
            }
        </>
        
    );

};