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

    const [activeReplyId, setActiveReplyId] = useState(null);

    const [expandedPosts, setExpandedPosts] = useState({});

    const [expandedComments, setExpandedComments] = useState({});

    const replyQuery = useRef(null);

    const toggleExpandPost = (postId) => {
        setExpandedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const toggleExpandComment = (commentId) => {
        setExpandedComments(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const edit = (g) => setEditTarget(g);
    const cancelEdit = () => setEditTarget(null);

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
    };

    const getUsername = (userId) => {
        if (!userId || !users.length) return 'Unknown';
        const u = users.find(x => x.id === userId);
        return u ? u.username : 'Unknown';
    };

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
    };

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
            loadPosts();
            window.alert('lah')
        } catch (err) {
            console.error(err)
        }
    };

    const loadAll = () => {
        loadUsers();
        loadPosts();
        loadComments();
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
        (obj || []).map((o) => {
            const isExpanded = expandedPosts[o.id];
            const isLong = o.content?.length > 200;

            return (
                <div key={o.id} className={styles.post_container}>
                    <div className={styles.upper_panel} style={{ backgroundColor: color, boxShadow: `0 2px 4px ${shadow}`, border: 'none' }}>
                        <Link to={o.author ? `/user/${o.author}` : '#'}>
                            <h3 className={styles.usernames} style={{ color: fontColor }}>{getUsername(o.author)}</h3>
                        </Link>
                        <div>
                            <p className={styles.date}>{formatDate(o.created_at)}</p>
                            <Report item_id={o.id} author={o.author} username={getUsername(o.author)} title={o.title} content={o.content} type={'post'} />
                        </div>
                    </div>

                    <div className={styles.content} style={{ border: 'none', backgroundColor: bg3, boxShadow: `0 2px 4px ${shadow}` }}>
                        <h4>{o.title}</h4>

                        <p
                            className={styles.post_content}
                            style={{
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: isExpanded ? 'unset' : 2,
                                WebkitBoxOrient: 'vertical',
                            }}
                        >
                            {o.content}
                        </p>

                        {isLong && (
                            <span
                                onClick={() => toggleExpandPost(o.id)}
                                style={{ cursor: 'pointer', color: color, fontWeight: 'bold' }}
                            >
                                {isExpanded ? 'See less' : 'See more'}
                            </span>
                        )}

                        <div className={styles.comment_container} style={{ backgroundColor: bg2 }}>
                            <h4>Comments:</h4>
                            <CreateComment postId={o.id} reload={loadAll} />
                            <CommentConstructor obj={(o.comments || []).filter(c => c.parent == null)} objId={o.id} />
                        </div>
                    </div>
                </div>
            );
        })
    );

    const CommentConstructor = ({ obj, objId }) => (
        <>
            {(obj || []).map(o => {
                const isExpanded = expandedComments[o.id];
                const isLong = o.content?.length > 150;

                return (
                    <div key={o.id} className={styles.comment_subcontainer}>
                        <div className={styles.comment_item} style={{ border: 'none', backgroundColor: mode, boxShadow: `0 2px 2px ${shadow}` }}>

                            <Link to={o.author ? `/user/${o.author}` : '#'}>
                                <h5 className={styles.usernames} style={{ color: fontColor }}>{getUsername(o.author)}</h5>
                            </Link>

                            {editTarget == o.id && user == getUsername(o.author) ? (
                                <form onReset={cancelEdit} onSubmit={saveComment} style={{height: 'fit-content'}}>
                                    <textarea defaultValue={o.content} />
                                    <input type="reset" value="Cancel" />
                                    <input type="submit" value="Save" style={{margin: '0'}}/>
                                </form>
                            ) : (
                                <>
                                    <p
                                        className={styles.comment_content}
                                        style={{
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: isExpanded ? 'unset' : 2,
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        {o.content}
                                    </p>

                                    {isLong && (
                                        <span
                                            onClick={() => toggleExpandComment(o.id)}
                                            style={{ cursor: 'pointer', color: fontColor, fontWeight: 'bold', fontSize: '0.85rem' }}
                                        >
                                            {isExpanded ? 'See less' : 'See more'}
                                        </span>
                                    )}
                                </>
                            )}

                            <div className={styles.comment_options}>
                                {user == getUsername(o.author) &&
                                    <CommentOptionBtn objId={o.id} onDeleteComment={loadComments} onEditComment={edit} />
                                }

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

                            {activeReplyId === o.id && (
                                <form
                                    onSubmit={(e) => {handleSubmit(e, o.id, objId); loadComments();}}
                                    onReset={() => setActiveReplyId(null)}
                                    style={{
                                        width: '200px',
                                        backgroundColor: bg2,
                                        boxShadow: `0 2px 4px ${shadow}`,
                                        borderRadius: '10px',
                                        margin: '0'
                                    }}
                                >
                                    <input
                                        onChange={(e) => replyQuery.current = e.target.value}
                                        type="text"
                                        style={{ width: '100%', margin: '0' }}
                                    />
                                    <input type="submit" value="Submit" style={{ width: '100%', margin: '0' }} />
                                    <input type="reset" value="Cancel" style={{ margin: "0"}}/>
                                </form>
                            )}

                        </div>

                        <CommentConstructor obj={(o.replies || [])} objId={o.post} />
                    </div>
                );
            })}
        </>
    );

    return (
        <div style={{ placeItems: 'center', backgroundColor: mode, color: fontColor }}>
            <Header onCreatePost={() => togglePanel('createPost')} onSearchUser={() => togglePanel('searchUser')} users={users} />

            {navState == 'createPost' && <CreatePostPanel onPost={loadPosts}/>}
            {navState == 'searchUser' && <SearchUser />}

            <div className={styles.main}>
                {posts.length > 0 ? <PostConstructor obj={posts} /> :
                    <div className={styles.discover}>
                        <h2>No posts available.</h2>
                        <a href="/discover/">Discover other users.</a>
                    </div>
                }
            </div>

            <div className={styles.trays} style={{ border: 'none', '--shadow': shadow, '--color': color }}>
                <FollowedUsersTray />
            </div>
        </div>
    );
}
