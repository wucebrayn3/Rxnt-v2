import { useEffect, useState, useRef } from "react"
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../axiosInstance"
import { useTheme } from "../utils/ThemeContext";

import styles from '../styles/Threads.module.css'

import Report from "./Report";
import FollowButton from "./FollowButton";
import Header from "./Header";

export default function UserProfile() {
    
    const {fontColor, shadow, bg2, bg3, mode, color} = useTheme();
    
    const [toggle, setToggle] = useState(false);
    const [userData, setUserData] = useState(null);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [allComments, setAllComments] = useState([]);
    const [profData, setProfData] = useState(null);
    const { id } = useParams();

    // ✅ SEE MORE / SEE LESS STATE
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

    const loadFollow = async () => {
        try {
            const response = await axiosInstance.get('discover/');
            setProfData(response.data.filter(rd => rd.id == id)[0]);
        } catch (err) {
            console.error(err);
        }
    };

    const loadProfile = async () => {
        try {
            const response = await axiosInstance.get(`app/user/${id}`);
            setUserData(response.data);
        } catch (err) {
            console.error('May mali sa profile' + err);
        };
    };
    
    useEffect(() => {
        loadUsers();
        loadProfile();
        loadComments();
        loadFollow();
    },[]);

    const loadUsers = async () => {
        try {
            const response = await axiosInstance.get('users/');
            setUsers(response.data);
        } catch (err) {
            console.error('May nagkamali sa pagkuha ng user tol: ', err);
        };
    };

    const loadComments = async () => {
        try {
            const response = await axiosInstance.get('app/comments/');
            setAllComments((response.data));
            setComments((response.data).filter(data => data.parent == null));
        } catch (err) {
            console.error('May mali sa pagkuha ng comments pare ko: ', err);
        };
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

    const getUsername = (userId) => {
        if (!userId || !users || users.length === 0) return 'Unknown';
        const u = users.find(x => x.id === userId);
        return u ? u.username : 'Unknown';
    }

    const getParentAuthorId = (parentId) => {
        if (!parentId || !allComments || allComments.length === 0) return null;
        const pc = allComments.find(c => c.id === parentId);
        return pc ? pc.author : null;
    }

    const PostConstructor = ({ obj }) => (
        ((obj && obj['posts']) || []).map((o) => {
            const isExpandedPost = expandedPosts[o.id];
            const isLongPost = o.content?.length > 200;

            return (
                <div key={o.id} className={styles.post_container} style={{color: fontColor}}>
                    <div className={styles.upper_panel} style={{border: 'none', boxShadow: `0 2px 4px ${shadow}`, backgroundColor: color}}>
                        <Link to={o.author ? `/user/${o.author}` : '#'}><h3  style={{color: fontColor}}>{getUsername(o.author)}</h3></Link>
                        <div>
                            <p className={styles.date}>{formatDate(o.created_at)}</p>
                            <Report item_id={o.id} author={o.author} username={getUsername(o.author)} title={o.title} content={o.content} type={'post'} />
                        </div>
                    </div>

                    <div className={styles.content} style={{border: 'none', boxShadow: `0 2px 4px ${shadow}`, backgroundColor: bg3}}>
                        <h4>Title: {o.title}</h4>

                        <p
                            style={{
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: isExpandedPost ? 'unset' : 4,
                                WebkitBoxOrient: 'vertical',
                            }}
                        >
                            {o.content}
                        </p>

                        {isLongPost && (
                            <span
                                
                                onClick={() => toggleExpandPost(o.id)}
                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: color, fontWeight: 'bold' }}
                            >
                                {isExpandedPost ? 'See less' : 'See more'}
                            </span>
                        )}

                        { (o.comments || []).length > 0 &&
                            <div className={styles.comment_container} style={{backgroundColor: bg2}}>
                                <h4>Comments:</h4>
                                <CommentConstructor obj={(o.comments || []).filter(c => c.parent == null)} objId={o.id}/>
                            </div>
                        }
                    </div>
                </div>
            );
        })
    )

    const CommentConstructor = ({ obj, objId }) => (
        <>
            { (obj || []).map(o => {
                const isExpandedComment = expandedComments[o.id];
                const isLongComment = o.content?.length > 150;

                return (
                    <div key={o.id} className={styles.comment_subcontainer}>
                        <div className={styles.comment_item} style={{border: 'none', boxShadow: `0 2px 2px ${shadow}`, backgroundColor: mode}}>
                            {o.parent != null ?
                                <span style={{display: 'flex'}}>
                                    <Link to={o.author ? `/user/${o.author}` : '#'}><h5 className={styles.usernames} style={{color: fontColor}}>{getUsername(o.author)}</h5></Link>
                                    <h5  style={{color: fontColor}}>&nbsp;replied to&nbsp;</h5>
                                    <Link to={getParentAuthorId(o.parent) ? `/user/${getParentAuthorId(o.parent)}` : '#'}><h5 className={styles.usernames} style={{color: fontColor}}>{getUsername(getParentAuthorId(o.parent))}</h5></Link>
                                </span>

                                :
                                <Link to={o.author ? `/user/${o.author}` : '#'}><h5 className={styles.usernames} style={{color: fontColor}}>{getUsername(o.author)}</h5></Link>
                            }

                            <p
                                style={{
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: isExpandedComment ? 'unset' : 3,
                                    WebkitBoxOrient: 'vertical',
                                }}
                            >
                                {o.content}
                            </p>

                            {isLongComment && (
                                <span
                                    type="button"
                                    onClick={() => toggleExpandComment(o.id)}
                                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: color, fontWeight: 'bold', fontSize: '0.85rem' }}
                                >
                                    {isExpandedComment ? 'See less' : 'See more'}
                                </span>
                            )}
                            
                        </div>

                        <CommentConstructor obj={(o.replies || [])} objId={o.post}/>
                    </div>
                )
            })}
        </>
    )

    const reload = () => {
        loadFollow();
    }

    const handleReport = () => {
        setToggle(t => !t);
    };

    return (
        <div className={styles.main_nanaman} style={{backgroundColor: mode}}>
            <Header  onCreatePost={()=>{}} onSearchUser={()=>{}} users={users}/>
            <div className={styles.main}>
                {toggle && <Report type={'user'} username={getUsername(Number(id))} item_id={Number(id)} close={handleReport}></Report>}
                {userData && users && <PostConstructor obj={userData}/>}
                {profData && 
                    <div className={styles.profile_detail} style={{backgroundColor: mode, border: 'none', boxShadow: `0 10px 10px ${shadow}`, color: fontColor}}>
                        <div className={styles.username} style={{color: fontColor}}>
                            <h1>{profData.username}</h1>
                            <FollowButton is_following_user={profData.is_following} id={id} onBtnClick={reload}/>
                            <button className={styles.report_btn} style={{border: 'none', color: mode, backgroundColor: fontColor, boxShadow: `0 2px 4px ${shadow}`}} onClick={handleReport}>Report User</button>
                        </div>
                        <div className={styles.follow} style={{color: fontColor}}>
                            <h3>Followers: {profData.followers_count}</h3>
                            <h3>Following: {profData.following_count}</h3>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
