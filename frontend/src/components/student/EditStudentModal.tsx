import {FormattedMessage} from "react-intl"
import {StudentUpdated} from "../../types/StudentUpdated"
import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material"
import React, {useEffect, useState} from "react"
import axios from "axios"
import toast from "react-hot-toast"
import {Student} from "../../types/Student"
import {handleError} from "../../error/handleError";

const EditStudentModal: React.FC<{
    open: boolean
    student: Student
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>
    onClose: () => void
}> = ({open, student, setStudents, onClose}) => {
    const [updatedStudent, setUpdatedStudent] = useState<StudentUpdated>({...student})
    const [emailError, setEmailError] = useState(false)
    const [firstNameError, setFirstNameError] = useState(false)
    const [lastNameError, setLastNameError] = useState(false)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const nameRegex = /^[a-zA-Zà-ÿÀ-ß\s'-]+$/

    useEffect(() => {
        setUpdatedStudent({...student})
    }, [student])

    const handleEmailChange = (e) => {
        const email = e.target.value
        setUpdatedStudent({...updatedStudent, email})
        setEmailError(!emailRegex.test(email))
    }

    const handleFirstNameChange = (e) => {
        const firstName = e.target.value
        setUpdatedStudent({...updatedStudent, firstName})
        setFirstNameError(!nameRegex.test(firstName))
    }

    const handleLastNameChange = (e) => {
        const lastName = e.target.value
        setUpdatedStudent({...updatedStudent, lastName})
        setLastNameError(!nameRegex.test(lastName))
    }

    const isFormValid = !firstNameError && !lastNameError && !emailError

    const handleUpdateStudent = async () => {
        try {
            await axios.put(`http://localhost:8080/api/student/${updatedStudent.id}/update`, updatedStudent)
            setStudents((prevStudents) =>
                prevStudents.map((student) => student.id === updatedStudent.id ? {...student, ...updatedStudent} : student)
            )
            toast.success(<FormattedMessage id="toast.success"/>)
            onClose()
        } catch (error) {
            const errorCode = error.response.data.errorCode
            handleError(errorCode)
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle><FormattedMessage id="modals.student.edit" defaultMessage="Edit Student"/></DialogTitle>
            <DialogContent>
                <Box sx={{display: "flex", flexDirection: "column", height: 300, width: 270}}>
                    <TextField
                        label={<FormattedMessage id="placeholders.firstName" defaultMessage="First Name"/>}
                        variant="outlined"
                        value={updatedStudent.firstName}
                        onChange={handleFirstNameChange}
                        error={firstNameError}
                        helperText={firstNameError ? <FormattedMessage id="validation.invalidName" defaultMessage="Enter a valid first name"/> : ""}
                        fullWidth
                        required
                        sx={{
                            width: 290,
                            position: "absolute",
                            top: "25%",
                            left: "50%",
                            transform: "translate(-50%, -50%)"
                        }}
                    />
                    <TextField
                        label={<FormattedMessage id="placeholders.lastName" defaultMessage="Last Name"/>}
                        variant="outlined"
                        value={updatedStudent.lastName}
                        onChange={handleLastNameChange}
                        error={lastNameError}
                        helperText={lastNameError ? <FormattedMessage id="validation.invalidName" defaultMessage="Enter a valid last name"/> : ""}
                        fullWidth
                        required
                        sx={{
                            width: 290,
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)"
                        }}
                    />
                    <TextField
                        label={"E-Mail"}
                        variant="outlined"
                        type="email"
                        value={updatedStudent.email}
                        onChange={handleEmailChange}
                        error={emailError}
                        helperText={emailError ? <FormattedMessage id="validation.invalidEmail" defaultMessage="Enter a valid email address"/> : ""}
                        fullWidth
                        required
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
                <Button variant="contained" color="primary" onClick={handleUpdateStudent} disabled={!isFormValid}>
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
