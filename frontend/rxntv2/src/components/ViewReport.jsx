import axiosInstance from '../axiosInstance';
import { useState } from 'react';

import styles from '../styles/ViewReport.module.css';

export default function ViewReport ({ onClose, complainant, item_type, item_author, item_author_id, item_id, title, content, reason, admin }) {

    const [toggleApprove, setToggleApprove] = useState(false)

    const approveReport = () => {
        setToggleApprove(ta => ta ? false : true)
    }

    const sendNotification = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('app/notification/send/',
                {
                    recipient: item_author_id,
                    sender: admin,
                    topic: e.target[0].value,
                    content: e.target[1].value
                }
            )
        } catch (err) {
            console.error(`Hindi ma-send notification pare: ${err}`)
        }
    }
    return (
        <div className={styles.main}>
            <div className={styles.report_details}>
                <button onClick={e => onClose()}>Close</button>
                <h4>Complainant: {complainant}</h4>
                <h4>Reported Item Author: {item_author}</h4>
                <p>Type: {item_type}</p>
                <p>Item ID: {item_id}</p>
                <p>Title: {title}</p>
                <p>Content: {content}</p>
                <h4>Reason:</h4>
                <p>{reason}</p>
                <button onClick={approveReport}>Approve Notification</button>
                {toggleApprove && 
                    <form action="" onSubmit={sendNotification}>
                        <label htmlFor="topic">Topic:</label>
                        <input type="text" name="topic" id="topic" />
                        <label htmlFor="reply">Reply: </label>
                        <textarea name="reply" id="reply" rows={3}></textarea>
                        <input type="submit" value="Send Notification" />
                    </form>
                }
            </div>
        </div>
    )

}