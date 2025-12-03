import styles from '../styles/Threads.module.css'
import axiosInstance from '../axiosInstance';
import { useState, useEffect } from 'react';

export default function CreatePostPanel () {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const createPost = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/app/create-post/',
                {title, content}
            )
            setTitle('');
            setContent('');
        } catch (err) {
            console.error('Error sa createpost: ' + err)
        }
    }

    return (
        <div className={styles.post_panel}>
            <h2>Create post</h2>
            <h3>{localStorage.getItem('username')}</h3>
            <form onSubmit={createPost}>
                <legend htmlFor='title'>Title</legend>
                <input onChange={(e)=>setTitle(e.target.value)} type="text" name="title" id="title" placeholder="Enter title here..." required/>

                <legend htmlFor='content'>Content</legend>
                <textarea onChange={(e)=>setContent(e.target.value)} name="content" id="content" placeholder="Enter content here..." required rows={3}></textarea>

                <input type="submit" value="Submit"/>
            </form>
        </div>
    )
}