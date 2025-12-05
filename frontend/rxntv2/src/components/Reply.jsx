// import { useState, useEffect } from "react";
// import axiosInstance from "../axiosInstance";
// import { useTheme } from "../utils/ThemeContext";

// import styles from '../styles/Reply.module.css';

// export default function CreateReply ({ postId, parent }) {
    
//     const { bg2, fontColor, shadow } = useTheme();

//     const [query, setQuery] = useState('');

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     console
    //     try {
    //         const response = await axiosInstance.post('/app/create-comment/',
    //             {
    //                 content: query,
    //                 post: postId,
    //                 parent: parent?parent:null
    //             }
    //         )
    //         console.log(response)
    //     } catch (err) {
    //         console.error('Engk sa reply man: ', err)
    //     }
    // }

//     return (
//         <>
//             <div className={styles.main} style={{position: 'relative'}}>
//                 <h6 className={styles.reply} onClick={handleToggle}>Reply</h6>
//             </div>
//             {toggle && 
//                 <form onSubmit={handleSubmit} action="" onReset={handleToggle} style={{ width: '200px', height: 'fit-content', backgroundColor: bg2, boxShadow: `0 2px 4px ${shadow}`, border: 'none', borderRadius: '10px', }}>
//                     <input onChange={(e)=>setQuery(e.target.value) } type="text" name="" id="" style={{width: '100%', margin: '0'}}/>
//                     <input type="submit" value="Submit" style={{width: '100%'}}/>
//                     <input type="reset" value="Cancel" />
//                 </form>
//             }
//         </>    
//     )
// }