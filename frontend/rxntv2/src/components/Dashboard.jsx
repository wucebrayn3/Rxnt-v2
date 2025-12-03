import axiosInstance from "../axiosInstance";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import ViewReport from "./ViewReport";
import DashboardHeader from "./DashboardHeader";
import PostView from "./ViewPost";
import CommentView from "./ViewComment";

import styles from '../styles/Dashboard.module.css';

export default function Dashboard () {

    const ako = localStorage.getItem('username');
    
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [reports, setReports] = useState([]);

    const [activePost, setActivePost] = useState(null);
    const [activeComment, setActiveComment] = useState(null);
    const [activeReport, setActiveReport] = useState(null);
    const [overView, setOverView] = useState(null);

    const loadEverythingAtOnce = async () => {
        try {
            const response = await axiosInstance.get('app/dashboard/');
            console.log(response.data)
            setUsers(response.data.users);
            setPosts(response.data.posts);
            setComments(response.data.comments)
            setReports([response.data.non_user_reports, response.data.user_reports]);
        } catch (err) {
            console.error(`Everything crashed: ${err}`)
        }
    };

    useEffect(() => {
        loadEverythingAtOnce();
    }, []);

    const getUsername = (userId) => {
        if (!userId || !users || users.length === 0) return 'Unknown';
        const u = users.find(x => x.id === userId);
        return u ? u.username : 'Unknown';
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

    const sendNotif = async (type, to) => {
        try {
            const response = await axiosInstance.post('app/notifications/', 
                {
                    recipient: Number(to),
                    sender: getId(ako),
                    topic: `${type.toUpperCase()} removed by admin`,
                    content: `Your ${type} has been removed, check notifications.`,
                }
            )
        } catch (err) {
            console.error(err)
        }
    }

    const viewReport = (obj) => {
         setActiveReport(ar => ar?.id === obj.id ? null : obj)
    };

    const removeReport = async (id, type) => {
        console.log(type)
        try {
            if (type != 'User') {const response = await axiosInstance.delete(`app/delete-non-user-report/${id}/`)}
            if (type == 'User') {const response = await axiosInstance.delete(`app/delete-user-report/${id}/`)}
            loadEverythingAtOnce();
        } catch (err) {
            console.error(`Hindi ma-apruba ang report: ${err}`)
        };
    };

    const viewPost = (obj) => {
        setActivePost(ap => ap?.id === obj.id ? null : obj);
    };

    const removePost = async (id, recipient) => {
        try {
            const response = await axiosInstance.delete(`app/delete-post/${id}/`)
            loadEverythingAtOnce();
            sendNotif('post', recipient);
        } catch (err) {
            console.error(err)
        };
    };

    const viewComment = (obj) => {
        setActiveComment(ac => ac?.id === obj.id ? null : obj)
    };

    const removeComment = async (id, recipient) => {
        try {
            const response = await axiosInstance.delete(`app/delete-comment/${id}/`)
            loadEverythingAtOnce();
            sendNotif('comment', recipient)
        } catch (err) {
            console.error(err)
        };
    };

    const getId = (un) => {
        if (!un || !users || users.length === 0) return 'Unknown';
        const u = users.find(x => x.username === un);
        return u ? u.id : 'Unknown';
    };

    const toggleOverview = (state) => {
        setOverView(state)
    };

    return (
        <div className={styles.maine_mendoza}>
            <DashboardHeader></DashboardHeader>
            <div className={styles.main}>
                <div className={styles.summary}>
                    <div className={styles.summary_sub_containers} onClick={() => setOverView('users')}>
                        <h4>Users</h4>
                        <h2>{users.length}</h2>
                    </div>
                    <div className={styles.summary_sub_containers} onClick={() => setOverView('posts')}>
                        <h4>Posts</h4>
                        <h2>{posts.length}</h2>
                    </div>
                    <div className={styles.summary_sub_containers} onClick={() => setOverView('comments')}>
                        <h4>Comments</h4>
                        <h2>{comments.length}</h2>
                    </div>
                    <div className={styles.summary_sub_containers} onClick={() => setOverView('reports')}>
                        <h4>Reports</h4>
                        <h2>{reports.flat().length}</h2>
                    </div>
                </div>

                <div className={styles.summary_overview}>
                    <div className={styles.columns}>
                        {overView === null ? <h4 className={styles.default_label}>Select a category above: Users, Posts, Comments, Reports</h4> : null}
                        {overView === 'users' &&
                            <>
                                <h4 className={styles.labels}>Username</h4>
                                <h4 className={styles.labels}>Role</h4>
                                <h4 className={styles.labels}>Followers</h4>
                                <h4 className={styles.labels}>Following</h4>
                            </>
                        }
                        {overView === 'posts' &&
                            <>
                                <h4 className={styles.labels}>Author</h4>
                                <h4 className={styles.labels}>Title</h4>
                                <h4 className={styles.labels}>Content</h4>
                                <h4 className={styles.labels}>Comments</h4>
                                <h4 className={styles.labels}>Date</h4>
                                <h4 className={styles.labels}>Actions</h4>
                            </>
                        }
                        {overView === 'comments' &&
                            <>
                                <h4 className={styles.labels}>Author</h4>
                                <h4 className={styles.labels}>Content</h4>
                                <h4 className={styles.labels}>Replies</h4>
                                <h4 className={styles.labels}>Date</h4>
                                <h4 className={styles.labels}>Actions</h4>
                            </>
                        }
                        {overView === 'reports' &&
                            <>
                                <h4 className={styles.labels}>Complainant</h4>
                                <h4 className={styles.labels}>Reported Author</h4>
                                <h4 className={styles.labels}>Type</h4>
                                <h4 className={styles.labels}>Date</h4>
                                <h4 className={styles.labels}>Action</h4>
                            </>
                        }
                    </div>
                    <>
                        {overView === 'users' ? users.map(user => (
                            <div className={styles.user}>
                                <h4>{user.username}</h4>
                                <p>{user.is_staff ? 'Staff' : 'User'}</p>
                                <p>Followers: {user.followers_count}</p>
                                <p>Following: {user.following_count}</p>
                            </div>
                        ))
                        :
                        null
                        }
                    </>
                    <>
                        {overView === 'posts' ? posts.map(post => (
                            <div className={styles.post} key={post.id}>
                                <h4>{getUsername(post.author)}</h4>
                                <p className={styles.title}>{post.title}</p>
                                <p>{post.content.length > 20 ? post.content.slice(0,20) + '...' : post.content}</p>
                                <p>Comments: {post.comments.length}</p>
                                <p>{formatDate(post.created_at)}</p>
                                <div className={styles.buttons}>
                                    <button onClick={() => viewPost(post)} className={styles.view_btn}>View</button>
                                    <button onClick={b => removePost(Number(post.id), Number(post.author))} className={styles.remove_btn}>Remove</button>
                                </div>
                            </div>
                                            
                        ))
                        :
                        null
                        }
                        {activePost &&
                            <PostView 
                            title={activePost.title} 
                            content={activePost.content} 
                            comments={activePost.comments.length} 
                            created_at={formatDate(activePost.created_at)} 
                            author={getUsername(Number(activePost.author))}
                            onClose={() => setActivePost(null)}/>
                        }
                    </>
                    <>
                        {overView === 'comments' ? comments.map(comment => (
                            <div className={styles.comment} key={comment.id}>
                                <div key={comment.id} className={styles.comment}>
                                    <h4>{getUsername(comment.author)}</h4>
                                    <p>{comment.content.length > 20 ? comment.content.slice(0,20) + '...' : comment.content}</p>
                                    <p>{comment.replies.length > 0 ? "Replies: " + comment.replies.length : "Parent comment"}</p>
                                    <p>{formatDate(comment.created_at)}</p>
                                    <div className={styles.buttons}>
                                        <button onClick={() => viewComment(comment)} className={styles.view_btn}>View</button>
                                        <button onClick={b => removeComment(Number(comment.id), Number(comment.author))} className={styles.remove_btn}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))
                        :
                        null
                        }
                        {activeComment &&
                            <CommentView 
                            content={activeComment.content} 
                            author={getUsername(activeComment.author)} 
                            created_at={activeComment.created_at} 
                            onClose={() => setActiveComment(null)} />
                        }
                    </>
                    <>
                        {overView === 'reports' ? reports.flat().map(report => (
                            <>
                                <div className={styles.report} key={`${report.report_date}`}>
                                    <div className={styles.report} key={report.id}>
                                        <div className={styles.report_summary}>
                                            <h4>{getUsername(report.complainant)}</h4>
                                            <p>{getUsername(report.reported_author)}</p>
                                            <p>{report.reported_object}</p>
                                            <p>{formatDate(report.report_date)}</p>
                                            <div className={styles.buttons}>
                                                <button onClick={() => viewReport(report)} className={styles.view_btn}>View</button>
                                                <button onClick={b => removeReport(report.id, report.reported_object)} className={styles.remove_btn}>Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </>
                            ))
                            :
                            null
                            }
                                {activeReport && 
                                    <ViewReport onClose={() => setActiveReport(null)} 
                                    complainant={getUsername(activeReport.complainant)} 
                                    complainant_id={activeReport.complainant}
                                    item_type={activeReport.reported_object}
                                    item_author={getUsername(activeReport.complainant)}
                                    item_id={activeReport.id}
                                    title={activeReport.title}
                                    content={activeReport.content}
                                    reason={activeReport.reason}
                                    admin={getId(ako)}
                                    item_author_id={activeReport.reported_author}/>
                                }
                    </>
                </div>
            </div>
        </div>
    )

}