import { Link } from "react-router-dom"
import { useTheme } from "../utils/ThemeContext";

import LandingPageHeader from "./LandingPageHeader";

import styles from '../styles/LandingPage.module.css';

export default function LandingPage() {

    const {color, bg2, bg3, mode, shadow, fontColor, pencilIcon, communityIcon, heartIcon, logo, logo2, fb, ig, threads} = useTheme();

    return (
        <div className={styles.main} style={{backgroundColor: mode, color: fontColor}}>
            <LandingPageHeader></LandingPageHeader>
            <div className={styles.content}>
                <div className={styles.left_panel} style={{backgroundColor: mode}}>
                    <h1>Where <span style={{color: color}}>words</span> matter more than <span style={{'--shadow': color}} className={styles.identity}>identity</span></h1>
                    <h4>Experience a new way to connect with friends, share moments, and build meaningful relationships across our platform.</h4>
                    <div className={styles.links}>
                        <Link to={'/register'}><button style={{backgroundColor: color, color: fontColor, boxShadow: `0 2px 2px ${shadow}`}}>Sign up now!</button></Link>
                        <Link to={'/login'}><span style={{color: color}}>Already have an account? Login here!</span></Link>    
                    </div>
                </div>            
                <div className={styles.right_panel} style={{backgroundColor: mode}}>
                    <img src={logo2} alt="" />    
                    <img src={logo} alt="" />    
                </div>             
            </div>   
            <div className={styles.about} style={{backgroundColor: mode}}>
                <div className={styles.card} style={{boxShadow: `0 2px 4px ${shadow}`, backgroundColor: bg3}}>
                    <img src={pencilIcon} alt="" style={{'--shadow':color}}/>
                    <h4 className={styles.title} style={{color: color}}>Word-First Platform</h4>
                    <p>
                        Your writing takes center stage. No profile pictures, no followers count - just pure expression through words.
                    </p>
                </div>

                <div className={styles.card} style={{boxShadow: `0 2px 4px ${shadow}`, backgroundColor: bg3}}>
                    <img src={communityIcon} alt=""  style={{'--shadow':color}}/>
                    <h4 className={styles.title} style={{color: color}}>Thoughtful Community</h4>
                    <p>
                        Connect with people through ideas and perspectives, not appearances. Build meaningful connections through conversation.
                    </p>
                </div>

                <div className={styles.card} style={{boxShadow: `0 2px 4px ${shadow}`, backgroundColor: bg3}}>
                    <img src={heartIcon} alt="" style={{'--shadow':color}} />
                    <h4 className={styles.title} style={{color: color}}>Judgement-Free Zone</h4>
                    <p>
                        Express yourself freely without the pressure of likes, views, or social validation. Just authentic sharing.
                    </p>
                </div>
                
            </div>
            <div className={styles.share} style={{backgroundColor: mode}}>
                <h1>Ready to share your <span style={{color: color}}>thoughts?</span></h1>
                <h4>Join a community where <span style={{color:color}}>your words matter more</span> than your identity, not the other way around.</h4>
                <br />
                <h1>Or...you can share us with your friends!</h1>
                <h4>Just copy the link: <a href="/">localhost:5173</a></h4>
            </div>
            <footer style={{backgroundColor: color}}>
                <div className={styles.logos}>
                    <img src={logo} alt="" />
                    <h3>Rxnt v2</h3>
                </div>
                <div className={styles.icons}>
                    <img src={fb} alt="" />
                    <img src={ig} alt="" />
                    <img src={threads} alt="" />
                </div>
                
            </footer>
            
        </div>
    )

}