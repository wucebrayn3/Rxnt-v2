import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import arrowDown from '../assets/down-arrow.png';
import axiosInstance from "../axiosInstance";

import SearchUser from "./SearchUser.jsx";
import CreatePostPanel from "./CreatePost.jsx";
import Header from './Header.jsx'
import styles from '../styles/Threads.module.css';

export default function Threads() {

    const [threads, setThreads] = useState([]);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [allComments, setAllComments] = useState([]);
    const isLoaded = useRef(false);
    const [navState, setNavState] = useState(null);

    const togglePanel = (panel) => {
        setNavState(prev => prev === panel ? null : panel)
    };

    const loadThreads = async () => {
        try {
            const response = await axiosInstance.get('app/threads/')
            console.log(response.data)
            setThreads(response.data)
        } catch (err) {
            console.error('may mali dito pre: ', err)
        }
    };

    const loadUsers = async () => {
            try {
                const response = await axiosInstance.get('users/')
                console.log(response.data)
                setUsers(response.data)
            } catch (err) {
                console.error('May nagkamali sa pagkuha ng user tol: ', err)
            }
            console.log('loadUsers called')
        };

    const loadComments = async () => {
        try {
            const response = await axiosInstance.get('app/comments/')
            console.log((response.data).filter(data => data.parent != null))
            setAllComments((response.data))
            setComments((response.data).filter(data => data.parent == null))
        } catch (err) {
            console.error('May mali sa pagkuha ng comments pare ko: ', err)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    };

    useEffect(() => {
        if (!isLoaded.current) {
            console.log('effect triggered')
            
            loadComments();
            loadUsers();
            loadThreads();
            isLoaded.current = true;
        }
    }, []);

    const PostConstructor = ({ obj }) => (
        obj.map((o) => (
            <div key={o.id} className={styles.post_container}>
                {
                    o.comments.length > 0 ?
                    <>
                        <div className={styles.upper_panel}>
                            <Link to={`/user/${o.author}`}><h3>Author: {users[o.author - 1].username}</h3></Link>
                            <h3>{o.author}</h3>
                            <p className={styles.date}>{formatDate(o.created_at)}</p>
                        </div>
                        <div className={styles.content}>
                            <h4>Title: {o.title}</h4>
                            <p>{o.content}</p>
                            <div className={styles.comment_container}>
                                <h4>Comments:</h4>
                                <CommentConstructor obj={(o.comments).filter(c => c.parent == null)} objId={o.id}/>
                            </div>
                            <img style={{height: '20px'}} src={arrowDown} alt="" />
                        </div>
                    </>
                    :
                    <>
                       <div className={styles.upper_panel}>
                            <h3>Author: {users[o.author - 1].username}</h3>
                            <p style={{fontSize: '0.7rem'}}>{formatDate(o.created_at)}</p>
                        </div>
                        <div className={styles.content}>
                            <h4>Title: {o.title}</h4>
                            <p>{o.content}</p>
                        </div>
                    </> 
                }
            </div>
        ))        
    )

    const CommentConstructor = ({ obj, objId }) => (
        
        <>
            {   

                obj.map(o => (
                    <div key={o.id} className={styles.comment_subcontainer}>
                        {
                            
                            o.parent == null && o.post === objId ?
                            <>
                                <div className={styles.comment_item}>
                                    <h3>{users[o.author - 1].username}</h3>
                                    <p>{o.content}</p>
                                </div>
                                <CommentConstructor obj={o.replies} objId={o.post}/>
                            </>
                            :
                            o.replies.length > 0 && o.parent != null && o.post === objId ?
                            <>
                                <div className={styles.comment_item}>
                                    <h3>{users[o.author - 1].username} replied to {users[allComments[o.parent - 1].author - 1].username}</h3>
                                    <p>{o.content}</p>
                                </div>
                                <CommentConstructor obj={o.replies} objId={o.post}/>
                            </>
                            :
                            o.replies.length == 0 && o.post === objId ?
                            <div className={styles.comment_item}>
                                <h3>{users[o.author - 1].username} replied to {users[allComments[o.parent - 1].author - 1].username}</h3>
                                <p>{o.content}</p>
                            </div>
                            :
                            false
                            
                        }
                    </div>
                ))
            }
        </>

    )



    return (

        <div style={{placeItems: 'center'}}>
            <Header onCreatePost={()=>togglePanel('createPost')} onSearchUser={()=>togglePanel('searchUser')}/>
            {navState == 'createPost' && <CreatePostPanel />}
            {navState == 'searchUser' && <SearchUser />}
            <div className={styles.main}>
                {
                    <PostConstructor obj={threads}/> 
                }
            </div>
        </div>

    )

}