import axiosInstance from "../axiosInstance";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../utils/ThemeContext";

import styles from '../styles/Register.module.css';

export default function Register() {
  const { fontColor, shadow, mode, color } = useTheme();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      return window.alert('Password must be longer than 8 characters.');
    }

    if (password.toLowerCase().includes(username.toLowerCase())) {
      return window.alert('Password cannot contain your username');
    }

    try {
      const filterResponse = await axiosInstance.post('app/filter/', {
        username: username
        }
      );

      console.log(filterResponse)
      
      if (!filterResponse.data.allowed) {
        return window.alert(filterResponse.data.message || 'Invalid username.');
      }

    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Username is not allowed.";

      return window.alert(msg);
    }

    try {
      const response = await axiosInstance.post('api/user/register/', {
        username: username,
        email: email,
        password: password
      });

      console.log(response.data);
      navigate('/login');

    } catch (err) {
      console.error('Walastek, mali sa rehistrasyon: ', err);

      const msg =
        err.response?.data?.message ||
        "Registration failed.";

      window.alert(msg);
    }
  };

  return (
    <div className={styles.main} style={{ color: fontColor }}>
      <div className={styles.register_panel} style={{ backgroundColor: mode }}>
        <div
          className={styles.register_container}
          style={{
            backgroundColor: color,
            boxShadow: `0 3px 6px ${shadow}`
          }}
        >
          <div className={styles.h1}>
            <h1>Register</h1>
          </div>

          <div className={styles.form_itself}>
            <form onSubmit={handleSubmit} style={{ color: fontColor }}>
              <legend htmlFor='username'>Username</legend>
              <input
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                name="username"
                id="username"
                style={{ backgroundColor: mode, color: fontColor }}
              />

              <legend htmlFor='email'>Email</legend>
              <input
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                id="email"
                style={{ backgroundColor: mode, color: fontColor }}
              />

              <legend htmlFor='password'>Password</legend>
              <input
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                id="password"
                style={{ backgroundColor: mode, color: fontColor }}
              />

              <input
                type="submit"
                value="Submit"
                style={{ color: fontColor, backgroundColor: mode }}
              />
            </form>
          </div>

          <div className={styles.login_link}>
            <p>Tip: Don't use your real name</p>
            <p>Please be polite and cautious when choosing usernames.</p>
            <Link to={'/login'}>
              <h5>Already have an account?</h5>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
