import { useState } from "react"
import Searchbar from "../components/Searchbar"
import CoursesList from "../components/course/CoursesList"
import { FormattedMessage, useIntl } from "react-intl"

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const { formatMessage } = useIntl()

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
      <FormattedMessage id="page.courses.title" defaultMessage="Courses List" />
      </h1>
      <Searchbar onSearch={handleSearch} placeholder={formatMessage({id: "page.courses.searchfield", defaultMessage: "Search by name..."})}/>
      <CoursesList searchTerm={searchTerm} />
    </div>
  )
}

export default CoursesPage
