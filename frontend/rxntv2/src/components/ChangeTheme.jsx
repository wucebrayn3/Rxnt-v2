import { useTheme } from "../utils/ThemeContext";

import styles from '../styles/ChangeTheme.module.css';

export default function ThemeButton() {
  const { mode, fontColor, toggleMode, toggleFontColor, toggleColor, toggleIcon, toggleShadow, shadow, toggleBorder, toggleBg2, toggleBg3, toggleLogo, toggleLogo2, logo2 } = useTheme();

  const btnText = mode === '#F5F5F5' ? 'Dark mode' : 'Light mode';

  return (
    <div className={styles.themes}>
        
        <button
        onClick={() => {
            toggleMode();
            toggleFontColor();
            toggleShadow();
            toggleBorder();
            toggleBg3();
            toggleBg2();
            toggleLogo();
            toggleIcon();
            toggleLogo2();
        }}
        style={{
            backgroundColor: mode,
            color: fontColor,
        }}
        >
        {btnText}
        </button>
        <div className={`${styles.theme_colors}`} style={{backgroundColor: mode}}>
            <span className={`${styles.theme_btn} ${styles.c1}`} onClick={() => toggleColor('#FB7A8E')}></span>
            <span className={`${styles.theme_btn} ${styles.c3}`} onClick={() => toggleColor('#9D4EDD')}></span>
            <span className={`${styles.theme_btn} ${styles.c2}`} onClick={() => toggleColor('#4CC9F0')}></span>
            <span className={`${styles.theme_btn} ${styles.c4}`} onClick={() => toggleColor('#274C77')}></span>
            <span className={`${styles.theme_btn} ${styles.c5}`} onClick={() => toggleColor('#2A9D8F')}></span>
            <span className={`${styles.theme_btn} ${styles.c6}`} onClick={() => toggleColor('#57CC99')}></span>
        </div>
    </div>
  );
}
