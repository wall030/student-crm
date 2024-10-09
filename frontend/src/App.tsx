import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import StudentsView from './pages/StudentsPage'
import CoursesView from './pages/CoursesPage'
import './index.css'

const App = () => {
  return (
    <Router>
      <Navbar />
      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<StudentsView />} />
          <Route path="/courses" element={<CoursesView />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
