"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';


const Navbar = () => {
    const pathname = usePathname();
    const isMainPage = pathname === '/';
    const isStudentsPage = pathname === '/students';
    const isCoursesPage = pathname === '/courses';

    return (
        <nav className="flex justify-between items-center p-5 bg-white shadow-lg">
            <h1 className="text-xl font-bold">
                <span className="text-primary">Student</span>
                <span className="text-appleBlue">CRM</span>
            </h1>
            <div className="flex space-x-4">
                <Link href="/students" passHref>
                    <button
                        className={`px-4 py-2 rounded ${isMainPage
                                ? 'bg-transparent text-appleBlue hover:bg-slate-100'
                                : isStudentsPage
                                    ? 'bg-appleBlue text-white'
                                    : 'bg-transparent text-appleBlue hover:bg-slate-100'
                            } ${isStudentsPage ? 'hover:bg-appleBlue' : ''}`}
                    >
                        Students
                    </button>
                </Link>
                <Link href="/courses" passHref>
                    <button
                        className={`px-4 py-2 rounded ${isMainPage
                                ? 'bg-transparent text-appleBlue hover:bg-slate-100'
                                : isCoursesPage
                                    ? 'bg-appleBlue text-white'
                                    : 'bg-transparent text-appleBlue hover:bg-slate-100'
                            } ${isCoursesPage ? 'hover:bg-appleBlue' : ''}`}
                    >
                        Courses
                    </button>
                </Link>
            </div>
        </nav>
    )
}

export default Navbar