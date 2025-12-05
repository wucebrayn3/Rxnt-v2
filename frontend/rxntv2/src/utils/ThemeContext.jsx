import { useContext, useState, useEffect, createContext } from "react";

const ThemeContext = createContext();

export function ThemeProvider  ({ children }) {
    const [mode, setMode] = useState('#F5F5F5');
    const [bg2, setBg2] = useState('#e7e8ebff');
    const [bg3, setBg3] = useState('#FEFEFE');
    const [color, setColor] = useState('#FFCDB2');
    const [shadow, setShadow] = useState('rgba(0,0,0,0.5)');
    const [fontColor, setFontColor] = useState('#212529');
    const [border, setBorder] = useState('#000000')

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
            toggleMode,
            toggleColor,
            toggleShadow,
            toggleFontColor,
            toggleBg3,
            toggleBg2,
            toggleBorder,
        }}
        >
            { children }
        </ThemeContext.Provider>
    )
}

export function useTheme () {
    return useContext(ThemeContext)
}