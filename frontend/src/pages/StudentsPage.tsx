import { useState } from 'react'
import StudentsList from '../components/student/StudentsList'
import Searchbar from '../components/Searchbar'
import { FormattedMessage, useIntl } from 'react-intl'

const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const { formatMessage } = useIntl()

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        <FormattedMessage id="page.students.title" defaultMessage="Language" />
      </h1>
      <Searchbar onSearch={handleSearch} placeholder={formatMessage({id: "page.students.searchfield", defaultMessage: "Search by name or email..."})}/>
      <StudentsList searchTerm={searchTerm} />
    </div>
  )
}

export default StudentsPage