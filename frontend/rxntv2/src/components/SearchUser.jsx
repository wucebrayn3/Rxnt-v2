import { useState, useEffect } from 'react'
import axiosInstance from '../axiosInstance';
import { Link } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';

import styles from '../styles/Threads.module.css'

export default function SearchUser () {

    const { color, fontColor, shadow } = useTheme();

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
        <div className={styles.post_panel} style={{border: 'none', boxShadow: `0 5px 10px ${shadow}`, backgroundColor: color, color: fontColor}}>
            <h2>Search User:</h2>
            <form action="">
                <legend htmlFor='searchbar'>Search</legend>
                <input onChange={(e)=>setQuery(e.target.value)} type="text" name="searchbar" id="searchbar" placeholder="Type search query here..." required/>

            </form>
            <div className={styles.result_container}>
                {query && usersWith.sort().map(a=>{
                    return <Link to={`/user/${a.id}`}><h3 style={{color: fontColor}} key={a.id}>{a.username}</h3></Link>
                })
                }
            </div>
        </div>
    )
}