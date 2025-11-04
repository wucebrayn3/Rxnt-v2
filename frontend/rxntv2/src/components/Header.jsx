import { useEffect, useState } from "react";
import plus from '../assets/plus (1).png';
import user from '../assets/user.png'
import search from '../assets/loupe.png'

import { Link } from "react-router-dom";
import styles from '../styles/AddButton.module.css'

export default function Header({ onCreatePost, onSearchUser }) {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const defaultStyle = {
    position: "fixed",
    height: "60px",
    width: "100vw",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: '2px black solid',
    boxShadow: '0 5px 10px rgba(0,0,0,0.5)',
    transition: "0.2s",
    color: 'black'
  };

  const fixedStyle = {
    // border: "1px solid black",
    borderRadius: "20px",
    width:"calc(100vw - 40px)",
    height: "50px",
    marginTop: "20px",
    boxShadow: "0 0 10px rgba(0,0,0,0.75)",
  };

  return (
    <header
      style={{
        ...defaultStyle,
        ...(isFixed ? fixedStyle : { position: "fixed" }),
      }}
    >
      <button  onClick={onCreatePost} className={styles.add_button} style={{background: 'transparent', height: '30px', border: '2px black solid', borderRadius: '100%', padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><img style={{height: '100%'}} src={plus} alt="" /></button>
      <button onClick={onSearchUser} style={{background: 'transparent', height: '30px', border: '2px black solid', borderRadius: '100%', padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><img style={{height: '100%'}} src={user}></img></button>  
      <Link to='/me'><button style={{background: 'transparent', height: '30px', border: '2px black solid', borderRadius: '100%', padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><img style={{height: '100%'}} src={search}></img></button>  </Link>
    </header>
  );
}
