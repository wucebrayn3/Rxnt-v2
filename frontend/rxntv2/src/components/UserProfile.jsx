import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../axiosInstance"
import { useTheme } from "../utils/ThemeContext";

import styles from '../styles/Threads.module.css'
import arrowDown from '../assets/down-arrow.png'

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


    const loadFollow = async () => {
        try {
            const response = await axiosInstance.get('discover/');
            console.log(response.data.filter(rd => rd.id == id)[0]);
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
        ((obj && obj['posts']) || []).map((o) => (
            <div key={o.id} className={styles.post_container} style={{color: fontColor}}>
                {
                    (o.comments || []).length > 0 ?
                    <>
                        <div className={styles.upper_panel} style={{border: 'none', boxShadow: `0 2px 4px ${shadow}`, backgroundColor: color}}>
                            <Link to={o.author ? `/user/${o.author}` : '#'}><h3>Author: {getUsername(o.author)}</h3></Link>
                            <p className={styles.date}>{formatDate(o.created_at)}</p>
                        </div>
                        <div className={styles.content} style={{border: 'none', boxShadow: `0 2px 4px ${shadow}`, backgroundColor: bg3}}>
                            <h4>Title: {o.title}</h4>
                            <p>{o.content}</p>
                            <div className={styles.comment_container} style={{backgroundColor: bg2}}>
                                <h4>Comments:</h4>
                                <CommentConstructor obj={(o.comments || []).filter(c => c.parent == null)} objId={o.id}/>
                            </div>
                        </div>
                    </>
                    :
                    <>
                       <div className={styles.upper_panel} style={{border: 'none', boxShadow: `0 2px 4px ${shadow}`, backgroundColor: color}}>
                            <Link to={o.author ? `/user/${o.author}` : '#'}><h3>Author: {getUsername(o.author)}</h3></Link>
                            <p style={{fontSize: '0.7rem'}}>{formatDate(o.created_at)}</p>
                        </div>
                        <div className={styles.content} style={{border: 'none', boxShadow: `0 2px 4px ${shadow}`, backgroundColor: bg3}}>
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

                (obj || []).map(o => (
                    <div key={o.id} className={styles.comment_subcontainer}>
                        {
                            
                            o.parent == null && o.post === objId ?
                            <>
                                <div className={styles.comment_item} style={{border: 'none', boxShadow: `0 2px 2px ${shadow}`, backgroundColor: mode}}>
                                    <Link to={o.author ? `/user/${o.author}` : '#'}><h3>{getUsername(o.author)}</h3></Link>
                                    <p>{o.content}</p>
                                </div>
                                <CommentConstructor obj={(o.replies || [])} objId={o.post}/>
                            </>
                            :
                            o.parent != null && o.post === objId ?
                            <>
                                <div className={styles.comment_item} style={{border: 'none', boxShadow: `0 2px 2px ${shadow}`, backgroundColor: mode}}>
                                    <h3>
                                        <Link to={o.author ? `/user/${o.author}` : '#'}>{getUsername(o.author)}</Link>
                                        {' '}replied to{' '}
                                        <Link to={getParentAuthorId(o.parent) ? `/user/${getParentAuthorId(o.parent)}` : '#'}>{getUsername(getParentAuthorId(o.parent))}</Link>
                                    </h3>
                                    <p>{o.content}</p>
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

    const reload = () => {
        loadFollow();
    }

    const handleReport = () => {
        setToggle(t => t ? false : true);
    };

    return (
        <div className={styles.main_nanaman} style={{backgroundColor: mode}}>
            <Header  onCreatePost={()=>togglePanel('createPost')} onSearchUser={()=>togglePanel('searchUser')} users={users}/>
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
