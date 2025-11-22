import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import styles from '../styles/CreateComment.module.css'

export default function CreateComment({ postId, parent, reload }) {
    const [query, setQuery] = useState('')
    // const [parent, setParent] = useState(null)

    const createComment = async (e) => {
        e.preventDefault()
        try {
            console.log(query)
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
        // onComment();
    }

    return (
        <div className={styles.main}>
            <form onSubmit={createComment} action="">
                <input onChange={(e)=>setQuery(e.target.value)} type="text" required/>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}