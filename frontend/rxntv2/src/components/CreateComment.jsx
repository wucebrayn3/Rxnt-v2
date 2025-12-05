import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import styles from '../styles/CreateComment.module.css';

export default function CreateComment({ postId, parent, reload }) {
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
                <input onChange={(e)=>setQuery(e.target.value)} placeholder="Type comment here" id="createComment" name="createComment" type="text" required/>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}