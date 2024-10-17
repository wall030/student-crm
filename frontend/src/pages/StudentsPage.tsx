import { useState } from 'react'
import StudentsList from '../components/StudentsList'
import Searchbar from '../components/Searchbar'

const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Students List</h1>
      <Searchbar onSearch={handleSearch}/>
      <StudentsList searchTerm={searchTerm} />
    </div>
  )
}

export default StudentsPage