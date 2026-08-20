import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("mohandesino_theme");
    return saved === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("mohandesino_theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("mohandesino_theme", "light");
    }
  }, [dark]);

  const toggleTheme = () => setDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}