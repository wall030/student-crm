import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import {IntlProvider} from "react-intl";
import {useEffect, useState} from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import StudentsPage from './pages/StudentsPage'
import CoursesPage from './pages/CoursesPage'
import './index.css'
import messagesEN from './locales/en.json'
import messagesDE from './locales/de.json'
import {Toaster} from "react-hot-toast";

const messages: { [key: string]: Record<string, string> } = {
    en: messagesEN,
    de: messagesDE,
}

const App = () => {

    const [locale, setLocale] = useState<string>(() => {
        return localStorage.getItem('locale') || 'en'
    })

    useEffect(() => {
        localStorage.setItem('locale', locale)
    }, [locale])

    return (
        <IntlProvider locale={locale} messages={messages[locale]}>
            <Router>
                <Toaster/>
                <Navbar setLocale={setLocale} locale={locale}/>
                <main className="container mx-auto p-6">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/students" element={<StudentsPage/>}/>
                        <Route path="/courses" element={<CoursesPage/>}/>
                    </Routes>
                </main>
            </Router>
        </IntlProvider>
    )
}

export default App
