import { useEffect, useState } from "react"
import CourseCard from "./CourseCard"
import NavigationButtons from "../NavigationButtons"
import { Course } from "../../types/Course"
import axios from "axios"
import Actions from "../Actions"
import CreateCourseModal from "./CreateCourseModal"


const CoursesList: React.FC<{ searchTerm: string }> = ({ searchTerm }) => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [selectedCourses, setSelectedCourses] = useState<number[]>([])
  const [newCourse, setNewCourse] = useState({ name: '' })
  const limit = 10

  useEffect(() => {
    setPage(1)
    setCourses([])
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

  const handleSelectCourse = (id: number) => {
    setSelectedCourses((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((courseId) => courseId !== id) : [...prevSelected, id]
    )
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/course/delete`, { data: selectedCourses })
      setCourses((prevCourses) => prevCourses.filter((course) => !selectedCourses.includes(course.id)))
      setSelectedCourses([])
    } catch (error) {
      console.error('Error deleting courses:', error)
    }
  }

  const handleCreateCourse = async () => {
    try {
      const response = await axios.post<Course>(`http://localhost:8080/api/course/create`, newCourse)
      const createdCourse = response.data
      setCourses((prevCourses) => [createdCourse, ...prevCourses])
      setCreateModalOpen(false)
      setNewCourse({ name: '' })
    } catch (error) {
      console.error('Error creating student:', error)
    }
  }

  const handleOpenEditModal = () => {
    throw new Error("Function not implemented.")
  }

  const handleOpenManageStudentsModal = () => {
    throw new Error("Function not implemented.")
  }

  const isEditDisabled = selectedCourses.length !== 1

  if (loading && courses.length === 0) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

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
        <Actions
          manageButtonTitle={"Manage Students"}
          isEditDisabled={isEditDisabled}
          selected={selectedCourses}
          onDelete={handleDelete}
          onOpenCreateModal={() => setCreateModalOpen(true)}
          onOpenEditModal={handleOpenEditModal}
          onOpenManageModal={handleOpenManageStudentsModal}
        />
      </div>

      {isCreateModalOpen && (
        <CreateCourseModal
          newCourse={newCourse}
          setNewCourse={setNewCourse}
          onCreate={handleCreateCourse}
          onClose={() => {
            setCreateModalOpen(false)
            setNewCourse({ name: '' })
          }}
        />
      )}

      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Students</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => {
            const isSelected = selectedCourses.includes(course.id)
            return (
              <CourseCard
                key={course.id}
                course={course}
                isSelected={isSelected}
                onSelect={() => handleSelectCourse(course.id)}
              />)
          })}
        </tbody>
      </table>
      {loading && <p>Loading more courses...</p>}
    </div>
  )
}


export default CoursesList