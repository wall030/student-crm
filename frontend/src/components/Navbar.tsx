import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation();
  const isMainPage = location.pathname === '/'
  const isStudentsPage = location.pathname === '/students'
  const isCoursesPage = location.pathname === '/courses'

  return (
    <nav className="flex justify-between items-center p-5 bg-white shadow-lg">
      <h1 className="text-xl font-bold">
        <span className="text-primary">Student</span>
        <span className="text-appleBlue">CRM</span>
      </h1>
      <div className="flex space-x-4">
        <Link to="/students">
          <button
            className={`px-4 py-2 rounded ${isMainPage ? 'bg-transparent text-appleBlue hover:bg-slate-100' : isStudentsPage ? 'bg-appleBlue text-white' : 'bg-transparent text-appleBlue hover:bg-slate-100'}`}
          >
            Students
          </button>
        </Link>
        <Link to="/courses">
          <button
            className={`px-4 py-2 rounded ${isMainPage ? 'bg-transparent text-appleBlue hover:bg-slate-100' : isCoursesPage ? 'bg-appleBlue text-white' : 'bg-transparent text-appleBlue hover:bg-slate-100'}`}
          >
            Courses
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar
