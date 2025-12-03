import styles from '../styles/ViewComment.module.css';
import klows from '../assets/close.png'

export default function CommentView ({ content, author, created_at, onClose }) {

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
                <p className={styles.content}>{content}</p>
            </div>
        </div>
    )

}