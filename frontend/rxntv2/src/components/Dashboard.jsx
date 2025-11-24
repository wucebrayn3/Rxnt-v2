import axiosInstance from "../axiosInstance";
import { useState, useEffect } from "react";

export default function Dashboard () {

    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [reports, setReports] = useState([]);

    return (
        <>
            <div>
                <h1>Admin Dashboard</h1>
            </div>
        </>
    )

}