import { useState } from "react"
import CourseCard from "./CourseCard"
import NavigationButtons from "./NavigationButtons"
import { Course } from "../types/Course"
import { Student } from "../types/Student"


const CoursesList: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [selectedCourses, setSelectedCourses] = useState<number[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const limit = 10





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
                <div className="w-1/3">Name</div>
                <div className="w-1/3">Students</div>
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
            {loading && <p>Loading more students...</p>}
        </div>
    )
}


export default CoursesList