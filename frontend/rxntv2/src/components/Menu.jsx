// will contain logout and settings

import { useState } from "react"
import { useTheme } from "../utils/ThemeContext";

import Logout from "./Logout";
import Theme from "./ChangeTheme";
import borgir from '../assets/menu (2).png';
import styles from '../styles/Menu.module.css';

export default function Menu () {

    const {color, mode} = useTheme();

    const [toggle, setToggle] = useState(false)

    const handleToggle = (e) => {
        setToggle(t => t ? false : true)
    }

    return (
        <>
            <div onClick={e => {e.stopPropagation() ;handleToggle(e)}} className={styles.main} style={{'--shadow':color}}>
                <img src={borgir} alt="burger menu" />
            </div>
            {toggle && 
                <div className={styles.dropdown} onClick={e => e.stopPropagation()} style={{backgroundColor: mode}}>
                    <Logout></Logout>
                    <Theme></Theme>
                </div>
            }
        </>
    )

}