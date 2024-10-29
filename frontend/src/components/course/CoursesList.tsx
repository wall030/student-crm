import React, {useEffect, useState} from "react"
import CourseCard from "./CourseCard"
import NavigationButtons from "../NavigationButtons"
import {Course} from "../../types/Course"
import axios from "axios"
import Actions from "../Actions"
import CreateCourseModal from "./CreateCourseModal"
import {CourseUpdated} from "../../types/CourseUpdated"
import EditCourseModal from "./EditCourseModal"
import ManageStudentsModal from "./ManageStudentsModal"
import {Student} from "../../types/Student"
import {FormattedMessage} from "react-intl"
import toast from "react-hot-toast";


const CoursesList: React.FC<{ searchTerm: string }> = ({searchTerm}) => {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [isCreateModalOpen, setCreateModalOpen] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [selectedCourses, setSelectedCourses] = useState<number[]>([])
    const [newCourse, setNewCourse] = useState({name: ''})
    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [editableCourse, setEditableCourse] = useState<CourseUpdated>({id: 0, name: ''})
    const [isManageStudentsModalOpen, setManageStudentsModalOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
    const [students, setStudents] = useState<Student[]>([])
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

    const fetchStudents = async () => {
        try {
            const studentsResponse = await axios.get<Student[]>('http://localhost:8080/api/student/all')
            setStudents(studentsResponse.data)
        } catch (error) {
            console.error('Error fetching students:', error)
        }
    }

    const handleSelectCourse = (id: number) => {
        setSelectedCourses((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((courseId) => courseId !== id) : [...prevSelected, id]
        )
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/course/delete`, {data: selectedCourses})
            setCourses((prevCourses) => prevCourses.filter((course) => !selectedCourses.includes(course.id)))
            setSelectedCourses([])
            toast.success(<FormattedMessage id="toast.success"/>)
        } catch (error) {
            console.error('Error deleting courses:', error)
            setSelectedCourses([])
            const message = error.response.data.error
            toast.error(<FormattedMessage id="toast.error" values={{message}}/>)
        }
    }

    const handleCreateCourse = async () => {
        try {
            const response = await axios.post<Course>(`http://localhost:8080/api/course/create`, newCourse)
            const createdCourse = response.data
            setCourses((prevCourses) => [createdCourse, ...prevCourses])
            setCreateModalOpen(false)
            setNewCourse({name: ''})
            toast.success(<FormattedMessage id="toast.success"/>)
        } catch (error) {
            console.error('Error creating student:', error)
            setCreateModalOpen(false)
            setNewCourse({name: ''})
            const message = error.response.data.error
            toast.error(<FormattedMessage id="toast.error" values={{message}}/>)
        }
    }

    const handleCourseUpdated = async (updatedCourse: CourseUpdated) => {
        try {
            await axios.put(`http://localhost:8080/api/course/${updatedCourse.id}/update`, updatedCourse
            )
            setEditModalOpen(false)
            setCourses((prevCourses) =>
                prevCourses.map((course) => (course.id === updatedCourse
                    .id ? {
                    ...course, ...updatedCourse
                } : course))
            )
            setSelectedCourses([])
            toast.success(<FormattedMessage id="toast.success"/>)
        } catch (error) {
            console.error('Error updating course:', error)
            setEditModalOpen(false)
            setSelectedCourses([])
            const message = error.response.data.error
            toast.error(<FormattedMessage id="toast.error" values={{message}}/>)
        }
    }

    const handleOpenEditModal = () => {
        if (selectedCourses.length === 1) {
            const courseToEdit = courses.find((course) => course.id === selectedCourses[0])
            if (courseToEdit

            ) {
                setEditableCourse(courseToEdit)
                setEditModalOpen(true)
            }
        }
    }

    const handleManageStudents = (courseWithNewStudents: Course) => {
        setCourses((prevCourses) =>
            prevCourses.map((course) => (course.id === courseWithNewStudents.id ? {...course, ...courseWithNewStudents} : course))
        )
        setManageStudentsModalOpen(false)
        setSelectedCourses([])

    }

    const handleOpenManageStudentsModal = () => {
        if (selectedCourses.length === 1) {
            const course = courses.find((course) => course.id === selectedCourses[0])
            if (course) {
                fetchStudents()
                setSelectedCourse(course)
                setManageStudentsModalOpen(true)
            }
        }
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
                        setNewCourse({name: ''})
                    }}
                />
            )}

            {isEditModalOpen && (
                <EditCourseModal
                    course={editableCourse}
                    setCourse={setEditableCourse}
                    onUpdate={() => handleCourseUpdated(editableCourse)}
                    onClose={() => setEditModalOpen(false)}
                />
            )}

            {isManageStudentsModalOpen && selectedCourse && (
                <ManageStudentsModal
                    allStudents={students}
                    course={selectedCourse}
                    onUpdate={() => handleManageStudents(selectedCourse)}
                    onClose={() => {
                        setManageStudentsModalOpen(false)
                        setSelectedCourses([])
                    }}
                />
            )}

            <table className="table-auto w-full border-collapse">
                <thead>
                <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left"><FormattedMessage id="page.courses.tableColumn.name" defaultMessage="Name"/></th>
                    <th className="px-4 py-2 text-left"><FormattedMessage id="page.courses.tableColumn.students" defaultMessage="Students"/>
                    </th>
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
