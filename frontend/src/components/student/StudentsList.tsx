import React, {useEffect, useState} from 'react'
import axios from 'axios'
import StudentCard from './StudentCard'
import {Student} from '../../types/Student'
import CreateStudentModal from './CreateStudentModal'
import EditStudentModal from './EditStudentModal'
import ManageCoursesModal from './ManageCoursesModal'
import Actions from '../Actions'
import {FormattedMessage} from 'react-intl'
import toast from 'react-hot-toast'
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
    TableSortLabel
} from "@mui/material"
import {handleError} from "../../error/handleError"

const StudentsList: React.FC<{ searchTerm: string }> = ({searchTerm}) => {
    const [students, setStudents] = useState<Student[]>([])
    const [page, setPage] = useState(0)
    const [selectedStudents, setSelectedStudents] = useState<number[]>([])
    const [isCreateModalOpen, setCreateModalOpen] = useState(false)
    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [isManageCoursesModalOpen, setManageCoursesModalOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student>()
    const [sortField, setSortField] = useState("lastName")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
    const [count, setCount] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState<10 | 25 | 100>(10)

    useEffect(() => {
        setPage(0)
        setStudents([])
        setSelectedStudents([])
        fetchCount()
    }, [searchTerm])

    useEffect(() => {
        fetchStudents()
    }, [page, rowsPerPage, sortField, sortOrder, searchTerm])

    const fetchCount = async () => {
        axios.get<number>(`http://localhost:8080/api/student/count`, {
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

    const fetchStudents = async () => {
        axios.get<Student[]>(`http://localhost:8080/api/student`, {
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
            setStudents(data)
        }).catch(function (error) {
            let errorCode
            if (error.response) errorCode = error.response.data.errorCode
            handleError(errorCode)
        })
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
            await axios.request({
                method: 'delete',
                url: 'http://localhost:8080/api/student/delete',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: selectedStudents,
            })
            setStudents((prevStudents) =>
                prevStudents.filter((student) => !selectedStudents.includes(student.id))
            )
            setSelectedStudents([])
            toast.success(<FormattedMessage id="toast.success"/>)
        } catch (error: any) {
            setSelectedStudents([])
            let errorCode
            if (error.response) errorCode = error.response.data.errorCode
            handleError(errorCode)
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

    // @ts-ignore
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

    const isEditDisabled = selectedStudents.length !== 1

    return (
        <Box sx={{mt: 2}}>
            <Box sx={{mb: 2}}>
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
                                    active={sortField === "lastName"}
                                    direction={sortOrder}
                                    onClick={() => handleSortChange("lastName")}
                                >
                                    <FormattedMessage id="page.students.tableColumn.name" defaultMessage="Name"/>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell
                                align="left"
                                sx={{backgroundColor: "grey.300"}}
                            >
                                <TableSortLabel
                                    active={sortField === "email"}
                                    direction={sortOrder}
                                    onClick={() => handleSortChange("email")}
                                >
                                    <FormattedMessage id="page.students.tableColumn.email" defaultMessage="E-Mail"/>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell
                                align="left"
                                sx={{backgroundColor: "grey.300"}}
                            >
                                <FormattedMessage id="page.students.tableColumn.courses" defaultMessage="Courses"/>
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

export default StudentsList
