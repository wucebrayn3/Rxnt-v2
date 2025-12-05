import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { useTheme } from '../utils/ThemeContext';

import Report from "./Report.jsx";
import FollowedUsersTray from "./FollowedUsersTray.jsx";
import CommentOptionBtn from "./CommentOption.jsx";
import SearchUser from "./SearchUser.jsx";
import CreateComment from "./CreateComment.jsx";
import CreatePostPanel from "./CreatePost.jsx";
import Header from './Header.jsx'
import styles from '../styles/Threads.module.css';

export default function Threads() {

    const { mode, color, shadow, fontColor, bg2, bg3, border } = useTheme();
    const user = localStorage.getItem('username');

    const isLoaded = useRef(false);

    const [navState, setNavState] = useState(null);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [parentComment, setParentComments] = useState([]);
    const [users, setUsers] = useState([]);
    const [editTarget, setEditTarget] = useState(null);

    // ✅ FIXED REPLY STATE (PER COMMENT)
    const [activeReplyId, setActiveReplyId] = useState(null);

    const replyQuery = useRef(null);

    const edit = (g) => {
        setEditTarget(g)
    }

    const cancelEdit = () => {
        setEditTarget(null)
    }

    const saveComment = async (e) => {
        e.preventDefault()
        try {
            await axiosInstance.patch(`app/edit-comment/${editTarget}/`, {
                content: e.target[0].value
            });
            setEditTarget(null);
            loadComments();
        } catch (err) {
            console.error(err)
        }
    }

    const getUsername = (userId) => {
        if (!userId || !users.length) return 'Unknown';
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
            console.error(err)
        }
    }

    const loadPosts = async () => {
        try {
            const response = await axiosInstance.get('app/feed/')
            setPosts(response.data)
        } catch (err) {
            console.error(err)
        }
    };

    const loadComments = async () => {
        try {
            const response = await axiosInstance.get('app/comments/')
            setComments(response.data)
            setParentComments(response.data.filter(c => c.parent == null))
        } catch (err) {
            console.error(err)
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
        if (!parentId || !comments.length) return null;
        const pc = comments.find(c => c.id === parentId);
        return pc ? pc.author : null;
    }

    const handleSubmit = async (e, objId, postId) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/app/create-comment/', {
                content: replyQuery.current,
                post: postId,
                parent: objId ? objId : null
            })
            setActiveReplyId(null);
            loadComments();
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        if (!isLoaded.current) {
            isLoaded.current = true;
            loadUsers();
            loadPosts();
            loadComments();
        }
    }, []);

    const PostConstructor = ({ obj }) => (
        (obj || []).map((o) => (
            <div key={o.id} className={styles.post_container}>
                <div className={styles.upper_panel} style={{ backgroundColor: color, boxShadow: `0 2px 4px ${shadow}`, border: 'none' }}>
                    <Link to={o.author ? `/user/${o.author}` : '#'}>
                        <h3>Author: {getUsername(o.author)}</h3>
                    </Link>
                    <div>
                        <p className={styles.date}>{formatDate(o.created_at)}</p>
                        <Report item_id={o.id} author={o.author} username={getUsername(o.author)} title={o.title} content={o.content} type={'post'} />
                    </div>
                </div>

                <div className={styles.content} style={{ border: 'none', backgroundColor: bg3, boxShadow: `0 2px 4px ${shadow}` }}>
                    <h4>Title: {o.title}</h4>
                    <p>{o.content}</p>
                    <div className={styles.comment_container} style={{ backgroundColor: bg2 }}>
                        <h4>Comments:</h4>
                        <CreateComment postId={o.id} reload={loadComments} />
                        <CommentConstructor obj={(o.comments || []).filter(c => c.parent == null)} objId={o.id} />
                    </div>
                </div>
            </div>
        ))
    )

    const CommentConstructor = ({ obj, objId }) => (
        <>
            {(obj || []).map(o => (
                <div key={o.id} className={styles.comment_subcontainer}>
                    <div className={styles.comment_item} style={{border: 'none', backgroundColor: mode, boxShadow: `0 2px 2px ${shadow}` }}>

                        <h3>
                            <Link to={o.author ? `/user/${o.author}` : '#'}>
                                {getUsername(o.author)}
                            </Link>
                        </h3>

                        {editTarget == o.id && user == getUsername(o.author) ?
                            <form onReset={cancelEdit} onSubmit={saveComment}>
                                <textarea defaultValue={o.content} />
                                <input type="reset" value="Cancel" />
                                <input type="submit" value="Save" />
                            </form>
                            :
                            <p>{o.content}</p>
                        }

                        <div className={styles.comment_options}>
                            {user == getUsername(o.author) &&
                                <CommentOptionBtn objId={o.id} onDeleteComment={loadComments} onEditComment={edit} />
                            }

                            {/* ✅ FIXED TOGGLE */}
                            <h6
                                className={styles.reply}
                                onClick={() =>
                                    setActiveReplyId(prev => prev === o.id ? null : o.id)
                                }
                            >
                                Reply
                            </h6>

                            <Report item_id={o.id} author={o.author} username={getUsername(o.author)} title={o.title} content={o.content} type={'comment'} />
                        </div>

                        {/* ✅ FIXED REPLY FORM */}
                        {activeReplyId === o.id && (
                            <form
                                onSubmit={(e) => handleSubmit(e, o.id, objId)}
                                onReset={() => setActiveReplyId(null)}
                                style={{
                                    width: '200px',
                                    backgroundColor: bg2,
                                    boxShadow: `0 2px 4px ${shadow}`,
                                    borderRadius: '10px',
                                }}
                            >
                                <input
                                    onChange={(e) => replyQuery.current = e.target.value}
                                    type="text"
                                    style={{ width: '100%' }}
                                />
                                <input type="submit" value="Submit" style={{ width: '100%' }} />
                                <input type="reset" value="Cancel" />
                            </form>
                        )}

                    </div>

                    <CommentConstructor obj={(o.replies || [])} objId={o.post} />
                </div>
            ))}
        </>
    )

    return (
        <div style={{ placeItems: 'center', backgroundColor: mode, color: fontColor }}>
            <Header onCreatePost={() => togglePanel('createPost')} onSearchUser={() => togglePanel('searchUser')} users={users} />

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
                <FollowedUsersTray />
            </div>
        </div>
    )
}
