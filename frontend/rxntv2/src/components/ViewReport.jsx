import axiosInstance from '../axiosInstance';
import { useState, useEffect } from 'react';

import styles from '../styles/ViewReport.module.css';
import klows from '../assets/close.png';

export default function ViewReport ({ onClose, complainant, complainant_id, item_type, item_author, item_author_id, item_id, title, content, reason, admin }) {

    const [toggleApprove, setToggleApprove] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [sendTo, setSendTo] = useState(item_author_id);
    const [topic, setTopic] = useState(null);
    const [reply, setReply] = useState(null);
    const [valid, setValid] = useState(false)

    useEffect(() => {

    })

    const handleCheckBox = (e) => {
        setIsChecked(e.target.checked);
        setSendTo(e.target.checked ? complainant_id : item_author_id);
        e.target.checked ? console.log(complainant_id) : console.log(item_author_id)
    }

    const approveReport = () => {
        setToggleApprove(ta => ta ? false : true)
    }

    const sendNotification = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('app/notifications/',
                {
                    recipient: sendTo,
                    sender: admin,
                    topic: e.target[0].value,
                    content: e.target[1].value
                }
            )
        } catch (err) {
            console.error(`Hindi ma-send notification pare: ${err}`)
        }
    }

    useEffect(() => {
        console.log(sendTo)
    }, [sendTo])

    useEffect(() => {
        console.log('view report mounted')
    }, [])

    return (
        <div className={styles.main}>
            <div className={styles.report_details}>
                <div className={styles.close_container}>
                    <button className={styles.close} onClick={e => onClose()}>
                        <img src={klows} alt="close" />
                    </button>
                </div>
                <div className={styles.reason}>
                    <h4>Reason:</h4>
                    <p>{reason}</p>
                </div>
                <div className={styles.contents}>
                    <p>Type: {item_type}</p>
                    <p>Item ID: {item_id}</p>
                    <p>Title: {title}</p>
                    <p>Content: {content}</p>
                </div>
                <div>
                    <h4>Complainant: {complainant}</h4>
                    <h4>Reported Item Author: {item_author}</h4>
                </div>
                <button className={styles.approve} onClick={approveReport}>Approve Report</button>
                {toggleApprove && 
                    <form action="" onSubmit={sendNotification}>
                        <label htmlFor="topic">Topic:</label>
                        <input type="text" name="topic" id="topic" required maxLength={30}/>
                        <label htmlFor="reply">Reply: </label>
                        <textarea name="reply" id="reply" rows={5} required maxLength={100}></textarea>
                        <div className={styles.chkbox}>
                            <span><input checked={isChecked} onChange={handleCheckBox} type='checkbox' name="sendto" id="sendto"/></span>
                            <label htmlFor="sendto">Send to complainant? (leave unchecked for reported user)</label>
                        </div>
                        <button type='submit' disabled={valid}>Submit</button>
                    </form>
                }
            </div>
        </div>
    )

}