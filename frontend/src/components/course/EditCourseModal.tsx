import {FormattedMessage} from 'react-intl'
import {CourseUpdated} from '../../types/CourseUpdated'
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material"
import React, {useEffect, useState} from "react"
import {Course} from "../../types/Course.ts"
import axios from "axios"
import toast from "react-hot-toast"
import {handleError} from "../../error/handleError.tsx";

const EditCourseModal: React.FC<{
    open: boolean
    course: Course
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>
    onClose: () => void
}> = ({open, course, setCourses, onClose}) => {
    const [updatedCourse, setUpdatedCourse] = useState<CourseUpdated>({...course})

    useEffect(() => {
        setUpdatedCourse({...course})
    }, [course])

    const handleCourseUpdated = async () => {
        try {
            await axios.put(`http://localhost:8080/api/course/${updatedCourse.id}/update`, updatedCourse
            )
            onClose()
            setCourses((prevCourses) =>
                prevCourses.map((course) => (course.id === updatedCourse
                    .id ? {
                    ...course, ...updatedCourse
                } : course))
            )
            toast.success(<FormattedMessage id="toast.success"/>)
        } catch (error) {
            onClose()
            const errorCode = error.response.data.errorCode
            handleError(errorCode)
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <FormattedMessage id="modals.course.edit" defaultMessage="Edit Course"/>
            </DialogTitle>
            <DialogContent>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <TextField
                        label={<FormattedMessage id="placeholders.courseName" defaultMessage="Name"/>}
                        variant="outlined"
                        value={updatedCourse.name}
                        onChange={(e) => setUpdatedCourse({...updatedCourse, name: e.target.value})}
                        margin="dense"
                        fullWidth
                        required
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleCourseUpdated}>
                    <FormattedMessage id="buttons.save" defaultMessage="Save"/>
                </Button>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    <FormattedMessage id="buttons.cancel" defaultMessage="Cancel"/>
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditCourseModal
