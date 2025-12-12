import axiosInstance from "../axiosInstance";
import { useState } from "react";
import styles from '../styles/PostOption.module.css';
import dots from '../assets/dots.png';
import { useTheme } from "../utils/ThemeContext";
import Success from "./Success";

export default function OptionBtn({ objId, onDeletePost, onEditPost }) {
    
    const { color, shadow, bg3, bg2, fontColor } = useTheme();

    const [toggle, setToggle] = useState(false);
    const [successInfo, setSuccessInfo] = useState(null);
    const [reset, setReset] = useState(0);

    const handleToggle = () => {
        setToggle(prev => !prev);
    };

    const deletePost = async () => {
        try {
            console.log('Delete', objId)
            await axiosInstance.delete(`app/delete-post/${objId}/`);
            
            // Trigger delete callback
            onDeletePost();

            // Show success message
            setSuccessInfo({ target: 'post', action: 'delete' });
            setReset(prev => prev + 1);

        } catch (err) {
            console.error('Problema sa pagde-delete: ', err);
        }
    };
    
    const editPost = () => {
        console.log('Edit clicked', objId)
        onEditPost(objId);
    };

    return (
        <div className={styles.main}>

            {/* Success message */}
            {successInfo && (
                <Success
                    key={reset}             // forces restart
                    target={successInfo.target}
                    action={successInfo.action}
                    reset={reset}
                />
            )}

            <button
                style={{ border: 'none', '--shadow': shadow }}
                className={styles.option_btn}
                onClick={handleToggle}
            >
                <img src={dots} alt="" />
            </button>

            {toggle && 
                <div className={styles.option_panel} style={{ backgroundColor: bg3, color: fontColor }}>
                    <h4 style={{ color: fontColor }} onClick={editPost}>Edit</h4>
                    <h4 style={{ color: fontColor }} onClick={deletePost}>Delete</h4>
                </div>
            }
        </div>
    )
}
