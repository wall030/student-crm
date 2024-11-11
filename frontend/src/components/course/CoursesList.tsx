import React, {useEffect, useRef, useState} from "react"
import CourseCard from "./CourseCard"
import {Course} from "../../types/Course"
import axios from "axios"
import Actions from "../Actions"
import CreateCourseModal from "./CreateCourseModal"
import EditCourseModal from "./EditCourseModal"
import ManageStudentsModal from "./ManageStudentsModal"
import {Student} from "../../types/Student"
import {FormattedMessage} from "react-intl"
import toast from "react-hot-toast"
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Typography
} from "@mui/material"
import {handleError} from "../../error/handleError"

const CoursesList: React.FC<{ searchTerm: string }> = ({searchTerm}) => {
    const [courses, setCourses] = useState<Course[]>([])
    const [page, setPage] = useState(0)
    const [isCreateModalOpen, setCreateModalOpen] = useState(false)
    const [selectedCourses, setSelectedCourses] = useState<number[]>([])
    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [isManageStudentsModalOpen, setManageStudentsModalOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState<Course>(null)
    const [students, setStudents] = useState<Student[]>([])
    const [sortField, setSortField] = useState("name")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
    const [count, setCount] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState<10 | 25 | 100>(10)

    useEffect(() => {
        setPage(0)
        setCourses([])
        fetchCount()
        fetchCourses()
    }, [searchTerm])

    useEffect(() => {
        fetchCourses()
    }, [searchTerm, page, sortField, sortOrder, rowsPerPage])

    const fetchCount = async () => {
        axios.get<number>(`http://localhost:8080/api/course/count`, {
            params: {
                search: searchTerm,
            },
        }).then(function (response) {
            const data = response.data
            setCount(data)
        }).catch(function (error) {
            let errorCode
            if (error.response) errorCode = error.response.data.errorCode
            handleError(errorCode)
        })
    }

    const fetchCourses = async () => {
        axios.get<Course[]>(`http://localhost:8080/api/course`, {
            params: {
                page,
                rowsPerPage,
                search: searchTerm,
                sortField,
                sortOrder,
            },
        }).then(function
        (response) {
            const data = response.data
            setCourses(data)
        }).catch(function (error) {
            let errorCode
            if (error.response) errorCode = error.response.data.errorCode
            handleError(errorCode)
        })
    }

    const handleSortChange = (field: string) => {
        if (field === sortField) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortOrder("asc")
        }
    }

    const handleSelectCourse = (id: number) => {
        setSelectedCourses((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((courseId) => courseId !== id) : [...prevSelected, id]
        )
    }

    const handleDelete = async () => {
        axios.delete(`http://localhost:8080/api/course/delete`, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: selectedCourses,
        }).then(() => {
            setCourses((prevCourses) => prevCourses.filter((course) => !selectedCourses.includes(course.id)))
            setSelectedCourses([])
            toast.success(<FormattedMessage id="toast.success"/>)
        }).catch(function (error) {
            setSelectedCourses([])
            let errorCode
            if (error.response) errorCode = error.response.data.errorCode
            handleError(errorCode)
        })
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

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10)
        if ([10, 25, 100].includes(newRowsPerPage)) {
            setRowsPerPage(newRowsPerPage as 10 | 25 | 100)
        }
        setPage(0)
    }

    const isEditDisabled = selectedCourses.length !== 1

    return (
        <Box sx={{mt: 2}}>
            <Box sx={{mb: 2}}>
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
                    course={selectedCourse}
                    onUpdate={handleManageStudents}
                    onClose={() => {
                        setManageStudentsModalOpen(false)
                        setSelectedCourse(null)
                        setSelectedCourses([])
                    }}
                />
            )}

            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: "70vh",
                    overflow: "auto"
                }}
            >
                <Table
                    stickyHeader
                    sx={{
                        tableLayout: "fixed",
                        width: "100%"
                    }}
                    size="small"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align="left"
                                sx={{backgroundColor: "grey.300"}}
                            >
                                <TableSortLabel
                                    active={sortField === "name"}
                                    direction={sortOrder}
                                    onClick={() => handleSortChange("name")}
                                >
                                    <FormattedMessage id="page.courses.tableColumn.name" defaultMessage="Name"/>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell
                                align="left"
                                sx={{backgroundColor: "grey.300"}}
                            >
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
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    )
}

export default CoursesList
