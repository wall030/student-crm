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
import toast from "react-hot-toast"
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material"


const CoursesList: React.FC<{ searchTerm: string }> = ({searchTerm}) => {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>(null)
    const [page, setPage] = useState(1)
    const [isCreateModalOpen, setCreateModalOpen] = useState(false)
    const [hasMore, setHasMore] = useState(true)
    const [selectedCourses, setSelectedCourses] = useState<number[]>([])
    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [editableCourse, setEditableCourse] = useState<CourseUpdated>({id: 0, name: ''})
    const [isManageStudentsModalOpen, setManageStudentsModalOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState<Course>(null)
    const [students, setStudents] = useState<Student[]>([])
    const limit = 18

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

    const handleOpenEditModal = () => {
        if (selectedCourses.length === 1) {
            const courseToEdit = courses.find((course) => course.id === selectedCourses[0])
            if (courseToEdit) {
                setSelectedCourse(courseToEdit)
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
                setSelectedCourse(course)
                setManageStudentsModalOpen(true)
            }
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

    const isEditDisabled = selectedCourses.length !== 1

    return (
        <Box sx={{mt: 2}}>
            <Box sx={{display: "flex", justifyContent: "space-between", mb: 2}}>
                <NavigationButtons onPrev={handlePreviousPage} onNext={handleNextPage}/>
                <Actions
                    manageButtonTitle={"Manage Students"}
                    isEditDisabled={isEditDisabled}
                    selected={selectedCourses}
                    onDelete={handleDelete}
                    onOpenCreateModal={() => setCreateModalOpen(true)}
                    onOpenEditModal={handleOpenEditModal}
                    onOpenManageModal={handleOpenManageStudentsModal}
                />
            </Box>

            <CreateCourseModal
                open={isCreateModalOpen}
                setCourses={setCourses}
                onClose={() => setCreateModalOpen(false)}
            />

            {selectedCourse && (
                <EditCourseModal
                    open={isEditModalOpen}
                    course={selectedCourse}
                    setCourses={setCourses}
                    onClose={() => {
                        setEditModalOpen(false)
                        setSelectedCourses([])
                    }}
                />
            )}

            {selectedCourse && (
                <ManageStudentsModal
                    open={isManageStudentsModalOpen}
                    allStudents={students}
                    course={selectedCourse}
                    onUpdate={handleManageStudents}
                    onClose={() => {
                        setManageStudentsModalOpen(false)
                        setSelectedCourse(null)
                        setSelectedCourses([])
                    }}
                />
            )}

            <TableContainer component={Paper}>
                <Table sx={{tableLayout: "fixed", width: "100%"}}
                       size="small"
                >
                    <TableHead>
                        <TableRow sx={{backgroundColor: "grey.200"}}>
                            <TableCell align="left">
                                <FormattedMessage id="page.courses.tableColumn.name" defaultMessage="Name"/>
                            </TableCell>
                            <TableCell align="left">
                                <FormattedMessage id="page.courses.tableColumn.students" defaultMessage="Students"/>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courses.map((course) => {
                            const isSelected = selectedCourses.includes(course.id)
                            return (
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    isSelected={isSelected}
                                    onSelect={() => handleSelectCourse(course.id)}
                                />
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            {error && (
                <Typography variant="body1" color="error" align="center" sx={{mt: 2}}>
                    {error}
                </Typography>
            )}
        </Box>
    )
}

export default CoursesList
