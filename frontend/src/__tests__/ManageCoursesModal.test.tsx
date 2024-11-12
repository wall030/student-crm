import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import ManageCoursesModal from '../components/student/ManageCoursesModal'
import { handleError } from '../error/handleError'
import toast from 'react-hot-toast'
import ResolvedValue = jest.ResolvedValue;

const axios = require('axios').default;
jest.mock('axios')
jest.mock('react-hot-toast')
jest.mock('../error/handleError')
jest.mock('react-intl', () => ({
    FormattedMessage: ({ id, defaultMessage }: { id: string; defaultMessage?: string }) => (
        defaultMessage || id
    ),
}))

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('ManageCoursesModal', () => {
    const mockStudent = {
        id: 1,
        firstName: 'Han',
        lastName: 'Solo',
        email: 'solo@smuggler.com',
        courses: [
            { id: 1, name: 'Piloting 101', students: [] },
        ],
    }

    const mockCourses = [
        { id: 1, name: 'Piloting 101', students: [] },
        { id: 2, name: 'Starship Engineering', students: [] },
        { id: 3, name: 'Tactical Warfare', students: [] },
    ]

    const mockProps = {
        open: true,
        student: mockStudent,
        onUpdate: jest.fn(),
        onClose: jest.fn(),
    }

    beforeEach(() => {
        jest.clearAllMocks()
        mockedAxios.get.mockResolvedValue({ data: mockCourses } as ResolvedValue<unknown>)
    })

    const renderModal = async () => {
        let renderResult
        await act(async () => {
            renderResult = render(<ManageCoursesModal {...mockProps} />)
        })
        return renderResult
    }

    it('renders the modal with student name in title', async () => {
        await renderModal()

        expect(screen.getByText(/Manage Courses for/)).toBeInTheDocument()
        expect(screen.getByText('Han Solo')).toBeInTheDocument()
    })

    it('fetches and displays courses when opened', async () => {
        await renderModal()

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/api/course/all')
        })

        await act(async () => {
            await Promise.resolve()
        })

        mockCourses.forEach(course => {
            expect(screen.getByText(course.name)).toBeInTheDocument()
        })
    })

    it('pre-selects enrolled courses', async () => {
        await renderModal()

        await act(async () => {
            await Promise.resolve()
        })

        const checkbox = screen.getByRole('checkbox', { name: /Piloting 101/i }) as HTMLInputElement
        expect(checkbox).toBeChecked()
    })

    it('handles course selection toggle', async () => {
        await renderModal()

        await act(async () => {
            const checkbox = screen.getByRole('checkbox', { name: /Starship Engineering/i })
            fireEvent.click(checkbox)
        })

        const checkbox = screen.getByRole('checkbox', { name: /Starship Engineering/i })
        expect(checkbox).toBeChecked()
    })

    it('submits selected courses successfully', async () => {
        const updatedCourses = [...mockStudent.courses, mockCourses[1]]
        mockedAxios.put.mockResolvedValueOnce({ data: updatedCourses } as ResolvedValue<unknown>)

        await renderModal()

        await act(async () => {
            const checkbox = screen.getByRole('checkbox', { name: /Starship Engineering/i })
            fireEvent.click(checkbox)
        })

        await act(async () => {
            const saveButton = screen.getByText('Save')
            fireEvent.click(saveButton)
        })

        await waitFor(() => {
            expect(mockedAxios.put).toHaveBeenCalledWith(
                `http://localhost:8080/api/student/${mockStudent.id}/assignCourses`,
                [1, 2]
            )
        })

        expect(mockProps.onUpdate).toHaveBeenCalledWith({
            ...mockStudent,
            courses: updatedCourses,
        })
        expect(toast.success).toHaveBeenCalled()
    })

    it('handles API error when fetching courses', async () => {
        const error = {
            response: {
                data: {
                    errorCode: '5000',
                },
            },
        }
        mockedAxios.get.mockRejectedValueOnce(error)

        await act(async () => {
            render(<ManageCoursesModal {...mockProps} />)
        })

        await waitFor(() => {
            expect(handleError).toHaveBeenCalledWith('5000')
        })
    })

    it('handles API error when submitting courses', async () => {
        const error = {
            response: {
                data: {
                    errorCode: '5000',
                },
            },
        }
        mockedAxios.put.mockRejectedValueOnce(error)

        await renderModal()

        await act(async () => {
            const saveButton = screen.getByText('Save')
            fireEvent.click(saveButton)
        })

        await waitFor(() => {
            expect(handleError).toHaveBeenCalledWith('5000')
            expect(mockProps.onClose).toHaveBeenCalled()
        })
    })

    it('closes modal when cancel button is clicked', async () => {
        await renderModal()

        await act(async () => {
            const cancelButton = screen.getByText('Cancel')
            fireEvent.click(cancelButton)
        })

        expect(mockProps.onClose).toHaveBeenCalled()
    })
})
