import {createTheme} from '@mui/material/styles';

let theme = createTheme();

theme = createTheme(theme, {
    palette: {
        primary: {
            main: '#3b82f6',
            light: '#93c5fd',
            dark: '#1d4ed8',
        },
        green: {
            main: '#22c55e',
            light: '#86efac',
            dark: '#16a34a',
            contrastText: '#242105'
        },
        red: {
            main: '#ef4444',
            light: '#fca5a5',
            dark: '#b91c1c',
            contrastText: '#242105'
        },
        violet: {
            main: '#a855f7',
            light: '#d8b4fe',
            dark: '#9333ea',
            contrastText: '#242105'
        },
        teal: {
            main: '#fb923c',
            light: '#fed7aa',
            dark: '#ea580c',
            contrastText: '#242105'
        }
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
});

export default theme;
