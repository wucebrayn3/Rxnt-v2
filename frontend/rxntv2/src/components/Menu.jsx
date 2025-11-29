// will contain logout and settings

import { useState } from "react"

import Logout from "./Logout";

import borgir from '../assets/menu (2).png';
import styles from '../styles/Menu.module.css';

export default function Menu () {

    const [toggle, setToggle] = useState(false)

    const handleToggle = () => {
        setToggle(t => t ? false : true)
    }

    return (
        <div onClick={handleToggle} className={styles.main}>
            <img src={borgir} alt="burger menu" />
            {toggle && 
                <div className={styles.dropdown}>
                    <Logout></Logout>
                </div>
            }
        </div>
    )

}