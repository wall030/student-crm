import {FormattedMessage} from "react-intl"
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material"
import React, {useState} from "react"
import axios from "axios"
import toast from 'react-hot-toast'
import {Student} from '../../types/Student'
import {handleError} from "../../error/handleError"

const CreateStudentModal: React.FC<{
    open: boolean
    onClose: () => void
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>
}> = ({open, onClose, setStudents}) => {
    const [newStudent, setNewStudent] = useState({firstName: '', lastName: '', email: ''})
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

    const handleCreateStudent = async () => {
        try {
            const response = await axios.post<Student>(`http://localhost:8080/api/student/create`, newStudent)
            setStudents((prev) => [response.data, ...prev])
            onClose()
            toast.success(<FormattedMessage id="toast.success"/>)
        } catch (error) {
            onClose()
            const errorCode = error.response.data.errorCode
            handleError(errorCode)
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle><FormattedMessage id="modals.student.create" defaultMessage="Create Student"/></DialogTitle>
            <DialogContent>
                <Box sx={{display: "flex", flexDirection: "column", height: 300, width: 270}}>
                    <TextField label={<FormattedMessage id="placeholders.firstName" defaultMessage="First Name"/>}
                               value={newStudent.firstName}
                               onChange={handleFirstNameChange}
                               error={firstNameError}
                               helperText={firstNameError ?
                                   <FormattedMessage id="validation.invalidName" defaultMessage="Invalid first name"/> : ""}
                               sx={{
                                   width: 290,
                                   position: "absolute",
                                   top: "25%",
                                   left: "50%",
                                   transform: "translate(-50%, -50%)"
                               }}
                    />
                    <TextField label={<FormattedMessage id="placeholders.lastName" defaultMessage="Last Name"/>}
                               value={newStudent.lastName}
                               onChange={handleLastNameChange}
                               error={lastNameError}
                               helperText={lastNameError ?
                                   <FormattedMessage id="validation.invalidName" defaultMessage="Invalid last name"/> : ""}
                               sx={{
                                   width: 290,
                                   position: "absolute",
                                   top: "50%",
                                   left: "50%",
                                   transform: "translate(-50%, -50%)"
                               }}
                    />
                    <TextField label="E-Mail"
                               value={newStudent.email}
                               onChange={handleEmailChange}
                               error={emailError}
                               helperText={emailError ?
                                   <FormattedMessage id="validation.invalidEmail" defaultMessage="Invalid email address"/> : ""}
                               sx={{
                                   width: 290,
                                   position: "absolute",
                                   top: "75%",
                                   left: "50%",
                                   transform: "translate(-50%, -50%)"
                               }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateStudent}
                    disabled={!isFormValid}
                >
                    <FormattedMessage id="buttons.create" defaultMessage="Create"/>
                </Button>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => {
                        onClose()
                        setNewStudent({firstName: '', lastName: '', email: ''})
                    }}
                >
                    <FormattedMessage id="buttons.cancel" defaultMessage="Cancel"/>
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateStudentModal
