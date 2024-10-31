import {FormattedMessage} from "react-intl"
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material"
import React, {useState} from "react"

const CreateStudentModal: React.FC<{
    newStudent: { firstName: string; lastName: string; email: string }
    setNewStudent: React.Dispatch<React.SetStateAction<{ firstName: string; lastName: string; email: string }>>
    onCreate: () => void
    onClose: () => void
}> = ({newStudent, setNewStudent, onCreate, onClose}) => {
    const [emailError, setEmailError] = useState(false)
    const [firstNameError, setFirstNameError] = useState(false)
    const [lastNameError, setLastNameError] = useState(false)
    const nameRegex = /^[a-zA-Zà-ÿÀ-ß\s'-]+$/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const handleEmailChange = (e) => {
        const email = e.target.value
        setNewStudent({...newStudent, email})
        setEmailError(!emailRegex.test(email))
    }
    const handleFirstNameChange = (e) => {
        const firstName = e.target.value
        setNewStudent({...newStudent, firstName})
        setFirstNameError(!nameRegex.test(firstName))
    }

    const handleLastNameChange = (e) => {
        const lastName = e.target.value
        setNewStudent({...newStudent, lastName})
        setLastNameError(!nameRegex.test(lastName))
    }

    const isFormValid = newStudent.firstName && !firstNameError &&
        newStudent.lastName && !lastNameError &&
        newStudent.email && !emailError

    return (
        <Box>
            <Dialog open={true} onClose={onClose}>
                <DialogTitle>
                    <FormattedMessage id="modals.student.create" defaultMessage="Create Student"/>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{display: "flex", flexDirection: "column", height: 300, width: 270}}>
                        <TextField
                            label={<FormattedMessage id="placeholders.firstName" defaultMessage="First Name"/>}
                            variant="outlined"
                            value={newStudent.firstName}
                            onChange={handleFirstNameChange}
                            error={firstNameError}
                            helperText={firstNameError ?
                                <FormattedMessage id="validation.invalidName" defaultMessage="Enter a valid first name"/> : ""}
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
                            value={newStudent.lastName}
                            onChange={handleLastNameChange}
                            error={lastNameError}
                            helperText={lastNameError ?
                                <FormattedMessage id="validation.invalidName" defaultMessage="Enter a valid last name"/> : ""}
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
                            value={newStudent.email}
                            onChange={handleEmailChange}
                            error={emailError}
                            helperText={emailError ?
                                <FormattedMessage id="validation.invalidEmail" defaultMessage="Enter a valid email address"/> : ""}
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
                    <Button variant="contained" color="primary" onClick={onCreate} disabled={!isFormValid}>
                        <FormattedMessage id="buttons.create" defaultMessage="Create"/>
                    </Button>
                    <Button variant="outlined" color="inherit" onClick={onClose}>
                        <FormattedMessage id="buttons.cancel" defaultMessage="Cancel"/>
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )


}

export default CreateStudentModal
