import axiosInstance from "../axiosInstance";
import { useState } from "react";
import styles from '../styles/COmmentOption.module.css';

export default function CommentOptionBtn ({ objId, onDeleteComment, onEditComment }) {
    
    const [toggle, setToggle] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleToggleDelete = () => {
        setConfirmDelete(kumag => kumag ? false : true)
    };

    const handleToggleEdit = () => {
        setToggle(kumag => kumag ? false : true)
    };

    const deleteComment = async () => {
        try {
            const response = await axiosInstance.delete(`app/delete-comment/${objId}/`)
            onDeleteComment();
        } catch (err) {
            console.error('Problema sa pagde-delete: ', err)
        }
    };
    
    const editComment = () => {
        onEditComment(objId);
    };

    const confirm = () =>  {
        handleToggleDelete();
        handleToggleEdit();
    }

    return (
        <div className={styles.main}>
            <h6 className={styles.edittt} onClick={editComment}>Edit</h6>
            <h6 className={styles.deleteee} onClick={confirm}>Delete</h6>
            {
                confirmDelete ?
                    <div className={styles.confirm}>
                        <h3>Confirm delete?</h3>
                        <p>This action can't be undone.</p>
                        <div>
                            <button onClick={confirm}>Cancel</button>
                            <button className={styles.deletebtn} onClick={deleteComment}>Delete</button>
                        </div>
                    </div>
                    :
                    false
            }
        </div>
    )
}