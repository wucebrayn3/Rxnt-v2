import { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useTheme } from "../utils/ThemeContext";

import styles from '../styles/CreateComment.module.css';
import Success from "./Success";

export default function CreateComment({ postId, parent, reload }) {

    const { mode, fontColor, shadow } = useTheme();
    const [query, setQuery] = useState('');

    const [successInfo, setSuccessInfo] = useState(null);
    const [reset, setReset] = useState(0);

    const createComment = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/app/create-comment/', {
                content: query,
                post: postId,
                parent
            });

            setQuery('');

            reload();

            setSuccessInfo({ target: 'comment', action: parent ? 'reply' : 'comment' });
            setReset(prev => prev + 1);

        } catch (err) {
            console.error('Error creating comment: ', err);
        }
    };

    return (
        <div className={styles.main}>
            
            {successInfo && (
                <Success
                    target={successInfo.target}
                    action={successInfo.action}
                    reset={reset}
                />
            )}

            <form onSubmit={createComment}>
                <input
                    style={{ boxShadow: `0 2px 2px ${shadow}`, border: 'none' }}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type comment here"
                    id="createComment"
                    name="createComment"
                    type="text"
                    value={query}
                    required
                />
                <input
                    type="submit"
                    value="Submit"
                    style={{ background: mode, color: fontColor, boxShadow: `0 2px 2px ${shadow}` }}
                />
            </form>
        </div>
    );
}
