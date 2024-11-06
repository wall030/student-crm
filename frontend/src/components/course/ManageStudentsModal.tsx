import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {Course} from '../../types/Course'
import {Student} from '../../types/Student'
import {FormattedMessage} from 'react-intl'
import toast from "react-hot-toast";
import {Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, ListItemText} from "@mui/material"
import {handleError} from "../../error/handleError.tsx";


const ManageStudentsModal: React.FC<{
    open: Boolean
    course: Course
    onUpdate: (course: Course) => void
    onClose: () => void
}
> = ({open, course, onUpdate, onClose}) => {
    const [students, setStudents] = useState<Student[]>([])
    const [selectedStudents, setSelectedStudents] = useState<number[]>([])


    useEffect(() => {
        if(open) {fetchStudents()}
    }, [course])

    const fetchStudents = async () => {
        try {
            const studentsResponse = await axios.get<Student[]>('http://localhost:8080/api/student/all')
            setStudents(studentsResponse.data)
            const enrolledStudents = course.students.map(student => student.id)
            setSelectedStudents(enrolledStudents)
        } catch (error) {
            const errorCode = error.response.data.errorCode
            handleError(errorCode)
        }
    }

    const handleStudentToggle = (studentId: number) => {
        setSelectedStudents((prevSelectedStudents) =>
            prevSelectedStudents.includes(studentId)
                ? prevSelectedStudents.filter((id) => id !== studentId)
                : [...prevSelectedStudents, studentId]
        )
    }

    const handleSubmit = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/api/course/${course.id}/assignStudents`, selectedStudents)
            const updatedCourse = {...course, students: response.data}
            onUpdate(updatedCourse)
            toast.success(<FormattedMessage id="toast.success"/>)
        } catch (error) {
            onClose()
            const errorCode = error.response.data.errorCode
            handleError(errorCode)
        } finally {
            onClose()
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <FormattedMessage id="actions.manage.students.title" defaultMessage="Manage Students for "/>
                {course.name}
            </DialogTitle>
            <DialogContent>
                <Box sx={{maxHeight: 300, overflow: 'auto'}}>
                    {students.map((student) => (
                        <Box key={student.id} sx={{display: 'flex', alignItems: 'center', mb: 1, borderBottom: '1px solid #ccc'}}>
                            <Checkbox
                                checked={selectedStudents.includes(student.id)}
                                onChange={() => handleStudentToggle(student.id)}
                            />
                            <ListItemText primary={`${student.firstName} ${student.lastName}`}/>
                        </Box>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    <FormattedMessage id="buttons.save" defaultMessage="Save"/>
                </Button>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    <FormattedMessage id="buttons.cancel" defaultMessage="Cancel"/>
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ManageStudentsModal
