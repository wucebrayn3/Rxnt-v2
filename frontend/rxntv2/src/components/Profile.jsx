import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

import styles from '../styles/Threads.module.css';
import arrowDown from '../assets/down-arrow.png';
import OptionBtn from "./PostOption";
import CommentOptionBtn from "./CommentOption";

export default function UserProfile() {
    
    const Navigate = useNavigate();

    const user = localStorage.getItem('username');

    const [userData, setUserData] = useState(null);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [allComments, setAllComments] = useState([]);
    const [editTarget, setEditTarget] = useState(null);

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
            <div key={o.id} className={styles.post_container}>
                {
                    (o.comments || []).length > 0 ?
                    <>
                        <div className={styles.upper_panel}>
                            <Link to={o.author ? `/user/${o.author}` : '#'}><h3>Author: {getUsername(o.author)}</h3></Link>
                            <p className={styles.date}>{formatDate(o.created_at)}</p>
                            <OptionBtn objId={o.id} onDeletePost={loadProfile} onEditPost={edit}/>
                        </div>
                        <div className={styles.content}>
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
                            <div className={styles.comment_container}>
                                <h4>Comments:</h4>
                                <CommentConstructor obj={(o.comments || []).filter(c => c.parent == null)} objId={o.id}/>
                            </div>
                            <img style={{height: '20px'}} src={arrowDown} alt="" />
                        </div>
                    </>
                    :
                    <>
                       <div className={styles.upper_panel}>
                            <Link to={o.author ? `/user/${o.author}` : '#'}><h3>Author: {getUsername(o.author)}</h3></Link>
                            <p style={{fontSize: '0.7rem'}}>{formatDate(o.created_at)}</p>
                            <OptionBtn objId={o.id} onDeletePost={loadProfile} onEditPost={edit}/>
                        </div>
                        <div className={styles.content}>
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
                                <div className={styles.comment_item}>
                                    <Link to={o.author ? `/user/${o.author}` : '#'}><h3>{getUsername(o.author)}</h3></Link>
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
                                <div className={styles.comment_item}>
                                    <h3>
                                        <Link to={o.author ? `/user/${o.author}` : '#'}>{getUsername(o.author)}</Link>
                                        {' '}replied to{' '}
                                        <Link to={getParentAuthorId(o.parent) ? `/user/${getParentAuthorId(o.parent)}` : '#'}>{getUsername(getParentAuthorId(o.parent))}</Link>
                                    </h3>
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
                                    <Hayop buset={o}/>
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

    const Hayop = (buset) => {
        if (comments.includes(buset)) {
            console.log(buset)
        } else {
            console.log(buset, ' is not included')
        }
    }

    return (
        <>
            <Link to={`/thread`}><button>Back</button></Link>
            <div className={styles.main}>
                {userData && users && <PostConstructor obj={userData}/>}
            </div>
        </>
    )
}
