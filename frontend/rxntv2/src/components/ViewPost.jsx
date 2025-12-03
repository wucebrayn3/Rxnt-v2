import styles from '../styles/ViewPost.module.css';
import klows from '../assets/close.png'

export default function PostView ({ title, content, author, created_at, comments, onClose }) {

    return (
        
        <div className={styles.main}>
            <div className={styles.post_details}>
                <div className={styles.close_container}>
                    <button className={styles.close} onClick={e => onClose()}>
                        <img src={klows} alt="close" />
                    </button>
                </div>
                <div className={styles.upper}>
                    <h4>{author}</h4>
                    <p><i>{created_at}</i></p>
                </div>
                <div className={styles.mid}>
                    <h3>{title}</h3>
                </div>
                <p className={styles.content}>{content}</p>
                <p>Comments: {comments}</p>
            </div>
        </div>
    )

}