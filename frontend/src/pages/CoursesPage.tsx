import {useState} from "react"
import Searchbar from "../components/Searchbar"
import CoursesList from "../components/course/CoursesList"
import {FormattedMessage, useIntl} from "react-intl"
import {Box} from "@mui/material"

const CoursesPage = () => {
    const [searchTerm, setSearchTerm] = useState<string>('')
    const {formatMessage} = useIntl()

    const handleSearch = (term: string) => {
        setSearchTerm(term)
    }
    return (
        <Box sx={{mt: 4}}  role="courses-page">
            <Searchbar onSearch={handleSearch}
                       placeholder={formatMessage({id: "page.courses.searchfield", defaultMessage: "Search by name..."})}/>
            <CoursesList searchTerm={searchTerm}/>
        </Box>
    )
}

export default CoursesPage
