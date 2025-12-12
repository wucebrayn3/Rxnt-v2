import { useState } from 'react';
import styles from '../styles/ViewPost.module.css';
import klows from '../assets/close.png'
import { useTheme } from '../utils/ThemeContext';
import axiosInstance from '../axiosInstance';

export default function PostView ({ title, content, author, created_at, comments, onClose, commentsList = [], postId, authorId, onPostDelete, onCommentDelete, adminId }) {

    const { color, shadow, fontColor, bg2, bg3 } = useTheme();
    const [expandedComments, setExpandedComments] = useState({});

    const toggleExpandComment = (commentId) => {
        setExpandedComments(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const sendNotification = async (recipientId, topic, notificationContent) => {
        try {
            // Ensure recipientId is valid before sending
            if (!recipientId || recipientId === null || recipientId === undefined) {
                console.error('Invalid recipient ID:', recipientId);
                return;
            }
            await axiosInstance.post('app/notifications/', {
                recipients: [Number(recipientId)],
                sender: adminId,
                topic: topic,
                content: notificationContent
            });
        } catch (err) {
            console.error('Error sending notification:', err);
        }
    };

    const deletePost = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await axiosInstance.delete(`app/delete-post/${postId}/`);
                // Send notification to post author
                await sendNotification(authorId, 'POST removed by admin', `Your post "${title}" has been removed by an admin.`);
                onPostDelete && onPostDelete();
                onClose();
            } catch (err) {
                console.error('Error deleting post:', err);
            }
        }
    };

    const deleteComment = async (commentId, commentAuthorId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await axiosInstance.delete(`app/delete-comment/${commentId}/`);
                // Send notification to comment author
                await sendNotification(commentAuthorId, 'COMMENT removed by admin', 'Your comment has been removed by an admin.');
                onCommentDelete && onCommentDelete();
            } catch (err) {
                console.error('Error deleting comment:', err);
            }
        }
    };

    const CommentConstructor = ({ obj }) => (
        <>
            {(obj || []).map(o => {
                const isExpanded = expandedComments[o.id];
                const isLong = o.content?.length > 150;

                return (
                    <div key={o.id} className={styles.comment_subcontainer}>
                        <div className={styles.comment_item} style={{ border: 'none', backgroundColor: color, boxShadow: `0 2px 2px ${shadow}` }}>
                            <div className={styles.comment_header}>
                                <h5 className={styles.usernames} style={{ color: fontColor }}>{o.author}</h5>
                                <button 
                                    className={styles.delete_btn}
                                    onClick={() => deleteComment(o.id, o.author)}
                                    title="Delete comment"
                                >
                                    ✕
                                </button>
                            </div>

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
                        </div>

                        <CommentConstructor obj={(o.replies || [])} />
                    </div>
                );
            })}
        </>
    );

    return (
        
        <div className={styles.main}>
            <div className={styles.post_details} style={{ backgroundColor: bg3, color: fontColor }}>
                <div className={styles.close_container}>
                    <button className={styles.close} onClick={e => onClose()}>
                        <img src={klows} alt="close" />
                    </button>
                    {postId && (
                        <button className={styles.delete_post_btn} onClick={deletePost} title="Delete post">
                            Delete Post
                        </button>
                    )}
                </div>

                {/* Upper Container - Author and Date */}
                <div className={styles.upper_container} style={{ backgroundColor: color, boxShadow: `0 2px 4px ${shadow}` }}>
                    <div className={styles.upper}>
                        <h4>{author}</h4>
                        <p><i>{created_at}</i></p>
                    </div>
                </div>

                {/* Content Container - Title and Content */}
                <div className={styles.content_container} style={{ backgroundColor: bg3 }}>
                    <div className={styles.mid}>
                        <h3>{title}</h3>
                    </div>
                    <p className={styles.content}>{content}</p>
                </div>
                
                {/* Comments Container */}
                <div className={styles.comments_container} style={{ backgroundColor: bg2 }}>
                    <h4>{comments} {comments > 1 ? 'comments' : 'comment'}</h4>
                    <CommentConstructor obj={commentsList.filter(c => c.parent == null)} />
                </div>
            </div>
        </div>
    )

}