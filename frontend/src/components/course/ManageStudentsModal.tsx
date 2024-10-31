import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {Course} from '../../types/Course'
import {Student} from '../../types/Student'
import {FormattedMessage} from 'react-intl'
import toast from "react-hot-toast";
import {Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, ListItemText} from "@mui/material";


const ManageStudentsModal: React.FC<{
    allStudents: Student[]
    course: Course
    onUpdate: (course: Course) => void
    onClose: () => void
}
> = ({allStudents, course, onUpdate, onClose}) => {
    const [students, setStudents] = useState<Student[]>([])
    const [selectedStudents, setSelectedStudents] = useState<number[]>([])

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setStudents(allStudents)

                const enrolledStudents = course.students.map(student => student.id)
                setSelectedStudents(enrolledStudents)
            } catch (error) {
                console.error('Error fetching students:', error)
            }
        }

        fetchStudents()
    }, [allStudents])

    const handleStudentToggle = (studentId: number) => {
        setSelectedStudents((prevSelectedStudents) => {
            if (prevSelectedStudents.includes(studentId)) {
                return prevSelectedStudents.filter(id => id !== studentId)
            } else {
                return [...prevSelectedStudents, studentId]
            }
        })
    }

    const handleSubmit = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/api/course/${course.id}/assignStudents`,
                selectedStudents
            )
            course.students = response.data
            onClose()
            onUpdate(course)
            toast.success(<FormattedMessage id="toast.success"/>)
        } catch (error) {
            console.error('Error updating courses:', error)
            const message = error.response.data.error
            onClose()
            toast.error(<FormattedMessage id="toast.error" values={{message}}/>)
        }
    }

    return (
        <Dialog open={true} onClose={onClose}>
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
                <Button variant="outlined" color="inherit" onClick={onClose} sx={{ml: 2}}>
                    <FormattedMessage id="buttons.cancel" defaultMessage="Cancel"/>
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ManageStudentsModal
