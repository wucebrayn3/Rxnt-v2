import axiosInstance from "../axiosInstance";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styles from '../styles/Dashboard.module.css';

export default function Dashboard () {

    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [reports, setReports] = useState([]);

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
    }

    useEffect(() => {
        loadEverythingAtOnce();
    }, []);

    const getUsername = (userId) => {
        if (!userId || !users || users.length === 0) return 'Unknown';
        const u = users.find(x => x.id === userId);
        return u ? u.username : 'Unknown';
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

    return (
        <>
            <div className={styles.main}>
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
                                <p>{formatDate(report.report_date   )}</p>
                            </div>
                            <div className={styles.buttons}>
                                <button>View</button>
                                <button>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )

}