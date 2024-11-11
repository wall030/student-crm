import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import axios from 'axios'
import toast from 'react-hot-toast'
import EditStudentModal from '../components/student/EditStudentModal'
import { handleError } from '../error/handleError'
import { Student } from '../types/Student'

jest.mock('axios')
jest.mock('react-hot-toast')
jest.mock('../error/handleError')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('EditStudentModal', () => {
    const mockStudent: Student = {
        id: 1,
        firstName: 'Han',
        lastName: 'Solo',
        email: 'solo@smuggler.com',
        courses: []
    }

    const defaultProps = {
        open: true,
        student: mockStudent,
        setStudents: jest.fn(),
        onClose: jest.fn(),
    }

    const renderModal = () => {
        return render(
            <IntlProvider locale="en" messages={{}}>
                <EditStudentModal {...defaultProps} />
            </IntlProvider>
        )
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Form Rendering', () => {
        it('renders with initial student data', () => {
            renderModal()

            const firstNameInput = screen.getByRole('textbox', { name: /First Name/i })
            const lastNameInput = screen.getByRole('textbox', { name: /Last Name/i })
            const emailInput = screen.getByRole('textbox', { name: /E-Mail/i })

            expect(firstNameInput).toHaveValue('Han')
            expect(lastNameInput).toHaveValue('Solo')
            expect(emailInput).toHaveValue('solo@smuggler.com')
        })

        it('updates form when student prop changes', () => {
            const { rerender } = render(
                <IntlProvider locale="en" messages={{}}>
                    <EditStudentModal {...defaultProps} />
                </IntlProvider>
            )

            const updatedStudent: Student = {
                ...mockStudent,
                firstName: 'Boba',
                lastName: 'Fett',
                email: 'fett@bounty.com',
                courses: []
            }

            rerender(
                <IntlProvider locale="en" messages={{}}>
                    <EditStudentModal {...defaultProps} student={updatedStudent} />
                </IntlProvider>
            )

            expect(screen.getByRole('textbox', { name: /First Name/i })).toHaveValue('Boba')
            expect(screen.getByRole('textbox', { name: /Last Name/i })).toHaveValue('Fett')
            expect(screen.getByRole('textbox', { name: /E-Mail/i })).toHaveValue('fett@bounty.com')
        })
    })

    describe('Form Validation', () => {
        it('validates first name field', () => {
            renderModal()
            const firstNameInput = screen.getByRole('textbox', { name: /First Name/i })

            fireEvent.change(firstNameInput, { target: { value: '123' } })
            expect(screen.getByText(/Enter a valid first name/i)).toBeInTheDocument()

            fireEvent.change(firstNameInput, { target: { value: 'Han' } })
            expect(screen.queryByText(/Enter a valid first name/i)).not.toBeInTheDocument()
        })

        it('validates last name field', () => {
            renderModal()
            const lastNameInput = screen.getByRole('textbox', { name: /Last Name/i })

            fireEvent.change(lastNameInput, { target: { value: '123' } })
            expect(screen.getByText(/Enter a valid last name/i)).toBeInTheDocument()

            fireEvent.change(lastNameInput, { target: { value: 'Solo' } })
            expect(screen.queryByText(/Enter a valid last name/i)).not.toBeInTheDocument()
        })

        it('validates email field', () => {
            renderModal()
            const emailInput = screen.getByRole('textbox', { name: /E-Mail/i })

            fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
            expect(screen.getByText(/Enter a valid email address/i)).toBeInTheDocument()

            fireEvent.change(emailInput, { target: { value: 'solo@smuggler.com' } })
            expect(screen.queryByText(/Enter a valid email address/i)).not.toBeInTheDocument()
        })

        it('disables save button when form is invalid', () => {
            renderModal()
            const firstNameInput = screen.getByRole('textbox', { name: /First Name/i })
            const saveButton = screen.getByText(/Save/i)

            fireEvent.change(firstNameInput, { target: { value: '123' } })
            expect(saveButton).toBeDisabled()
        })
    })

    describe('Form Submission', () => {
        it('successfully updates student', async () => {
            renderModal()
            const updatedData: Student = {
                ...mockStudent,
                firstName: 'Boba',
                courses: []
            }

            const firstNameInput = screen.getByRole('textbox', { name: /First Name/i })
            fireEvent.change(firstNameInput, { target: { value: 'Boba' } })

            mockedAxios.put.mockResolvedValueOnce({ data: updatedData })

            const saveButton = screen.getByText(/Save/i)
            fireEvent.click(saveButton)

            await waitFor(() => {
                expect(mockedAxios.put).toHaveBeenCalledWith(
                    `http://localhost:8080/api/student/${mockStudent.id}/update`,
                    expect.objectContaining({ firstName: 'Boba' })
                )
                expect(defaultProps.setStudents).toHaveBeenCalled()
                expect(toast.success).toHaveBeenCalled()
                expect(defaultProps.onClose).toHaveBeenCalled()
            })
        })

        it('handles email already exists error', async () => {
            renderModal()
            const error = {
                response: {
                    data: {
                        errorCode: '1003'
                    }
                }
            }
            mockedAxios.put.mockRejectedValueOnce(error)

            const saveButton = screen.getByText(/Save/i)
            fireEvent.click(saveButton)

            await waitFor(() => {
                expect(handleError).toHaveBeenCalledWith('1003')
            })
        })
    })

    describe('Modal Actions', () => {
        it('closes modal on cancel button click', () => {
            renderModal()
            const cancelButton = screen.getByText(/Cancel/i)

            fireEvent.click(cancelButton)
            expect(defaultProps.onClose).toHaveBeenCalled()
        })

        it('handles modal close from dialog', () => {
            renderModal()
            const dialog = screen.getByRole('dialog')

            fireEvent.keyDown(dialog, { key: 'Escape' })
            expect(defaultProps.onClose).toHaveBeenCalled()
        })
    })
})
