import axiosInstance from "../axiosInstance";
import { useState } from "react";
import styles from '../styles/PostOption.module.css';
import dots from '../assets/dots.png';
import { useTheme } from "../utils/ThemeContext";

export default function OptionBtn ({ objId, onDeletePost, onEditPost }) {
    
    const {color, shadow, bg3, bg2, fontColor} = useTheme();

    const [toggle, setToggle] = useState(false);
    const [toggleEdit, setToggleEdit] = useState(false);

    const handleToggle = () => {
        setToggle(kumag => kumag ? false : true)
    };

    const deletePost = async () => {
        try {
            console.log('Delete', objId)
            const response = await axiosInstance.delete(`app/delete-post/${objId}/`)
            onDeletePost();
        } catch (err) {
            console.error('Problema sa pagde-delete: ', err)
        }
    };
    
    const editPost = () => {
        console.log('Edit clicked', objId)
        onEditPost(objId);
    }
;
    return (
        <div className={styles.main}>
            <button style={{border: 'none', '--shadow':shadow}} className={styles.option_btn} onClick={handleToggle}><img src={dots} alt="" /></button>
            {toggle && 
                <div className={styles.option_panel} style={{backgroundColor: bg3, color: fontColor}}>
                    <h4 style={{ color:fontColor }} onClick={editPost}> Edit </h4>
                    <h4 style={{ color:fontColor }} onClick={deletePost}>Delete</h4>
                </div>
            }
        </div>
    )
}