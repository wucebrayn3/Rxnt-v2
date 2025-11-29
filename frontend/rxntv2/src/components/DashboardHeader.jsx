import { useEffect, useState } from "react";

import Logout from "./Logout";
import { Link } from "react-router-dom";
import Menu from "./Menu";

import adminsvg from '../assets/admin.svg';
import styles from '../styles/DashboardHeader.module.css';

export default function DashboardHeader() {
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
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    border: '2px transparent solid',
    boxShadow: '0 5px 10px rgba(0,0,0,0.5)',
    transition: "0.2s",
    color: 'black',
    zIndex: 100,
    padding: '10px',
    boxSizing: 'border-box'
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
        <div className={styles.header_text}>
            <img src={adminsvg} alt="" />
            <div className={styles.texts}>
                <h3>Admin access - Admin Dashboard View</h3>
                <p>Manage and monitor all platform users.</p>
            </div>
        </div>
      {/* <NotificationTray me={getId(user)}></NotificationTray> */}
      <div style={{position: 'absolute', right: '20px'}}>
        <Menu></Menu>
      </div>
    </header>
  );
}
