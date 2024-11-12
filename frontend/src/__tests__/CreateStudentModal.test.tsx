import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import {IntlProvider} from 'react-intl'
import toast from 'react-hot-toast'
import CreateStudentModal from '../components/student/CreateStudentModal'
import {handleError} from '../error/handleError'
import ResolvedValue = jest.ResolvedValue;

const axios = require('axios').default;

jest.mock('axios')
jest.mock('react-hot-toast')
jest.mock('../error/handleError')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('CreateStudentModal', () => {
    const defaultProps = {
        open: true,
        onClose: jest.fn(),
        setStudents: jest.fn(),
    }

    const renderModal = () => {
        return render(
            <IntlProvider locale="en" messages={{}}>
                <CreateStudentModal {...defaultProps} />
            </IntlProvider>
        )
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Form Rendering', () => {
        it('renders all form fields and buttons', () => {
            renderModal()

            expect(screen.getByRole('textbox', {name: /First Name/i})).toBeInTheDocument()
            expect(screen.getByRole('textbox', {name: /Last Name/i})).toBeInTheDocument()
            expect(screen.getByRole('textbox', {name: /E-Mail/i})).toBeInTheDocument()
            expect(screen.getByRole('button', {name: /Create/i})).toBeInTheDocument()
            expect(screen.getByRole('button', {name: /Cancel/i})).toBeInTheDocument()
        })

        it('create button is initially disabled', () => {
            renderModal()
            expect(screen.getByRole('button', {name: /Create/i})).toBeDisabled()
        })
    })

    describe('Form Validation', () => {
        it('validates first name field', () => {
            renderModal()
            const firstNameInput = screen.getByRole('textbox', {name: /First Name/i})

            fireEvent.change(firstNameInput, {target: {value: '123'}})
            expect(screen.getByText(/Invalid first name/i)).toBeInTheDocument()

            fireEvent.change(firstNameInput, {target: {value: 'Han'}})
            expect(screen.queryByText(/Invalid first name/i)).not.toBeInTheDocument()
        })

        it('validates last name field', () => {
            renderModal()
            const lastNameInput = screen.getByRole('textbox', {name: /Last Name/i})

            fireEvent.change(lastNameInput, {target: {value: '123'}})
            expect(screen.getByText(/Invalid last name/i)).toBeInTheDocument()

            fireEvent.change(lastNameInput, {target: {value: 'Solo'}})
            expect(screen.queryByText(/Invalid last name/i)).not.toBeInTheDocument()
        })

        it('validates email field', () => {
            renderModal()
            const emailInput = screen.getByRole('textbox', {name: /E-Mail/i})

            fireEvent.change(emailInput, {target: {value: 'invalid-email'}})
            expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument()

            fireEvent.change(emailInput, {target: {value: 'solo@smuggler.com'}})
            expect(screen.queryByText(/Invalid email address/i)).not.toBeInTheDocument()
        })

        it('enables create button when form is valid', () => {
            renderModal()
            const firstNameInput = screen.getByRole('textbox', {name: /First Name/i})
            const lastNameInput = screen.getByRole('textbox', {name: /Last Name/i})
            const emailInput = screen.getByRole('textbox', {name: /E-Mail/i})

            fireEvent.change(firstNameInput, {target: {value: 'Han'}})
            fireEvent.change(lastNameInput, {target: {value: 'Solo'}})
            fireEvent.change(emailInput, {target: {value: 'solo@smuggler.com'}})

            expect(screen.getByRole('button', {name: /Create/i})).not.toBeDisabled()
        })
    })

    describe('Form Submission', () => {
        it('successfully creates a student', async () => {
            const newStudent = {
                firstName: 'Han',
                lastName: 'Solo',
                email: 'solo@smuggler.com'
            }

            const responseData = {...newStudent, id: 1}
            mockedAxios.post.mockResolvedValueOnce({responseData} as ResolvedValue<unknown>)

            renderModal()

            fireEvent.change(screen.getByRole('textbox', {name: /First Name/i}), {target: {value: newStudent.firstName}})
            fireEvent.change(screen.getByRole('textbox', {name: /Last Name/i}), {target: {value: newStudent.lastName}})
            fireEvent.change(screen.getByRole('textbox', {name: /E-Mail/i}), {target: {value: newStudent.email}})

            fireEvent.click(screen.getByRole('button', {name: /Create/i}))

            await waitFor(() => {
                expect(mockedAxios.post).toHaveBeenCalledWith(
                    'http://localhost:8080/api/student/create',
                    newStudent
                )
                expect(defaultProps.setStudents).toHaveBeenCalled()
                expect(defaultProps.onClose).toHaveBeenCalled()
                expect(toast.success).toHaveBeenCalled()
            })
        })

        it('handles email exists error', async () => {
            const error = {
                response: {
                    data: {
                        errorCode: '1003'
                    }
                }
            }
            mockedAxios.post.mockRejectedValueOnce(error)

            renderModal()

            fireEvent.change(screen.getByRole('textbox', {name: /First Name/i}), {target: {value: 'Han'}})
            fireEvent.change(screen.getByRole('textbox', {name: /Last Name/i}), {target: {value: 'Solo'}})
            fireEvent.change(screen.getByRole('textbox', {name: /E-Mail/i}), {target: {value: 'solo@smuggler.com'}})

            fireEvent.click(screen.getByRole('button', {name: /Create/i}))

            await waitFor(() => {
                expect(handleError).toHaveBeenCalledWith('1003')
                expect(defaultProps.onClose).toHaveBeenCalled()
            })
        })
    })

    describe('Modal Actions', () => {
        it('closes modal and resets form on cancel', () => {
            renderModal()

            fireEvent.change(screen.getByRole('textbox', {name: /First Name/i}), {target: {value: 'Han'}})
            fireEvent.change(screen.getByRole('textbox', {name: /Last Name/i}), {target: {value: 'Solo'}})
            fireEvent.change(screen.getByRole('textbox', {name: /E-Mail/i}), {target: {value: 'solo@smuggler.com'}})

            fireEvent.click(screen.getByRole('button', {name: /Cancel/i}))

            expect(defaultProps.onClose).toHaveBeenCalled()

            renderModal()
            expect(screen.getByRole('textbox', {name: /First Name/i})).toHaveValue('')
            expect(screen.getByRole('textbox', {name: /Last Name/i})).toHaveValue('')
            expect(screen.getByRole('textbox', {name: /E-Mail/i})).toHaveValue('')
        })
    })
})
