import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import theme from "./theme.tsx";
import {ThemeProvider} from "@mui/material";

createRoot(document.getElementById('root')!).render(
        <ThemeProvider theme={theme}>
            <App/>
        </ThemeProvider>
)
