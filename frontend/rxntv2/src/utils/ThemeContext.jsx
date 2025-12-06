import { useContext, useState, useEffect, createContext } from "react";

import darkmodeLogo from '../assets/logo 128x128.png';
import lightmodeLogo from '../assets/logo 128x128 2.png';

import darkIllus from '../assets/dark mode illus.png';
import lightIllus from '../assets/light mode illus.png';

import darkmodeSearch from '../assets/loupe (1).png'
import lightmodeSearch from '../assets/loupe.png'

import darkmodeUser from '../assets/user (2).png';
import lightkmodeUser from '../assets/user.png';

import darkmodeAdd from '../assets/plus (2).png'
import lightmodeAdd from '../assets/plus (1).png'

import darkmodeHome from '../assets/home (1).png'
import lightmodeHome from '../assets/home.png'

import lightmodeHamburger from '../assets/menu (2).png'
import darkmodeHamburger from '../assets/menu (9).png'

import darkmodePencil from '../assets/pencil (1).png';
import lightmodePencil from '../assets/pencil.png';

import darkmodeCommunity from '../assets/social-justice (1).png'
import lightmodeCommunity from '../assets/social-justice.png'

import darkmodeHeart from '../assets/heart (1).png';
import lightmodeHeart from '../assets/heart.png';

import darkfb from '../assets/fb.png';
import lightfb from '../assets/fb 2.png';

import darkig from '../assets/ig.png';
import lightig from '../assets/ig 2.png';

import darkthreads from '../assets/threads.png';
import lightthreads from '../assets/threads 2.png';

const ThemeContext = createContext();

export function ThemeProvider  ({ children }) {
    const [mode, setMode] = useState('#F5F5F5');
    const [bg2, setBg2] = useState('#e7e8ebff');
    const [bg3, setBg3] = useState('#FEFEFE');
    const [color, setColor] = useState('#57CC99');
    const [shadow, setShadow] = useState('rgba(0,0,0,0.5)');
    const [fontColor, setFontColor] = useState('#212529');
    const [border, setBorder] = useState('#000000');
    const [logo, setLogo] = useState(lightmodeLogo);
    const [logo2, setLogo2] = useState(lightIllus);
    const [addIcon, setAddIcon] = useState(lightmodeAdd);
    const [searchIcon, setSearchIcon] = useState(lightmodeSearch);
    const [userIcon, setUserIcon] = useState(lightkmodeUser);
    const [homeIcon, setHomeIcon] = useState(lightmodeHome);
    const [menuIcon, setMenuIcon] = useState(lightmodeHamburger);
    const [pencilIcon, setPencilIcon] = useState(lightmodePencil);
    const [communityIcon, setCommunityIcon] = useState(lightmodeCommunity);
    const [heartIcon, setHeartIcon] = useState(lightmodeHeart);
    const [fb, setFb] = useState(darkfb);
    const [ig, setIg] = useState(darkig);
    const [threads, setThreads] = useState(darkthreads);

    function toggleMode () {
        setMode(prev => prev === '#F5F5F5' ? '#1A1A1A' : '#F5F5F5');
    };

    function toggleColor (newColor) {
        setColor(newColor);
    };

    function toggleShadow () {
        setShadow(s => s === 'rgba(0,0,0,0.5)' ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.5)');
    };

    function toggleFontColor () {
        setFontColor(prev => prev === '#212529' ? '#F1F1F1' : '#212529');
    };

    function toggleBg2 () {
        setBg2(bg => bg === '#e7e8ebff' ? '#2A2A2A' : '#e7e8ebff')
    }

    function toggleBorder () {
        setBorder(b => b === '#000000' ? '#FFFFFF' : '#000000')
    }

    function toggleBg3 () {
        setBg3(b => b === '#FEFEFE' ? '#181818' : '#FEFEFE');
    }

    function toggleLogo () {
        setLogo(l => l === lightmodeLogo ? darkmodeLogo : lightmodeLogo)
    }

    function toggleLogo2 () {
        setLogo2(l => l === lightIllus ? darkIllus : lightIllus)
    }

    function toggleIcon () {
        setAddIcon(ai => ai === lightmodeAdd ? darkmodeAdd : lightmodeAdd);
        setSearchIcon(si => si === lightmodeSearch ? darkmodeSearch : lightmodeSearch);
        setUserIcon(ui => ui === lightkmodeUser ? darkmodeUser : lightkmodeUser);
        setHomeIcon(hi => hi === lightmodeHome ? darkmodeHome : lightmodeHome);
        setMenuIcon(mi => mi === lightmodeHamburger ? darkmodeHamburger : lightmodeHamburger);
        setPencilIcon(pi => pi === lightmodePencil ? darkmodePencil : lightmodePencil);
        setCommunityIcon(ci => ci === lightmodeCommunity ? darkmodeCommunity : lightmodeCommunity);
        setHeartIcon(hi => hi === lightmodeHeart ? darkmodeHeart : lightmodeHeart);
        setFb(smi => smi === lightfb ? darkfb : lightfb);
        setIg(smi => smi === lightig ? darkig : lightig);
        setThreads(smi => smi === lightthreads ? darkthreads : lightthreads);
    }

    return (
        <ThemeContext.Provider
        value={{
            mode,
            color,
            shadow,
            fontColor,
            bg3,
            bg2,
            border,
            logo,
            addIcon,
            searchIcon,
            userIcon,
            homeIcon,
            menuIcon,
            logo2,
            pencilIcon,
            communityIcon,
            heartIcon,
            fb,
            ig,
            threads,
            toggleMode,
            toggleColor,
            toggleShadow,
            toggleFontColor,
            toggleBg3,
            toggleBg2,
            toggleBorder,
            toggleLogo,
            toggleIcon,
            toggleLogo2,
        }}
        >
            { children }
        </ThemeContext.Provider>
    )
}

export function useTheme () {
    return useContext(ThemeContext)
}