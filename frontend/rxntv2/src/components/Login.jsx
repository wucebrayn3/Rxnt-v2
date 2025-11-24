import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

export default function Login() {

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
        <>
            <h1>Login</h1>
            <form onSubmit={submit} onChange={handleChange} method="POST">
                <legend htmlFor='username'>Username</legend>
                <input type="text" name="username" id="username" />

                <legend htmlFor='password'>Password</legend>
                <input type="password" name="password" id="password" />

                <input type="submit" value="Submit"/>
            </form>
            <Link to={'/register'}>Don't have an account?</Link>
        </>
    )

}