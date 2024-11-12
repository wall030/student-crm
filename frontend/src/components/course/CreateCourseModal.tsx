import {FormattedMessage} from "react-intl"
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material"
import React, {useState} from "react"
import axios from "axios"
import {Course} from "../../types/Course"
import toast from "react-hot-toast"
import {handleError} from "../../error/handleError";

const CreateCourseModal: React.FC<{
    open: boolean
    onClose: () => void
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>
}> = ({open, onClose, setCourses}) => {
    const [newCourse, setNewCourse] = useState({name: ''})

    const handleCreateCourse = async () => {
        axios.post<Course>(`http://localhost:8080/api/course/create`, newCourse)
            .then(function (response) {
                setCourses((prev) => [response.data, ...prev])
                onClose()
                setNewCourse({name: ''})
                toast.success(<FormattedMessage id="toast.success"/>)
            }).catch(function (error) {
            onClose()
            setNewCourse({name: ''})
            const errorCode = error.response.data.errorCode
            handleError(errorCode)
        })
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <FormattedMessage id="modals.course.create" defaultMessage="Create Course"/>
            </DialogTitle>
            <DialogContent>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <TextField
                        label={<FormattedMessage id="placeholders.courseName" defaultMessage="Name"/>}
                        variant="outlined"
                        value={newCourse.name}
                        onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                        margin="dense"
                        fullWidth
                        required
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleCreateCourse}>
                    <FormattedMessage id="buttons.create" defaultMessage="Create"/>
                </Button>
                <Button variant="outlined" color="inherit" onClick={() => {
                    onClose()
                    setNewCourse({name: ''})
                }}
                >
                    <FormattedMessage id="buttons.cancel" defaultMessage="Cancel"/>
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateCourseModal
