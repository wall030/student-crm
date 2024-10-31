import {FormattedMessage} from 'react-intl'
import {CourseUpdated} from '../../types/CourseUpdated'
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React from "react";

const EditCourseModal: React.FC<{
    course: CourseUpdated
    setCourse: React.Dispatch<React.SetStateAction<CourseUpdated>>
    onUpdate: () => void
    onClose: () => void
}> = ({course, setCourse, onUpdate, onClose}) => (
    <Dialog open={true} onClose={onClose}>
        <DialogTitle>
            <FormattedMessage id="modals.course.edit" defaultMessage="Edit Course"/>
        </DialogTitle>
        <DialogContent>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                <TextField
                    label={<FormattedMessage id="placeholders.courseName" defaultMessage="Name"/>}
                    variant="outlined"
                    value={course.name}
                    onChange={(e) => setCourse({...course, name: e.target.value})}
                    margin="dense"
                    fullWidth
                    required
                />
            </Box>
        </DialogContent>
        <DialogActions>
            <Button variant="contained" color="primary" onClick={onUpdate}>
                <FormattedMessage id="buttons.save" defaultMessage="Save"/>
            </Button>
            <Button variant="outlined" color="inherit" onClick={onClose}>
                <FormattedMessage id="buttons.cancel" defaultMessage="Cancel"/>
            </Button>
        </DialogActions>
    </Dialog>
)

export default EditCourseModal
