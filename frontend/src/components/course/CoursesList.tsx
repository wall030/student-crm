import { useEffect, useState } from "react"
import CourseCard from "./CourseCard"
import NavigationButtons from "../NavigationButtons"
import { Course } from "../../types/Course"
import { Student } from "../../types/Student"
import axios from "axios"


const CoursesList: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [selectedCourses, setSelectedCourses] = useState<number[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const limit = 10


    useEffect(() => {
        setPage(1)
        setStudents([])
        fetchCourses()
      }, [searchTerm])
    
      useEffect(() => {
        fetchCourses()
      }, [page])

    const fetchCourses = async () => {
        if (loading) return
        setLoading(true)
        setError(null)
    
        try {
          const response = await axios.get<Course[]>(`http://localhost:8080/api/course`, {
            params: {
              page,
              limit: limit,
              search: searchTerm,
            },
          })
          const data = response.data
          data.length === limit ? setHasMore(true) : setHasMore(false)
          setCourses(data)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Unknown error')
        } finally {
          setLoading(false)
        }
      }

    const handlePreviousPage = () => {
        if (page != 1) {
            setPage(page - 1)
        }
    }

    const handleNextPage = () => {
        if (hasMore) {
            setPage(page + 1)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <NavigationButtons
                    onPrev={handlePreviousPage}
                    onNext={handleNextPage}
                />

            </div>

            <div className="flex bg-gray-200 p-2 rounded-md font-bold">
                <div className="w-1/2">Name</div>
                <div className="w-1/2">Students</div>
            </div>

            <div>
                {courses.map((course) => {
                    return (
                        <div key={course.id}>
                            <CourseCard course={course} />
                        </div>
                    )
                })}
            </div>
            {loading && <p>Loading more courses...</p>}
        </div>
    )
}


export default CoursesList