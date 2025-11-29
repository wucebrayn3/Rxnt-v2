import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import arrowDown from '../assets/down-arrow.png';
import axiosInstance from "../axiosInstance";

import Report from "./Report.jsx";
import FollowedUsersTray from "./FollowedUsersTray.jsx";
import NotificationTray from "./NotificationTray.jsx";
import CommentOptionBtn from "./CommentOption.jsx";
import SearchUser from "./SearchUser.jsx";
import CreateComment from "./CreateComment.jsx";
import CreateReply from "./Reply.jsx";
import CreatePostPanel from "./CreatePost.jsx";
import Header from './Header.jsx'
import styles from '../styles/Threads.module.css';

export default function Threads() {

    const user = localStorage.getItem('username');

    const isLoaded = useRef(false);
    const [navState, setNavState] = useState(null);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [parenComment, setParentComments] = useState([]);
    const [users, setUsers] = useState([]);
    const [editTarget, setEditTarget] = useState(null);

    const edit = (g) => {
        console.log('inedit si ', g)
        setEditTarget(g)
    }

    const cancelEdit = () => {
        setEditTarget(null)
    }

    const saveComment = async (e) => {
        e.preventDefault()

        try {
            const response = await axiosInstance.patch(`app/edit-comment/${editTarget}/`,
                {
                    content: e.target[0].value
                }
            )
        } catch (err) {
            console.error(`Yano talaga: ${err}`)
        }
    }

    const getUsername = (userId) => {
        if (!userId || !users || users.length === 0) return 'Unknown';
        const u = users.find(x => x.id === userId);
        return u ? u.username : 'Unknown';
    }

    const togglePanel = (panel) => {
        setNavState(prev => prev === panel ? null : panel)
    };

    const loadUsers = async () => {
        try {
            const response = await axiosInstance('users/')
            setUsers(response.data)
        } catch (err) {
            console.error(`Error sa pagkuha ng users pare: ${err}`)
        }
    }

    const loadPosts = async () => {
        try {
            const response = await axiosInstance.get('app/feed/')
            console.log(response.data)
            setPosts(response.data)
        } catch (err) {
            console.error('may mali dito pre: ', err)
        }
    };

    const loadComments = async () => {
        try {
            const response = await axiosInstance.get('app/comments/')
            console.log(response.data)
            setComments(response.data)
            setParentComments(response.data.filter(c => c.parent == null))
        } catch (err) {
            console.error('may mali dito pre: ', err)
        }
    };

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

    const getParentAuthorId = (parentId) => {
        if (!parentId || !comments || comments.length === 0) return null;
        const pc = comments.find(c => c.id === parentId);
        return pc ? pc.author : null;
    }

    useEffect(() => {
        if (!isLoaded.current) {
            console.log('effect triggered')
            loadUsers();
            loadPosts();
            loadComments();
        }
    }, []);

    const PostConstructor = ({ obj }) => (
        (obj || []).map((o) => (
            <div key={o.id} className={styles.post_container}>
                {
                    (o.comments || []).length > 0 ?
                    <>
                        <div className={styles.upper_panel}>
                            <Link to={o.author ? `/user/${o.author}` : '#'}><h3>Author: {getUsername(o.author)}</h3></Link>
                            <div>
                                <p className={styles.date}>{formatDate(o.created_at)}</p>
                                <Report item_id={o.id} author={o.author} username={getUsername(o.author)} title={o.title} content={o.content} type={'post'}/>
                            </div>
                        </div>
                        <div className={styles.content}>
                            <h4>Title: {o.title}</h4>
                            <p>{o.content}</p>
                            <div className={styles.comment_container}>
                                <h4>Comments:</h4>
                                <CreateComment postId={o.id}/>
                                <CommentConstructor obj={(o.comments || []).filter(c => c.parent == null)} objId={o.id}/>
                            </div>
                            <img style={{height: '20px'}} src={arrowDown} alt="" />
                        </div>
                    </>
                    :
                    <>
                       <div className={styles.upper_panel}>
                            <Link to={o.author ? `/user/${o.author}` : '#'}><h3>Author: {getUsername(o.author)}</h3></Link>
                            <div>
                                <p className={styles.date}>{formatDate(o.created_at)}</p>
                                <Report item_id={o.id} author={o.author} username={getUsername(o.author)} title={o.title} content={o.content} type={'post'}/>
                            </div>
                        </div>
                        <div className={styles.content}>
                            <h4>Title: {o.title}</h4>
                            <p>{o.content}</p>
                            <div className={styles.comment_container}>
                                <h4>Comments:</h4>
                                <CreateComment postId={o.id} />
                            </div>
                        </div>
                    </> 
                }
            </div>
        ))        
    )

    const CommentConstructor = ({ obj, objId }) => (
        
        <>
            {   

                (obj || []).map(o => (
                    <div key={o.id} className={styles.comment_subcontainer}>
                        {
                            
                            o.parent == null && o.post === objId ?
                            <>
                                <div className={styles.comment_item}>
                                    <Link to={o.author ? `/user/${o.author}` : '#'}><h3>{getUsername(o.author)}</h3></Link>
                                    {editTarget == o.id && user == getUsername(o.author) ? 
                                        <form action="" onReset={cancelEdit} onSubmit={e => {saveComment(e); loadComments();}}>
                                            <textarea defaultValue={o.content} name="" id=""></textarea>
                                            <input type="reset" value="Cancel" />
                                            <input type="submit" value="Save" />
                                        </form>
                                        : 
                                        <p>{o.content}</p>
                                    }
                                    {user == getUsername(o.author) ? <CommentOptionBtn objId={o.id} onDeleteComment={loadUsers} onEditComment={edit}/> : false}
                                    <CreateReply postId={objId} parent={o.id}></CreateReply>
                                </div>
                                <CommentConstructor obj={(o.replies || [])} objId={o.post}/>
                            </>
                            :
                            o.parent != null && o.post === objId ?
                            <>
                                <div className={styles.comment_item}>
                                    <h3>
                                        <Link to={o.author ? `/user/${o.author}` : '#'}>{getUsername(o.author)}</Link>
                                        {' '}replied to{' '}
                                        <Link to={getParentAuthorId(o.parent) ? `/user/${getParentAuthorId(o.parent)}` : '#'}>{getUsername(getParentAuthorId(o.parent))}</Link>
                                    </h3>
                                    {editTarget == o.id && user == getUsername(o.author) ? 
                                        <form action="" onReset={cancelEdit} onSubmit={e => {saveComment(e); loadComments();}}>
                                            <textarea defaultValue={o.content} name="" id=""></textarea>
                                            <input type="reset" value="Cancel" />
                                            <input type="submit" value="Save" />
                                        </form>
                                        : 
                                        <p>{o.content}</p>
                                    }
                                    {user == getUsername(o.author) ? <CommentOptionBtn objId={o.id} onDeleteComment={loadUsers} onEditComment={edit}/> : false}
                                    <CreateReply postId={objId} parent={o.id}></CreateReply>
                                </div>
                                <CommentConstructor obj={(o.replies || [])} objId={o.post}/>
                            </>
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
           <Header onCreatePost={()=>togglePanel('createPost')} onSearchUser={()=>togglePanel('searchUser')} isDashboard={true} users={users}/>
            {navState == 'createPost' && <CreatePostPanel />}
            {navState == 'searchUser' && <SearchUser />}
            <div className={styles.main}>
                {posts.length > 0 ? <PostConstructor obj={posts} /> :
                    <div className={styles.discover}>
                        <h2>No posts available.</h2>
                        <a href="/discover/">Discover other users.</a>
                    </div>
                }
            </div>
            <div className={styles.trays}>
                <FollowedUsersTray></FollowedUsersTray>
            </div>
        </div>

    )

} 