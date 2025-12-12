import styles from '../styles/Threads.module.css';
import axiosInstance from '../axiosInstance';
import { useState } from 'react';
import { useTheme } from '../utils/ThemeContext';
import Success from './Success';

export default function CreatePostPanel({ onPost }) {

    const { color, fontColor, shadow, bg3, bg2 } = useTheme();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [placeholder, setPlaceHolder] = useState("Need to vent something out?");
    const [expand, setExpand] = useState(false);

    const [successInfo, setSuccessInfo] = useState(null);
    const [reset, setReset] = useState(0);

    const createPost = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/app/create-post/', { title, content });
            
            setTitle('');
            setContent('');
            setExpand(false);

            onPost();

            setSuccessInfo({ target: 'post', action: 'post' });
            setReset(prev => prev + 1);

        } catch (err) {
            console.error('Error creating post: ' + err);
        }
    };

    return (
        <div className={styles.post_panel} style={{ border: 'none', backgroundColor: bg2, color: fontColor }}>
            
            {successInfo && (
                <Success 
                    key={reset}
                    target={successInfo.target} 
                    action={successInfo.action} 
                    reset={reset}
                />
            )}

            <form onSubmit={createPost} onReset={() => setExpand(false)}>
                {expand && <legend htmlFor='title'>Title</legend>}

                <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder={placeholder}
                    required
                    style={{ border: 'none', boxShadow: `0 2px 4px ${shadow}`, fontSize: '0.7rem', margin: '0', width: '100%' }}
                    onFocus={() => { setPlaceHolder("Title here."); setExpand(true); }}
                    onBlur={() => setPlaceHolder('Need to vent something out?')}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {expand && (
                    <>
                        <legend htmlFor='content'>Content</legend>
                        <textarea
                            name="content"
                            id="content"
                            placeholder="Enter content here..."
                            required
                            rows={3}
                            style={{ border: 'none', boxShadow: `0 2px 4px ${shadow}` }}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="submit" value="Submit" style={{ boxShadow: `0 2px 4px ${shadow}` }} />
                            <input type="reset" value="Cancel" style={{ boxShadow: `0 2px 4px ${shadow}` }} />
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}
