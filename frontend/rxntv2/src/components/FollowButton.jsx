import { useEffect, useState } from "react";
import Success from "./Success";

import styles from '../styles/FollowButton.module.css';
import axiosInstance from "../axiosInstance";

export default function FollowButton ({ is_following_user, id, onBtnClick }) {

    const [followState, setFollowState] = useState(null);
    const [successInfo, setSuccessInfo] = useState(null);

    useEffect(() => {
        setFollowState(is_following_user)
    }, [is_following_user])

    const follow = async () => {
        try {
            const response = await axiosInstance.post(`app/follow/user/${id}/`);
            console.log(response.data);
            
            setSuccessInfo({ target: 'user', action: 'follow' });
            onBtnClick();
        } catch (err) {
            console.error(err);
        }
    }

    const unfollow = async () => {
        try {
            const response = await axiosInstance.post(`app/unfollow/user/${id}/`);
            console.log(response.data);

            setSuccessInfo({ target: 'user', action: 'unfollow' });
            onBtnClick();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            {successInfo && (
                <Success
                    key={Date.now()}  
                    target={successInfo.target}
                    action={successInfo.action}
                />
            )}

            {followState == null ? (
                <h5>Null</h5>
            ) : followState ? (
                <h5 onClick={unfollow} className={styles.follow_btn}>Unfollow</h5>
            ) : (
                <h5 onClick={follow} className={styles.follow_btn}>Follow</h5>
            )}
        </>
    );
}
