import { useState } from "react";
import { useTheme } from "../utils/ThemeContext";

import styles from '../styles/Report.module.css';
import axiosInstance from "../axiosInstance";
import klows from '../assets/close.png';
import Success from "./Success";

export default function Report({ item_id, author, title, content, type, username, close }) {

    const { color, fontColor, shadow, bg3 } = useTheme();

    const [toggle, setToggle] = useState(false);
    const [reason, setReason] = useState('');
    const [successInfo, setSuccessInfo] = useState(null);
    const [reset, setReset] = useState(0);

    const report = () => setToggle(t => !t);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (type !== 'user') {
                // backend expects content reports at app/report/content/
                await axiosInstance.post('app/report/content/', {
                    reported_author: author,
                    reported_object: type,
                    reported_id: item_id,
                    content: content,
                    title: title != null ? title : 'Comment does not have title field.',
                    reason: reason
                });
            } else {
                await axiosInstance.post('app/report/user/', {
                    reported_author: item_id,
                    reason: reason,
                });
            }

            setToggle(false);
            setReason('');

            setTimeout(() => {
                setSuccessInfo({ target: type === 'user' ? 'user' : 'post', action: 'report' });
                setReset(prev => prev + 1);
            }, 100);

        } catch (err) {
            console.error(`Report failed: ${err}`);
        }
    };

    return (
        <>
            {successInfo && (
                <Success
                    key={reset}
                    target={successInfo.target}
                    action={successInfo.action}
                />
            )}

            <div className={styles.main}>
                {type !== 'user' && (
                    <>
                        <h6
                            style={type === 'post' ? { '--hover': fontColor, zIndex: 1 } : { color: '#ef233c', zIndex: -100 }}
                            className={styles.report}
                            onClick={report}
                        >
                            Report
                        </h6>

                        {toggle && (
                            <div className={styles.report_panel}>
                                <div className={styles.report_panel_sub_container} style={{ border: 'none', color: fontColor, backgroundColor: bg3, boxShadow: `0 2px 4px ${shadow}` }}>
                                    <img src={klows} alt="Close" onClick={report} />
                                    <h3>Tell us why.</h3>
                                    <div className={styles.report_content}>
                                        <h5>Type: {type}</h5>
                                        <p>Author: {username}</p>
                                        <p>Title: {title}</p>
                                        <p>Content: {content}</p>
                                        <p>Item ID: {item_id}</p>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <textarea
                                            value={reason}
                                            onChange={e => setReason(e.target.value)}
                                            rows={5}
                                            style={{ width: '100%' }}
                                            required
                                        ></textarea>
                                        <input type="submit" value="Submit" style={{ width: '100%', backgroundColor: '#F5F5F5' }} />
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {type === 'user' && (
                    <div className={styles.report_panel}>
                        <div className={styles.report_panel_sub_container} style={{ border: 'none', color: fontColor, backgroundColor: bg3, boxShadow: `0 2px 4px ${shadow}` }}>
                            <div className={styles.close}>
                                <img src={klows} alt="Close" onClick={close} />
                            </div>
                            <h3>Tell us why.</h3>
                            <div className={styles.report_content}>
                                <h5>Type: {type}</h5>
                                <p>Username: {username}</p>
                                <p>User ID: {item_id}</p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <textarea
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                    rows={3}
                                    style={{ width: '100%' }}
                                    required
                                ></textarea>
                                <input type="submit" value="Submit" style={{ width: '100%', backgroundColor: '#F5F5F5' }} />
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
