import styles from '../styles/Threads.module.css'
import { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance';
import { Link } from 'react-router-dom';

export default function SearchUser () {

    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [usersWith, setUsersWith] = useState([]);

    const loadUsers = async () => {
        try {
            const response = await axiosInstance.get('users/')
            setUsers(response.data)
        } catch (err) {
            console.error('May nagkamali sa pagkuha ng user tol: ', err)
        }
    };

    useEffect(()=>{
        loadUsers();
    }, [])

    useEffect(()=>{
        query != '' ? setUsersWith(users.filter(u=>u.username.includes(query))) : false
    }, [query])

    return (
        <div className={styles.post_panel}>
            <h2>Search User:</h2>
            <form action="">
                <legend htmlFor='searchbar'>Search</legend>
                <input onChange={(e)=>setQuery(e.target.value)} type="text" name="searchbar" id="searchbar" placeholder="Type search query here..." required/>

            </form>
            {query && usersWith.sort().map(a=>{
                return <Link to={`/user/${a.id}`}><h3 key={a.id}>{a.username}</h3></Link>
            })
            }
        </div>
    )
}