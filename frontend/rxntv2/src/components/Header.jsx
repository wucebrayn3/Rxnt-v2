import { useEffect, useState } from "react";
import plus from '../assets/plus (1).png';
import user from '../assets/user.png'
import search from '../assets/loupe.png'
import home from '../assets/home.png'
import { useTheme } from "../utils/ThemeContext";

import Logout from "./Logout";
import { Link } from "react-router-dom";
import NotificationTray from "./NotificationTray";
import Menu from "./Menu";

import styles from '../styles/AddButton.module.css';

export default function Header({ onCreatePost, onSearchUser, users }) {

  const {fontColor, color, bg2, shadow, logo, addIcon, searchIcon, userIcon, homeIcon, menuIcon} = useTheme();

  const [isFixed, setIsFixed] = useState(false);
  const [show, setShow] = useState(true)
  const [yScroll, setYScroll] = useState(false)

  useEffect(() => {
    let lastScroll = window.pageYOffset;

    const handleScroll = () => {
      const currenScroll = window.pageYOffset;

      if (currenScroll > lastScroll) {
        setShow(false)
      } else {
        setShow(true)
      };

      lastScroll = currenScroll <= 0 ? 0: currenScroll;
    };

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const defaultStyle = {
    position: "fixed",
    top: '0',
    height: "60px",
    width: "100vw",
    background: bg2,
    display: "flex",
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    boxShadow: `0 5px 10px ${shadow}`,
    transition: "0.5s",
    color: 'black',
    zIndex: 9999
  };

  const fixedStyle = {
    top: '-200px',
    width:"100vw",
    height: "50px",
    boxShadow: `0 5px 10px ${shadow}`,
  };

    const getId = (un) => {
        if (!un || !users || users.length === 0) return 'Unknown';
        const u = users.find(x => x.username === un);
        return u ? u.id : 'Unknown';
    }

  return (
    <header
      style={{
        ...defaultStyle,
        ...(!show ? fixedStyle : { position: "fixed" }),
      }}
    >
      <img src={logo} className={styles.logo} style={{position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', margin:'0', height: '100%', '--shadow': color}}></img>
      <div className={styles.btn_container} style={{'--shadow': color}}>
        
            <button  onClick={onCreatePost} className={styles.add_button}>
              <img style={{height: '100%'}} src={addIcon} alt="" />
            </button>

            <button onClick={onSearchUser} className={styles.search_button}>
              <img style={{height: '100%'}} src={searchIcon}></img>
            </button>  

            <Link to='/me'>
              <button  className={styles.me_button}>
                <img style={{height: '100%'}} src={userIcon}></img>
              </button>  
            </Link>

            <Link to='/thread'>
              <button  className={styles.me_button}>
                <img style={{height: '100%'}} src={homeIcon}></img>
              </button>  
            </Link>

            <Link to='/thread'>
              <button className={styles.me_button} style={{height:'25px', color: fontColor}}>D</button>
            </Link>
        
      </div>
      {/* <NotificationTray me={getId(user)}></NotificationTray> */}
      <div style={{position: 'absolute', right: '20px', display: 'flex', gap: '10px'}}>
        <NotificationTray></NotificationTray>
        <Menu></Menu>
      </div>
    </header>
  );
}
