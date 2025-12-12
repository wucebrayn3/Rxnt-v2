import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

import styles from '../styles/Login.module.css';
import { useTheme } from '../utils/ThemeContext';
import Success from './Success';

export default function Login() {

    const { mode, color, shadow, fontColor } = useTheme();

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [successInfo, setSuccessInfo] = useState(null);
    const [reset, setReset] = useState(0);

    const Navigate = useNavigate();

    const login = async () => {
        try {
            const response = await axiosInstance.post(
                'api/token/',
                { username, password }
            );

            console.log(response);

            const tk = response.data.access;
            const rf = response.data.refresh;
            localStorage.setItem('username', username);
            localStorage.setItem('access', tk);
            localStorage.setItem('refresh', rf);

            // Show success message
            setSuccessInfo({ target: 'user', action: 'login' });
            setReset(prev => prev + 1);

            // Redirect user
            try {
                const meResponse = await axiosInstance.get('api/me/');
                if (meResponse.data.is_staff) {
                    Navigate('/dashboard');
                } else {
                    Navigate('/thread');
                }
            } catch (err) {
                console.error(err);
            }

        } catch (err) {
            console.error(`Login error: ${err}`);
        }
    };

    const handleChange = (e) => {
        if (e.target.name === "username") {
            setUserName(e.target.value);
        } else if (e.target.name === "password") {
            setPassword(e.target.value);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        login();
    };

    return (
        <div className={styles.main} style={{ color: fontColor }}>
            
            {/* Success message */}
            {successInfo && (
                <Success
                    key={reset} 
                    target={successInfo.target}
                    action={successInfo.action}
                    reset={reset} 
                />
            )}

            <div className={styles.login_panel} style={{ backgroundColor: mode }}>
                <div className={styles.login_container} style={{ backgroundColor: color, boxShadow: `0 5px 10px ${shadow}` }}>
                    <div className={styles.login_h1}>
                        <h1>Login</h1>
                    </div>
                    <div className={styles.form_itself}>
                        <form onSubmit={submit} onChange={handleChange} method="POST" style={{ color: fontColor }}>
                            <label htmlFor='username'>Username</label>
                            <input
                                autoComplete='off'
                                autoCorrect='off'
                                type="text"
                                name="username"
                                id="username"
                                placeholder='username'
                                style={{ backgroundColor: mode, color: fontColor }}
                                value={username}
                            />

                            <label htmlFor='password'>Password</label>
                            <input
                                autoComplete='off'
                                autoCorrect='off'
                                type="password"
                                name="password"
                                id="password"
                                placeholder='password'
                                style={{ backgroundColor: mode, color: fontColor }}
                                value={password}
                            />

                            <input
                                type="submit"
                                value="Submit"
                                style={{ color: fontColor, backgroundColor: mode }}
                            />
                        </form>
                    </div>
                    <div className={styles.register_link}>
                        <Link to={'/register'}>
                            <h5 style={{ color: fontColor }}>Don't have an account?</h5>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
