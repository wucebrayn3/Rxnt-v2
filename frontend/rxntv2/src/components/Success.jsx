import { useEffect, useState } from "react";
import { useTheme } from "../utils/ThemeContext";

import styles from '../styles/Success.module.css';

export default function Success({ target, action }) {

    const {bg2, fontColor, shadow} = useTheme();

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000);

        return () => clearTimeout(timer); 
    }, []);

    const message = (() => {
        switch (target) {

            case 'user':
                switch (action) {
                    case 'follow': return "You followed the user.";
                    case 'unfollow': return "You unfollowed the user.";
                    case 'login': return "Logged in successfully.";
                    case 'logout': return "Logged out successfully.";
                    case 'register': return "Account created successfully!";
                    default: return "";
                }

            case 'post':
                switch (action) {
                    case 'post': return "Post created successfully!";
                    case 'edit': return "Post edited successfully.";
                    case 'delete': return "Post deleted.";
                    case 'report': return "Post reported.";
                    default: return "";
                }

            case 'comment':
                switch (action) {
                    case 'comment': return "Comment posted.";
                    case 'reply': return "Reply added.";
                    case 'edit': return "Comment edited.";
                    case 'delete': return "Comment deleted.";
                    case 'report': return "Comment reported.";
                    default: return "";
                }

            case 'notification':
                return "Notification sent.";

            default:
                return "";
        }
    })();

    if (!message || !visible) return null;

    return (
        <div className={styles.main} style={{backgroundColor: bg2, color: fontColor, boxShadow: `0 2px 4px ${shadow}`}}>
            {message}
        </div>
    );
}
