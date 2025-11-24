import { useState } from "react";

import styles from '../styles/Report.module.css';

export default function Report ({ id, username, title, content, type }) { 
    // title if possible, type: comment or post or user

    const [toggle, setToggle] = useState(false)

    const report = () => {
        setToggle(t => t ? false : true)
    }

    return (
        <div className={styles.main}>
            <h5 className={styles.report} onClick={report}>Report</h5>
            {toggle && 
                <div className={styles.report_panel}>
                    <div className={styles.report_panel_sub_container}>
                        <h5 onClick={report}>Close</h5>
                        <h3>Tell us why.</h3>
                        <div className={styles.report_content}>
                            <h5>Type: {type}</h5>
                            <p>Author: {username}</p>
                            <p>Title: {title}</p>
                            <p>Content: {content}</p>
                            <p>Item ID: {id}</p>
                        </div>
                        <form action="">
                            <textarea name="" id="" rows={3}></textarea>
                        </form>
                    </div>
                </div>
            }
        </div>
    )

}