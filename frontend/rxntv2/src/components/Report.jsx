import { useState } from "react";

import styles from '../styles/Report.module.css';
import axiosInstance from "../axiosInstance";

export default function Report ({ item_id, author, title, content, type, username, close }) { 
    // title if possible, type: comment or post or user

    const [toggle, setToggle] = useState(false);
    const [reason, setReason] = useState('');

    const report = () => {
        setToggle(t => t ? false : true)
        console.log('clicked');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (type != 'user') {
            try {
                const response = await axiosInstance.post('app/report/nonuser/',
                    {
                        reported_author: author,
                        reported_object: type,
                        reported_id: item_id,
                        content: content,
                        title: title != null ? title : 'Comment does not have title field.',
                        reason: reason
                    }
                )
                console.log(response.data)
            } catch (err) {
                console.error(`Di gumana report pre: ${err}`)
            }
        } else if (type == 'user') {
            try {
                const response = await axiosInstance.post('app/report/user/',
                    {
                        reported_author: item_id,
                        reason: reason,
                    }
                )
                console.log(response.data)
            } catch (err) {
                console.error(`Di gumana report pre: ${err}`)
            }
        }
    }

    return (
        <div className={styles.main}>
            {type != 'user' && <h6 className={styles.report} onClick={report}>Report</h6>}
            {type != 'user' && toggle && 
                <div className={styles.report_panel}>
                    <div className={styles.report_panel_sub_container}>
                        <h5 onClick={report}>Close</h5>
                        <h3>Tell us why.</h3>
                        <div className={styles.report_content}>
                            <h5>Type: {type}</h5>
                            <p>Author: {username}</p>
                            <p>Title: {title}</p>
                            <p>Content: {content}</p>
                            <p>Item ID: {item_id}</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <textarea onChange={e => setReason(e.target.value)} name="" id="" rows={3}></textarea>
                            <input type="submit" value="Submit" />
                        </form>
                    </div>
                </div>
            }
            {type == 'user'  &&
                <div>
                    <div className={styles.report_panel}>
                        <div className={styles.report_panel_sub_container}>
                            <h5 onClick={() => close()}>Close</h5>
                            <h3>Tell us why.</h3>
                            <div className={styles.report_content}>
                                <h5>Type: {type}</h5>
                                <p>Username: {username}</p>
                                <p>User ID: {item_id}</p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <textarea onChange={e => setReason(e.target.value)} name="" id="" rows={3}></textarea>
                                <input type="submit" value="Submit" />
                            </form>
                        </div>
                    </div>
                </div>
            }
        </div>
    )

}