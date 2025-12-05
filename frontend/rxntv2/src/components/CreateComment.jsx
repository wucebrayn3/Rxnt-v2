import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { useTheme } from "../utils/ThemeContext";

import styles from '../styles/CreateComment.module.css';

export default function CreateComment({ postId, parent, reload }) {

    const {mode, fontColor, shadow} = useTheme();
    const [query, setQuery] = useState('');

    const createComment = async (e) => {
        e.preventDefault()
        try {
            const response = await axiosInstance.post('/app/create-comment/',
                {
                    content:query,
                    post: postId,
                    parent
                }
            )
            
            reload();
        } catch (err) {
            console.error('Mali sa pag gawa ng comment mah dude: ', err)
        }
    };

    return (
        <div className={styles.main}>
            <form onSubmit={createComment} action="">
                <input style={{boxShadow: `0 2px 2px ${shadow}`, border: 'none'}} onChange={(e)=>setQuery(e.target.value)} placeholder="Type comment here" id="createComment" name="createComment" type="text" required/>
                <input type="submit" value="Submit" style={{background: mode, color: fontColor, boxShadow: `0 2px 2px ${shadow}`}}/>
            </form>
        </div>
    )
}