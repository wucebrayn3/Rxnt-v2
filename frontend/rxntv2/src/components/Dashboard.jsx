import axiosInstance from "../axiosInstance";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import ViewReport from "./ViewReport";
import DashboardHeader from "./DashboardHeader";

import styles from '../styles/Dashboard.module.css';

export default function Dashboard () {

    const ako = localStorage.getItem('username');

    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [reports, setReports] = useState([]);

    const [toggleReport, setToggleReport] = useState(false);
    const [overView, setOverView] = useState(null);

    const loadEverythingAtOnce = async () => {
        try {
            const response = await axiosInstance.get('app/dashboard/');
            console.log(response.data)
            setUsers(response.data.users);
            setPosts(response.data.posts);
            setComments(response.data.comments)
            setReports([...reports, response.data.non_user_reports]);
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

    const viewReport = () => {
        setToggleReport(tr => tr ? false : true)
    };

    const removeReport = async (id) => {
        try {
            const response = await axiosInstance.delete(`app/delete-non-user-report/${id}/`)
            console.log(response)
        } catch (err) {
            console.error(`Hindi ma-apruba ang report: ${err}`)
        }
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
                            </>
                        }
                        {overView === 'comments' &&
                            <>
                                <h4 className={styles.labels}>Author</h4>
                                <h4 className={styles.labels}>Content</h4>
                                <h4 className={styles.labels}>Replies</h4>
                                <h4 className={styles.labels}>Date</h4>
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
                    {overView === 'users' ? users.map(user => (
                        <Link to={`/user/${user.id}/`}>
                            <div className={styles.user}>
                                <h4>{user.username}</h4>
                                <p>{user.is_staff ? 'Staff' : 'User'}</p>
                                <p>Followers: {user.followers_count}</p>
                                <p>Following: {user.following_count}</p>
                            </div>
                        </Link>
                    ))
                    :
                    null
                    }
                    {overView === 'posts' ? posts.map(post => (
                        <div className={styles.post} key={post.id}>
                            <h4>{getUsername(post.author)}</h4>
                            <p className={styles.title}>{post.title}</p>
                            <p>{post.content.length > 50 ? post.content.slice(0,20) + '...' : post.content}</p>
                            <p>Comments: {post.comments.length}</p>
                            <p>{formatDate(post.created_at)}</p>
                        </div>
                    ))
                    :
                    null
                    }
                    {overView === 'comments' ? comments.map(comment => (
                        <div className={styles.comment} key={comment.id}>
                            <div key={comment.id} className={styles.comment}>
                                <h4>{getUsername(comment.author)}</h4>
                                <p>{comment.content.length > 50 ? comment.content.slice(0,20) + '...' : comment.content}</p>
                                <p>{comment.replies.length > 0 ? "Replies: " + comment.replies.length : "Parent comment"}</p>
                                <p>{formatDate(comment.created_at)}</p>
                            </div>
                        </div>
                    ))
                    :
                    null
                    }
                    {overView === 'reports' ? reports.flat().map(report => (
                        <div className={styles.report} key={report.id}>
                            <div className={styles.report} key={report.id}>
                                <div className={styles.report_summary}>
                                    <h4>{getUsername(report.complainant)}</h4>
                                    <p>{getUsername(report.reported_author)}</p>
                                    <p>{report.reported_object}</p>
                                    <p>{formatDate(report.report_date)}</p>
                                    <div className={styles.buttons}>
                                        <button onClick={viewReport} className={styles.view_btn}>View</button>
                                        <button onClick={b => removeReport(report.id)} className={styles.remove_btn}>Remove</button>
                                    </div>
                                </div>
                                {toggleReport && 
                                    <ViewReport onClose={viewReport} 
                                    complainant={getUsername(report.complainant)} 
                                    item_type={report.reported_object}
                                    item_author={getUsername(report.reported_author)}
                                    item_id={report.id}
                                    title={report.title}
                                    content={report.content}
                                    reason={report.reason}
                                    admin={getId(ako)}
                                    item_author_id={report.reported_author}/>
                                }
                            </div>
                        </div>
                    ))
                    :
                    null
                    }
                </div>
            </div>
            {/* <div className={styles.main}>
                <h1>Admin Dashboard</h1>
                <div className={styles.overview_panel}>
                    <div className={styles.users_panel}>
                        {users.map(user => (
                            <div className={styles.user} key={user.id}>
                                <Link className={styles.h4} to={`/user/${user.id}/`}><h4>{user.username}</h4></Link>
                                <p>Followers: {user.followers_count}</p>
                                <p>Following: {user.following_count}</p>
                                <p>{user.is_staff ? 'Staff' : 'User'}</p>
                            </div>
                        ))}
                    </div>
                    <div className={styles.posts_panel}>
                        {posts.map(post => (
                            <div className={styles.post} key={post.id}>
                                <h4>{getUsername(post.author)}</h4>
                                <p>{formatDate(post.created_at)}</p>
                                <p className={styles.title}>{post.title}</p>
                                <p>{post.content.length > 50 ? post.content.slice(0,50) + '...' : post.content}</p>
                                <p>Comments: {post.comments.length}</p>
                            </div>
                        ))}
                    </div>
                    <div className={styles.comments_panel}>
                        {comments.map(comment => (
                            <div key={comment.id} className={styles.comment}>
                                <h4>{getUsername(comment.author)}</h4>
                                <p>{formatDate(comment.created_at)}</p>
                                <p>{comment.content.length > 50 ? comment.content.slice(0,50) + '...' : comment.content}</p>
                                <p>{comment.replies.length > 0 ? "Replies: " + comment.replies.length : "Parent comment"}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.reports_panel}>
                    {reports.flat().map(report => (
                        <div className={styles.report} key={report.id}>
                            <div className={styles.report_summary}>
                                <h4>Complainant: {getUsername(report.complainant)}</h4>
                                <p>Item type: {report.reported_object}</p>
                                <p>Item author: {getUsername(report.reported_author)}</p>
                                <p>{formatDate(report.report_date)}</p>
                            </div>
                            <div className={styles.buttons}>
                                <button onClick={viewReport}>View</button>
                                <button onClick={b => removeReport(report.id)}>Remove</button>
                            </div>
                            {toggleReport && 
                                <ViewReport onClose={viewReport} 
                                complainant={getUsername(report.complainant)} 
                                item_type={report.reported_object}
                                item_author={getUsername(report.reported_author)}
                                item_id={report.id}
                                title={report.title}
                                content={report.content}
                                reason={report.reason}
                                admin={getId(ako)}
                                item_author_id={report.reported_author}/>
                            }
                        </div>
                    ))}
                </div>
            </div> */}
        </div>
    )

}