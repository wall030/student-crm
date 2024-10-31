import {FormattedMessage} from "react-intl"
import {StudentUpdated} from "../../types/StudentUpdated"
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material"
import React, {useState} from "react"

const EditStudentModal: React.FC<{
    student: StudentUpdated
    setStudent: React.Dispatch<React.SetStateAction<StudentUpdated>>
    onUpdate: () => void
    onClose: () => void
}> = ({student, setStudent, onUpdate, onClose}) => {
    const [emailError, setEmailError] = useState(false)
    const [firstNameError, setFirstNameError] = useState(false)
    const [lastNameError, setLastNameError] = useState(false)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const nameRegex = /^[a-zA-Zà-ÿÀ-ß\s'-]+$/

    const handleEmailChange = (e) => {
        const email = e.target.value
        setStudent({...student, email})
        setEmailError(!emailRegex.test(email))
    }

    const handleFirstNameChange = (e) => {
        const firstName = e.target.value
        setStudent({...student, firstName})
        setFirstNameError(!nameRegex.test(firstName))
    }

    const handleLastNameChange = (e) => {
        const lastName = e.target.value
        setStudent({...student, lastName})
        setLastNameError(!nameRegex.test(lastName))
    }

    const isFormValid = !firstNameError && !lastNameError && !emailError

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>
                <FormattedMessage id="modals.student.edit" defaultMessage="Edit Student"/>
            </DialogTitle>
            <DialogContent>
                <Box sx={{display: "flex", flexDirection: "column", height: 300, width: 270}}>
                    <TextField
                        label={<FormattedMessage id="placeholders.firstName" defaultMessage="First Name"/>}
                        variant="outlined"
                        value={student.firstName}
                        onChange={handleFirstNameChange}
                        error={firstNameError}
                        helperText={firstNameError ?
                            <FormattedMessage id="validation.invalidName" defaultMessage="Enter a valid first name"/> : ""}
                        fullWidth
                        required
                        sx={{
                            width: 280,
                            position: "absolute",
                            top: "25%",
                            left: "50%",
                            transform: "translate(-50%, -50%)"
                        }}
                    />
                    <TextField
                        label={<FormattedMessage id="placeholders.lastName" defaultMessage="Last Name"/>}
                        variant="outlined"
                        value={student.lastName}
                        onChange={handleLastNameChange}
                        error={lastNameError}
                        helperText={lastNameError ?
                            <FormattedMessage id="validation.invalidName" defaultMessage="Enter a valid last name"/> : ""}
                        fullWidth
                        required
                        sx={{
                            width: 280,
                            position: "absolute",
                            top: "45%",
                            left: "50%",
                            transform: "translate(-50%, -50%)"
                        }}
                    />
                    <TextField
                        label={"E-Mail"}
                        variant="outlined"
                        type="email"
                        value={student.email}
                        onChange={handleEmailChange}
                        error={emailError}
                        helperText={emailError ?
                            <FormattedMessage id="validation.invalidEmail" defaultMessage="Enter a valid email address"/> : ""}
                        fullWidth
                        required
                        sx={{
                            width: 280,
                            position: "absolute",
                            top: "65%",
                            left: "50%",
                            transform: "translate(-50%, -50%)"
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={onUpdate} disabled={!isFormValid}>
                    <FormattedMessage id="buttons.save" defaultMessage="Save"/>
                </Button>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                    <FormattedMessage id="buttons.cancel" defaultMessage="Cancel"/>
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditStudentModal
