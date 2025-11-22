import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import styles from '../styles/Logout.module.css';

export default function Logout() {

    const Navigate = useNavigate();
    const refresh = localStorage.getItem('refresh')

    const logout = async () => {
        try {
            await axiosInstance.post('/logout/',
                {
                    refresh
                }
            )
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            localStorage.removeItem('username')
            Navigate('/login')
        } catch (err) {
            console.error('Nagkaron ng problema sa logout pre: ', err)
        }
    }

    return <button className={styles.logout_btn} onClick={logout} >Logout</button>
}