import axiosInstance from "../axiosInstance";
import { useEffect } from "react";

import styles from '../styles/ViewNotification.module.css';

export default function ViewNotification ({ id, topic, content, reload }) {

    const setIsRead = async () => {
        try {
            const response = await axiosInstance.patch(`app/notifications/${id}/`, 
                {
                    is_read:true,
                }
            )
            reload();
        } catch (err) {
            console.log(`The id is ${id}`)
            console.error(`Di mabasa, bro can't read: ${err}`)
        }
    }
    
    useEffect(() => {
        setIsRead();
    }, []);

    return (
        <div className={styles.main}>
            <h3>{topic}</h3>
            <p>{content}</p>
            <button className={styles.delete}>Delete</button>
        </div>
    )

}