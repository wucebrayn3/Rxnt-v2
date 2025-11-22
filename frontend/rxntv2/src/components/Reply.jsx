import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import styles from '../styles/Reply.module.css';

export default function CreateReply ({ postId, parent }) {
    
    const [toggle, setToggle] = useState(false);
    const [query, setQuery] = useState('');


    const handleToggle = () => {
        setToggle(kumag => kumag ? false : true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console
        try {
            const response = await axiosInstance.post('/app/create-comment/',
                {
                    content: query,
                    post: postId,
                    parent: parent?parent:null
                }
            )
            console.log(response)
        } catch (err) {
            console.error('Engk sa reply man: ', err)
        }
    }

    return (
        <div className={styles.main}>
            <h6 className={styles.reply} onClick={handleToggle}>Reply</h6>
            {toggle && 
                <form onSubmit={handleSubmit} action="" onReset={handleToggle}>
                    <input onChange={(e)=>setQuery(e.target.value) } type="text" name="" id="" />
                    <input type="submit" value="Submit" />
                    <input type="reset" value="Cancel" />
                </form>
            }
        </div>
    )
}