import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../axiosInstance"

import styles from '../styles/Threads.module.css'
import arrowDown from '../assets/down-arrow.png'

export default function UserProfile() {
    
    const [userData, setUserData] = useState(null);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [allComments, setAllComments] = useState([]);
    const { id } = useParams();

    const loadProfile = async () => {
        try {
            const response = await axiosInstance.get(`app/user/${id}`)

            console.log(response)
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

    // helper: safely get username by id
    const getUsername = (userId) => {
        if (!userId || !users || users.length === 0) return 'Unknown';
        const u = users.find(x => x.id === userId);
        return u ? u.username : 'Unknown';
    }

    // helper: safely get parent comment's author id
    const getParentAuthorId = (parentId) => {
        if (!parentId || !allComments || allComments.length === 0) return null;
        const pc = allComments.find(c => c.id === parentId);
        return pc ? pc.author : null;
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
                        </div>
                        <div className={styles.content}>
                            <h4>Title: {o.title}</h4>
                            <p>{o.content}</p>
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

                (obj || []).map(o => (
                    <div key={o.id} className={styles.comment_subcontainer}>
                        {
                            
                            o.parent == null && o.post === objId ?
                            <>
                                <div className={styles.comment_item}>
                                    <Link to={o.author ? `/user/${o.author}` : '#'}><h3>{getUsername(o.author)}</h3></Link>
                                    <p>{o.content}</p>
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

    return (
        <>
            <Link to={`/thread`}><button>Back</button></Link>
            <div className={styles.main}>
                {userData && users && <PostConstructor obj={userData}/>}
            </div>
        </>
    )
}
