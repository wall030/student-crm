import { useState } from "react"
import Searchbar from "../components/Searchbar"
import CoursesList from "../components/CoursesList"

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Courses List</h1>
      <Searchbar onSearch={handleSearch} placeholder="Search by name..."/>
      <CoursesList searchTerm={searchTerm} />
    </div>
  )
}

export default CoursesPage
