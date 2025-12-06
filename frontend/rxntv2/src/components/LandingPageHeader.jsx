import { useEffect, useState } from "react";
import plus from '../assets/plus (1).png';
import user from '../assets/user.png'
import search from '../assets/loupe.png'
import home from '../assets/home.png'
import { useTheme } from "../utils/ThemeContext";

import Logout from "./Logout";
import { Link } from "react-router-dom";
import NotificationTray from "./NotificationTray";
import LandingPageMenu from "./LandingPageMenu";

import styles from '../styles/AddButton.module.css';

export default function LandingPageHeader({ onCreatePost, onSearchUser, users }) {

  const {fontColor, color, bg2, shadow, logo, logo2} = useTheme();

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
    zIndex: 9999,
    padding: '20px'
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
      <img src={logo2} className={styles.logo} style={{position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', margin:'0', height: '50%', '--shadow': color}}></img>
      
      <div style={{position: 'absolute', right: '20px', display: 'flex', gap: '10px'}}>
        <LandingPageMenu />
      </div>
    </header>
  );
}
