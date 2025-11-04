import styles from '../styles/Threads.module.css'

export default function CreatePostPanel () {
    return (
        <div className={styles.post_panel}>
            <h2>Create post</h2>
            <h3>{localStorage.getItem('username')}</h3>
            <form action="">
                <legend htmlFor='title'>Title</legend>
                <input type="text" name="title" id="title" placeholder="Enter title here..." required/>

                <legend htmlFor='content'>Content</legend>
                <textarea name="content" id="content" placeholder="Enter content here..." required rows={3}></textarea>

                <input type="submit" value="Submit"/>
            </form>
        </div>
    )
}