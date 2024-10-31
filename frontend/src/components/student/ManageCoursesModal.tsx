import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {Course} from '../../types/Course'
import {Student} from '../../types/Student'
import {FormattedMessage} from 'react-intl'
import toast from "react-hot-toast"
import {Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material"


const ManageCoursesModal: React.FC<{
    allCourses: Course[]
    student: Student
    onUpdate: (student: Student) => void
    onClose: () => void
}> = ({allCourses, student, onUpdate, onClose}) => {
    const [courses, setCourses] = useState<Course[]>([])
    const [selectedCourses, setSelectedCourses] = useState<number[]>([])

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setCourses(allCourses)

                const enrolledCourses = student.courses.map(course => course.id)
                setSelectedCourses(enrolledCourses)
            } catch (error) {
                console.error('Error fetching courses:', error)
            }
        }

        fetchCourses()
    }, [allCourses])

    const handleCourseToggle = (courseId: number) => {
        setSelectedCourses((prevSelectedCourses) => {
            if (prevSelectedCourses.includes(courseId)) {
                return prevSelectedCourses.filter(id => id !== courseId)
            } else {
                return [...prevSelectedCourses, courseId]
            }
        })
    }

    const handleSubmit = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/api/student/${student.id}/assignCourses`,
                selectedCourses
            )
            student.courses = response.data
            onClose()
            onUpdate(student)
            toast.success(<FormattedMessage id="toast.success"/>)
        } catch (error) {
            console.error('Error updating courses:', error)
            onClose()
            const message = error.response.data.error
            toast.error(<FormattedMessage id="toast.error" values={{message}}/>)
        }
    }

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>
                <FormattedMessage id="actions.manage.courses.title" defaultMessage="Manage Courses for "/>
                {student.firstName} {student.lastName}
            </DialogTitle>
            <DialogContent>
                <Box sx={{maxHeight: 300, overflowY: 'auto'}}>
                    {courses.map((course) => (
                        <Box key={course.id} sx={{display: 'flex', alignItems: 'center', mb: 1, borderBottom: '1px solid #ccc'}}>
                            <Checkbox
                                checked={selectedCourses.includes(course.id)}
                                onChange={() => handleCourseToggle(course.id)}
                                color="primary"
                            />
                            <Typography variant="body1" sx={{px: 1}}>
                                {course.name}
                            </Typography>
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
