import { useState } from 'react'
import StudentsList from '../components/student/StudentsList'
import Searchbar from '../components/Searchbar'
import { useIntl } from 'react-intl'
import {Box} from "@mui/material"

const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const { formatMessage } = useIntl()

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }
  return (
    <Box sx={{ mt:4 }} role="students-page">
      <Searchbar onSearch={handleSearch} placeholder={formatMessage({id: "page.students.searchfield", defaultMessage: "Search by name or email..."})}/>
      <StudentsList searchTerm={searchTerm} />
    </Box>
  )
}

export default StudentsPage
