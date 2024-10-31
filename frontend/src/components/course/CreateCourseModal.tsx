import {FormattedMessage} from "react-intl"
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React from "react";

const CreateCourseModal: React.FC<{
    newCourse: { name: string }
    setNewCourse: React.Dispatch<React.SetStateAction<{ name: string }>>
    onCreate: () => void
    onClose: () => void
}> = ({newCourse, setNewCourse, onCreate, onClose}) => (
    <Dialog open={true} onClose={onClose}>
        <DialogTitle>
            <FormattedMessage id="modals.course.create" defaultMessage="Create Course"/>
        </DialogTitle>
        <DialogContent>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
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
            <Button variant="contained" color="primary" onClick={onCreate}>
                <FormattedMessage id="buttons.create" defaultMessage="Create"/>
            </Button>
            <Button variant="outlined" color="inherit" onClick={onClose}>
                <FormattedMessage id="buttons.cancel" defaultMessage="Cancel"/>
            </Button>
        </DialogActions>
    </Dialog>
)

export default CreateCourseModal
