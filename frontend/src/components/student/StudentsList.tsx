import React, {useEffect, useState} from 'react'
import axios from 'axios'
import StudentCard from './StudentCard'
import {Student} from '../../types/Student'
import CreateStudentModal from './CreateStudentModal'
import EditStudentModal from './EditStudentModal'
import ManageCoursesModal from './ManageCoursesModal'
import NavigationButtons from '../NavigationButtons'
import Actions from '../Actions'
import {FormattedMessage} from 'react-intl'
import toast, {Toaster} from 'react-hot-toast'
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography} from "@mui/material"

const StudentsList: React.FC<{ searchTerm: string }> = ({searchTerm}) => {
    const [students, setStudents] = useState<Student[]>([])
    const [error, setError] = useState<string>(null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [selectedStudents, setSelectedStudents] = useState<number[]>([])
    const [isCreateModalOpen, setCreateModalOpen] = useState(false)
    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [isManageCoursesModalOpen, setManageCoursesModalOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student>(null)
    const limit = 18
    const [sortField, setSortField] = useState("lastname")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")


    useEffect(() => {
        setPage(1)
        setStudents([])
        setSelectedStudents([])
        fetchStudents()
    }, [searchTerm])

    useEffect(() => {
        fetchStudents()
    }, [page, sortField, sortOrder])

    const fetchStudents = async () => {
        setError(null)

        try {
            const response = await axios.get<Student[]>(`http://localhost:8080/api/student`, {
                params: {
                    page,
                    limit,
                    search: searchTerm,
                    sortField,
                    sortOrder,
                },
            })
            const data = response.data
            data.length === limit ? setHasMore(true) : setHasMore(false)
            setStudents(data)
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error')
        }
    }

    const handleSortChange = (field: string) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortOrder('asc')
        }
    }
    const handleSelectStudent = (id: number) => {
        setSelectedStudents((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((studentId) => studentId !== id) : [...prevSelected, id]
        )
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/student/delete`, {data: selectedStudents})
            setStudents((prevStudents) => prevStudents.filter((student) => !selectedStudents.includes(student.id)))
            setSelectedStudents([])
            toast.success(<FormattedMessage id="toast.success"/>)
        } catch (error) {
            console.error('Error deleting students:', error)
            setSelectedStudents([])
            const message = error.response.data.error
            toast.error(<FormattedMessage id="toast.error" values={{message}}/>)
        }
    }

    const handleOpenEditModal = () => {
        if (selectedStudents.length === 1) {
            const studentToEdit = students.find((student) => student.id === selectedStudents[0])
            if (studentToEdit) {
                setSelectedStudent(studentToEdit)
                setEditModalOpen(true)
            }
        }
    }

    const handleManageCourses = (updatedStudent: Student) => {
        setStudents((prevStudents) =>
            prevStudents.map((student) => (student.id === updatedStudent.id ? updatedStudent : student))
        )
        setManageCoursesModalOpen(false)
        setSelectedStudents([])
    }

    const handleOpenManageCoursesModal = () => {
        if (selectedStudents.length === 1) {
            const student = students.find((student) => student.id === selectedStudents[0])
            if (student) {
                setSelectedStudent(student)
                setManageCoursesModalOpen(true)
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

    const isEditDisabled = selectedStudents.length !== 1

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <NavigationButtons onPrev={handlePreviousPage} onNext={handleNextPage} />
                <Actions
                    manageButtonTitle="Manage Courses"
                    isEditDisabled={isEditDisabled}
                    selected={selectedStudents}
                    onDelete={handleDelete}
                    onOpenCreateModal={() => setCreateModalOpen(true)}
                    onOpenEditModal={handleOpenEditModal}
                    onOpenManageModal={handleOpenManageCoursesModal}
                />
            </Box>

            <CreateStudentModal
                open={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                setStudents={setStudents}
            />

            {selectedStudent && (
                <EditStudentModal
                    open={isEditModalOpen}
                    student={selectedStudent}
                    setStudents={setStudents}
                    onClose={() => {
                        setEditModalOpen(false)
                        setSelectedStudents([])
                    }}
                />
            )}

            {selectedStudent && (
                <ManageCoursesModal
                    open={isManageCoursesModalOpen}
                    student={selectedStudent}
                    onUpdate={handleManageCourses}
                    onClose={() => {
                        setManageCoursesModalOpen(false)
                        setSelectedStudents([])
                    }}
                />
            )}

            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: "70vh",
                    overflow: 'auto',
                }}
            >
                <Table stickyHeader sx={{ tableLayout: "fixed", width: "100%" }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align="left"
                                sx={{ backgroundColor: "grey.300" }}
                            >
                                <TableSortLabel
                                    active={sortField === "lastname"}
                                    direction={sortOrder}
                                    onClick={() => handleSortChange("lastname")}
                                >
                                    <FormattedMessage id="page.students.tableColumn.name" defaultMessage="Name" />
                                </TableSortLabel>
                            </TableCell>
                            <TableCell
                                align="left"
                                sx={{ backgroundColor: "grey.300" }}
                            >
                                <TableSortLabel
                                    active={sortField === "email"}
                                    direction={sortOrder}
                                    onClick={() => handleSortChange("email")}
                                >
                                    <FormattedMessage id="page.students.tableColumn.email" defaultMessage="E-Mail" />
                                </TableSortLabel>
                            </TableCell>
                            <TableCell
                                align="left"
                                sx={{ backgroundColor: "grey.300" }}
                            >
                                <FormattedMessage id="page.students.tableColumn.courses" defaultMessage="Courses" />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map((student) => {
                            const isSelected = selectedStudents.includes(student.id)
                            return (
                                <StudentCard
                                    key={student.id}
                                    student={student}
                                    isSelected={isSelected}
                                    onSelect={() => handleSelectStudent(student.id)}
                                />
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            {error && (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%" sx={{ mt: 4 }}>
                    <Typography variant="body1" color="error" align="center">
                        Error: {error}
                    </Typography>
                </Box>
            )}
        </Box>
    )
}

export default StudentsList
