import axiosInstance from "../axiosInstance";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from '../styles/Register.module.css';

export default function Register() {

    const Navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('api/user/register/', 
                {
                    username: username,
                    password: password
                }
            )
            Navigate('/login')
            console.log(response.data)
        } catch (err) {
            console.error('Walastek, mali sa rehistrasyon: ', err)
        }
    }

    return (
        <div className={styles.main}>
            <div className={styles.register_panel}>
                <div className={styles.register_container}>
                    <div className={styles.h1}>
                        <h1>Register</h1>
                    </div>
                    <div className={styles.form_itself}>
                        <form onSubmit={handleSubmit}>
                            <legend htmlFor='username'>Username</legend>
                            <input onChange={(e) => setUsername(e.target.value)} type="text" name="username" id="username" />

                            <legend htmlFor='password'>Password</legend>
                            <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" />

                            <input type="submit" value="Submit"/>
                        </form>
                    </div>
                    <div className={styles.login_link}>
                        <p>Tip: Don't use your real name</p>
                        <p>Please be polite and cautious when choosing usernames, do not use offensive names.</p>
                        <Link to={'/login'}><h5>Already have an account?</h5></Link>
                    </div>
                </div>
            </div>
        </div>
    )

}