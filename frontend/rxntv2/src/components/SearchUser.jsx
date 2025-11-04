import styles from '../styles/Threads.module.css'

export default function SearchUser () {
    return (
        <div className={styles.post_panel}>
            <h2>Search User:</h2>
            <form action="">
                <legend htmlFor='searchbar'>Search</legend>
                <input type="text" name="searchbar" id="searchbar" placeholder="Type search query here..." required/>

                <input type="submit" value="Submit"/>
            </form>
        </div>
    )
}