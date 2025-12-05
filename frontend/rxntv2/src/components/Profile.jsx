import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { useTheme } from "../utils/ThemeContext";

import styles from '../styles/Threads.module.css';
import arrowDown from '../assets/down-arrow.png';
import OptionBtn from "./PostOption";
import CommentOptionBtn from "./CommentOption";
import Header from "./Header";
import CreatePostPanel from "./CreatePost";
import SearchUser from "./SearchUser";

export default function UserProfile() {
    
    const {fontColor, shadow, bg2, bg3, mode, color} = useTheme();

    const Navigate = useNavigate();

    const user = localStorage.getItem('username');

    const [userData, setUserData] = useState(null);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [allComments, setAllComments] = useState([]);
    const [editTarget, setEditTarget] = useState(null);
    const [navState, setNavState] = useState(null);

    const [isStaff, setIsStaff] = useState(false);

    const loadProfile = async () => {
        try {
            const response = await axiosInstance.get('api/me/')
            // const response2 = await axiosInstance.get()

            if (response.data.is_staff) {
                Navigate('/dashboard')
                return;
            }

            setComments(response.data.comments)
            setUserData(response.data)

        } catch (err) {
            console.error('May mali sa profile' + err)
        }
    }
    
    useEffect(() => {
        loadUsers();
        loadProfile();
        loadComments();
    },[])

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
            console.log(response.data)
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

    const edit = (g) => {
        console.log('inedit si ', g)
        setEditTarget(g)
    }

    const cancelEdit = () => {
        setEditTarget(null)
    }

    const saveEdit = async (e) => {
        e.preventDefault()
        console.log(e.target[0].value)
        console.log(e.target[1].value)

        try {
            const response = await axiosInstance.patch(`app/edit-post/${editTarget}/`, { title: e.target[0].value, content: e.target[1].value }) ; console.log(response); setEditTarget(null)
        } catch (err) { console.log('Something went wrong with updating: ', err) }
 
    }

    const saveComment = async (e) => {
        console.log(e.target[0].value)

        try {
            const response = await axiosInstance.patch(`/app/edit-comment/${editTarget}/`,
                {
                    content: e.target[0].value
                }
            )
        } catch (err) {
            console.error(`Walastek: ${err}`)
        }
    }

    const PostConstructor = ({ obj }) => (
        ((obj && obj['posts']) || []).map((o) => (
            <div key={o.id} className={styles.post_container} style={{color: fontColor}}>
                {
                    (o.comments || []).length > 0 ?
                    <>
                        <div className={styles.upper_panel} style={{border: 'none', boxShadow: `0 2px 4px ${shadow}`, backgroundColor: color}}>
                            <Link to={o.author ? `/user/${o.author}` : '#'}><h3 className={styles.usernames} style={{color: fontColor}} >{getUsername(o.author)}</h3></Link>
                                <p className={styles.date}>{formatDate(o.created_at)}</p>
                            <OptionBtn objId={o.id} onDeletePost={loadProfile} onEditPost={edit}/>
                        </div>
                        <div className={styles.content} style={{border: 'none', boxShadow: `0 2px 4px ${shadow}`, backgroundColor: bg3}}>
                            {editTarget == o.id ? 
                            <form action="" onReset={cancelEdit} onSubmit={saveEdit}>
                                <input type="text" defaultValue={o.title}></input>
                                <textarea name="" id="" defaultValue={o.content}></textarea>
                                <input type="submit" value="Save" />
                                <input type="reset" value="Cancel"/>
                            </form>
                            :
                            <>
                                <h4>Title: {o.title}</h4>
                                <p>{o.content}</p>
                            </>
                            }
                            <div className={styles.comment_container} style={{backgroundColor: bg2}}>
                                <h4>Comments:</h4>
                                <CommentConstructor obj={(o.comments || []).filter(c => c.parent == null)} objId={o.id}/>
                            </div>
                        </div>
                    </>
                    :
                    <>
                       <div className={styles.upper_panel} style={{border: 'none', boxShadow: `0 2px 4px ${shadow}`, backgroundColor: color}}>
                            <Link to={o.author ? `/user/${o.author}` : '#'}><h3 className={styles.usernames} style={{color: fontColor}} >{getUsername(o.author)}</h3></Link>
                                <p style={{fontSize: '0.7rem'}}>{formatDate(o.created_at)}</p>
                            <OptionBtn objId={o.id} onDeletePost={loadProfile} onEditPost={edit}/>
                        </div>
                        <div className={styles.content} style={{border: 'none', boxShadow: `0 2px 4px ${shadow}`, backgroundColor: bg3}}>
                            {editTarget == o.id ? 
                            <form action="" onSubmit={saveEdit} onReset={cancelEdit}>
                                <input type="text" defaultValue={o.title}></input>
                                <textarea name="" id="" defaultValue={o.content}></textarea>
                                <input type="submit" value="Save" />
                                <input type="reset" value="Cancel"/>
                            </form>
                            :
                            <>
                                <h4>Title: {o.title}</h4>
                                <p>{o.content}</p>
                            </>
                            }
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
                                    <Link to={o.author ? `/user/${o.author}` : '#'}><h5 className={styles.usernames} style={{color: fontColor}} >{getUsername(o.author)}</h5></Link>
                                    {editTarget ? 
                                        <form action="" onReset={cancelEdit} onSubmit={e => {e.preventDefault(); saveComment(e)}} onChange={e => console.log(e.target.value)}>
                                            <textarea defaultValue={o.content} name="" id=""></textarea>
                                            <input type="reset" value="Cancel" />
                                            <input type="submit" value="Save" />
                                        </form>
                                        : 
                                        <p>{o.content}</p>
                                    }
                                    {user == getUsername(o.author) ? <CommentOptionBtn objId={o.id} onDeleteComment={loadProfile} onEditComment={edit}/> : false}
                                </div>
                                <CommentConstructor obj={(o.replies || [])} objId={o.post}/>
                            </>
                            :
                            o.parent != null && o.post === objId ?
                            <>
                                <div className={styles.comment_item} style={{border: 'none', boxShadow: `0 2px 2px ${shadow}`, backgroundColor: mode}}>
                                    <span style={{color: fontColor, display: 'flex'}} > 
                                        <Link to={o.author ? `/user/${o.author}` : '#'}><h5  className={styles.usernames} style={{color: fontColor, display: 'flex'}}>{getUsername(o.author)}</h5></Link>
                                        <h5 style={{color: fontColor}}>&nbsp;replied to&nbsp;</h5>
                                        <Link to={getParentAuthorId(o.parent) ? `/user/${getParentAuthorId(o.parent)}` : '#'}><h5  className={styles.usernames} style={{color: fontColor, display: 'flex'}}>{getUsername(getParentAuthorId(o.parent))}</h5></Link>
                                    </span>
                                    {editTarget ? 
                                        <form action="" onReset={cancelEdit} onSubmit={e => {e.preventDefault(); saveComment(e)}}>
                                            <textarea defaultValue={o.content} name="" id=""></textarea>
                                            <input type="reset" value="Cancel" />
                                            <input type="submit" value="Save" />
                                        </form>
                                        : 
                                        <p>{o.content}</p>
                                    }
                                    {user == getUsername(o.author) ? <CommentOptionBtn objId={o.id} onDeleteComment={loadProfile} onEditComment={edit}/> : false}
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

    const togglePanel = (panel) => {
        setNavState(prev => prev === panel ? null : panel)
    };

    return (
        <div style={{placeItems: 'center', backgroundColor: mode}}>
            <Header  onCreatePost={()=>togglePanel('createPost')} onSearchUser={()=>togglePanel('searchUser')} users={users}/>
            {navState == 'createPost' && <CreatePostPanel />}
            {navState == 'searchUser' && <SearchUser />}
            <div className={styles.main}>
                
                {userData && users && <PostConstructor obj={userData}/>}
            </div>
        </div>
    )
}
