import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

import styles from '../styles/Login.module.css';
import { useTheme } from '../utils/ThemeContext';

export default function Login() {

    const { mode, color, shadow, fontColor } = useTheme();

    const [username, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const Navigate = useNavigate()

    useEffect(()=>{
        if (password != "") {
            console.log(password)
        }
    }, [password])
    useEffect(()=>{
        if (username != "") {
            console.log(username)
        }
    }, [username])

    const login = async () => {
        try {
            const response = await axiosInstance.post(
                'api/token/',
                { username, password }
            );
            console.log(response)
            const tk = response.data.access
            const rf = response.data.refresh
            localStorage.setItem('username', username)
            localStorage.setItem('access',  tk)
            localStorage.setItem('refresh',  rf)
            Navigate('/thread')
        } catch (err) {
            console.error(`May mali: ${err}`)
        }
    }

    const handleChange = (e) => {
        if (e.target.name === "username"){
            setUserName(e.target.value)
        } else if (e.target.name === "password") {
            setPassword(e.target.value)
        } else {

        }
    }

    const submit = (e) => {
        e.preventDefault()
        console.log("Login clicked.")
        console.log(e.target[2])
        console.log(e.target[0])
        setUserName(e.target[0].value)
        setPassword(e.target[2].value)
        login()
    }

    return (
        <div className={styles.main} style={{color: fontColor}}>
            <div className={styles.login_panel} style={{backgroundColor: mode}}>
                <div className={styles.login_container} style={{backgroundColor: color, boxShadow: `0 5px 10px ${shadow}`}}>
                    <div className={styles.login_h1}>
                        <h1>Login</h1>
                    </div>
                    <div className={styles.form_itself}> 
                        <form onSubmit={submit} onChange={handleChange} method="POST" style={{color: fontColor}}>
                            <label htmlFor='username'>Username</label>
                            <input type="text" name="username" id="username"  placeholder='username' style={{backgroundColor: mode, color: fontColor}}/>

                            <label htmlFor='password'>Password</label>
                            <input type="password" name="password" id="password" placeholder='password' style={{backgroundColor: mode, color: fontColor}}/>

                            <input type="submit" value="Submit"  style={{color: fontColor, backgroundColor: mode}}/>
                        </form>
                    </div>
                    <div className={styles.register_link}>
                        <Link to={'/register'}><h5 style={{color: fontColor}}>Don't have an account?</h5></Link>
                    </div>
                </div>
            </div>
        </div>
    )

}