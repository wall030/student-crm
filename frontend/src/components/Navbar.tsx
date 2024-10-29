import {Link, useLocation} from 'react-router-dom'
import {FormattedMessage} from 'react-intl'
import {GlobeAltIcon} from '@heroicons/react/24/outline'
import {useState} from 'react'

const Navbar: React.FC<{
    setLocale: (locale: string) => void
    locale: string
}> = ({setLocale, locale}) => {
    const location = useLocation()
    const isMainPage = location.pathname === '/'
    const isStudentsPage = location.pathname === '/students'
    const isCoursesPage = location.pathname === '/courses'

    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)

    const handleChangeLanguage = (locale: string) => {
        setLocale(locale)
        setShowLanguageDropdown(false)
    }

    return (
        <nav className="flex justify-between items-center p-5 bg-white shadow-lg relative">
            <Link to="/">
                <h1 className="text-xl font-bold">
                    <span className="text-primary">Student</span>
                    <span className="text-blue-500">CRM</span>
                </h1>
            </Link>
            <div className="flex items-center space-x-4">
                <Link to="/students">
                    <button
                        className={`px-4 py-2 rounded ${
                            isMainPage
                                ? 'bg-transparent text-blue-500 hover:bg-slate-100'
                                : isStudentsPage
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-transparent text-blue-500 hover:bg-slate-100'
                        }`}
                    >
                        <FormattedMessage id="navbar.students" defaultMessage="Students"/>
                    </button>
                </Link>

                <Link to="/courses">
                    <button
                        className={`px-4 py-2 rounded ${
                            isMainPage
                                ? 'bg-transparent text-blue-500 hover:bg-slate-100'
                                : isCoursesPage
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-transparent text-blue-500 hover:bg-slate-100'
                        }`}
                    >
                        <FormattedMessage id="navbar.courses" defaultMessage="Courses"/>
                    </button>
                </Link>

                <div className="relative">
                    <button
                        className="text-2xl"
                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    >
                        <GlobeAltIcon className="text-blue-500 h-5 w-5 hover:text-blue-400 mt-2"/>
                    </button>

                    {showLanguageDropdown && (
                        <div className="absolute right-0 mt-7 w-36 bg-white shadow-lg rounded-lg z-10">
                            <ul>
                                <li
                                    className={"px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-t-lg"}
                                    onClick={() => handleChangeLanguage('en')}
                                >
                                    <FormattedMessage id="language.en" defaultMessage="English"/>
                                </li>
                                <li
                                    className={"px-4 py-2 cursor-pointer hover:bg-gray-100 rounded-b-lg"}
                                    onClick={() => handleChangeLanguage('de')}
                                >
                                    <FormattedMessage id="language.de" defaultMessage="German"/>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
