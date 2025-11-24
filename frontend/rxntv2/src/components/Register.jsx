import axiosInstance from "../axiosInstance";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <legend htmlFor='username'>Username</legend>
                <input onChange={(e) => setUsername(e.target.value)} type="text" name="username" id="username" />

                <legend htmlFor='password'>Password</legend>
                <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" />

                <input type="submit" value="Submit"/>
            </form>
            <p>Tip: Don't use your real name</p>
            <p>Please be polite and cautious when choosing usernames, do not use offensive names.</p>
            <Link to={'/login'}>Already have an account?</Link>
        </div>
    )

}