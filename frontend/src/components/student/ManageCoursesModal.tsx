import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {Course} from '../../types/Course'
import {Student} from '../../types/Student'
import {FormattedMessage} from 'react-intl'
import toast from 'react-hot-toast'
import {Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Typography} from '@mui/material'
import {handleError} from "../../error/handleError"

const ManageCoursesModal: React.FC<{
    open: boolean
    student: Student
    onUpdate: (student: Student) => void
    onClose: () => void
}> = ({open, student, onUpdate, onClose}) => {
    const [courses, setCourses] = useState<Course[]>([])
    const [selectedCourses, setSelectedCourses] = useState<number[]>([])

    useEffect(() => {
        if (open) fetchCourses()
    }, [student])

    const fetchCourses = async () => {
        axios.get<Course[]>('http://localhost:8080/api/course/all')
            .then(function (response) {
                setCourses(response.data)
                const enrolledCourses = student.courses.map((course) => course.id)
                setSelectedCourses(enrolledCourses)
            }).catch(function (error) {
            const errorCode = error.response.data.errorCode
            handleError(errorCode)
        })
    }

    const handleCourseToggle = (courseId: number) => {
        setSelectedCourses((prevSelectedCourses) =>
            prevSelectedCourses.includes(courseId)
                ? prevSelectedCourses.filter((id) => id !== courseId)
                : [...prevSelectedCourses, courseId]
        )
    }

    const handleSubmit = async () => {
        axios.put<Course[]>(`http://localhost:8080/api/student/${student.id}/assignCourses`, selectedCourses)
            .then(function (response) {
                const updatedStudent = {...student, courses: response.data}
                onUpdate(updatedStudent)
                toast.success(<FormattedMessage id="toast.success"/>)
            }).catch(function (error) {
            const errorCode = error.response.data.errorCode
            handleError(errorCode)
            onClose()
        })
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <FormattedMessage id="actions.manage.courses.title" defaultMessage="Manage Courses for "/>
                <span>{student.firstName} {student.lastName}</span>
            </DialogTitle>
            <DialogContent>
                <Box sx={{maxHeight: 300, overflowY: 'auto'}}>
                    {courses.map((course) => (
                        <Box key={course.id} sx={{display: 'flex', alignItems: 'center', mb: 1, borderBottom: '1px solid #ccc'}}>
                            <FormControlLabel
                                control={<Checkbox
                                    checked={selectedCourses.includes(course.id)}
                                    onChange={() => handleCourseToggle(course.id)}
                                    color="primary"/>}
                                label={<Typography variant="body1" sx={{px: 1}}>{course.name}</Typography>}
                            />
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

export default ManageCoursesModal
