import { useEffect, useState } from "react";

import styles from '../styles/FollowButton.module.css';
import axiosInstance from "../axiosInstance";

export default function FollowButton ({ is_following_user, id, onBtnClick }) {

    const [followState, setFollowState] = useState(null)

    useEffect(() => {
        setFollowState(is_following_user)
    }, [is_following_user])

    const follow = async () => {
        try {
            const response = await axiosInstance.post(`app/follow/user/${id}/`)
            console.log(response.data)
            onBtnClick();
        } catch (err) {
            console.error(err)
        }
    }

    const unfollow = async () => {
        try {
            const response = await axiosInstance.post(`app/unfollow/user/${id}/`)
            console.log(response.data)
            onBtnClick();
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            {followState == null ? <h5>Null</h5> : followState ? <h5 onClick={unfollow} className={styles.follow_btn}>Unfollow</h5> : <h5 onClick={follow} className={styles.follow_btn}>Follow</h5>}
        </>
    )

}