import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import axios from 'axios'
import StudentsList from '../components/student/StudentsList'
import { Student } from '../types/Student'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
}))

const mockStudents: Student[] = [
    {
        id: 1,
        firstName: 'Han',
        lastName: 'Solo',
        email: 'solo@smuggler.com',
        courses: []
    },
    {
        id: 2,
        firstName: 'Boba',
        lastName: 'Fett',
        email: 'fett@bounty.com',
        courses: []
    }
]

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <IntlProvider messages={{}} locale="en">
        {children}
    </IntlProvider>
)

describe('StudentsList', () => {
    beforeEach(() => {
        jest.clearAllMocks()

        mockedAxios.get.mockImplementation((url) => {
            if (url.includes('/api/student/count')) {
                return Promise.resolve({ data: mockStudents.length })
            }
            return Promise.resolve({ data: mockStudents })
        })
    })

    it('renders student list and performs initial data fetch', async () => {
        await act(async () => {
            render(<StudentsList searchTerm="" />, { wrapper })
        })

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledTimes(2)
        })

        expect(screen.getByText('Han Solo')).toBeInTheDocument()
        expect(screen.getByText('Boba Fett')).toBeInTheDocument()
    })

    it('handles sorting when clicking column headers', async () => {
        await act(async () => {
            render(<StudentsList searchTerm="" />, { wrapper })
        })

        const nameHeader = screen.getByText('Name')

        await act(async () => {
            fireEvent.click(nameHeader)
        })

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith(
                'http://localhost:8080/api/student',
                expect.objectContaining({
                    params: expect.objectContaining({
                        sortField: 'lastName',
                        sortOrder: 'desc'
                    })
                })
            )
        })
    })

    it('handles student selection', async () => {
        await act(async () => {
            render(<StudentsList searchTerm="" />, { wrapper })
        })

        await waitFor(() => {
            expect(screen.getByText('Han Solo')).toBeInTheDocument()
        })

        const studentRow = screen.getByText('Han Solo').closest('tr')
        await act(async () => {
            fireEvent.click(studentRow!)
        })

        const editButton = screen.getByRole('edit-button')
        expect(editButton).not.toBeDisabled()
    })

    it('handles pagination', async () => {
        mockedAxios.get.mockImplementation((url) => {
            if (url.includes('/api/student/count')) {
                return Promise.resolve({ data: 25 })
            }
            return Promise.resolve({ data: mockStudents })
        })

        await act(async () => {
            render(<StudentsList searchTerm="" />, { wrapper })
        })

        await waitFor(() => {
            expect(screen.getByText('Han Solo')).toBeInTheDocument()
        })

        const nextButton = screen.getByRole('button', { name: /next/i })

        mockedAxios.get.mockClear()

        await act(async () => {
            fireEvent.click(nextButton)
        })

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith(
                'http://localhost:8080/api/student',
                expect.objectContaining({
                    params: expect.objectContaining({
                        page: 1,
                        rowsPerPage: 10,
                        sortField: 'lastName',
                        sortOrder: 'asc',
                        search: ''
                    })
                })
            )
        })
    })

    it('handles student deletion', async () => {
        mockedAxios.delete.mockResolvedValueOnce({ data: {} })

        await act(async () => {
            render(<StudentsList searchTerm="" />, { wrapper })
        })

        await waitFor(() => {
            expect(screen.getByText('Han Solo')).toBeInTheDocument()
        })

        const studentRow = screen.getByText('Han Solo').closest('tr')
        await act(async () => {
            fireEvent.click(studentRow!)
        })

        const deleteButton = screen.getByRole('delete-button')
        await act(async () => {
            fireEvent.click(deleteButton)
        })

        await waitFor(() => {
            expect(mockedAxios.delete).toHaveBeenCalledWith(
                'http://localhost:8080/api/student/delete',
                expect.objectContaining({
                    data: [1]
                })
            )
        })
    })

    it('handles search term changes', async () => {
        const { rerender } = render(<StudentsList searchTerm="" />, { wrapper })

        await act(async () => {
            rerender(<StudentsList searchTerm="Han" />)
        })

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith(
                'http://localhost:8080/api/student',
                expect.objectContaining({
                    params: expect.objectContaining({
                        search: 'Han'
                    })
                })
            )
        })
    })

    it('handles error cases', async () => {
        mockedAxios.get.mockRejectedValueOnce({
            response: {
                data: {
                    errorCode: '5000'
                }
            }
        })

        await act(async () => {
            render(<StudentsList searchTerm="" />, { wrapper })
        })

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalled()
        })
    })

    it('changes rows per page', async () => {
        await act(async () => {
            render(<StudentsList searchTerm="" />, { wrapper })
        })

        const select = screen.getByRole('combobox', { name: /rows per page/i })

        await act(async () => {
            fireEvent.mouseDown(select)
        })

        const option25 = screen.getByRole('option', { name: '25' })
        fireEvent.click(option25)

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith(
                'http://localhost:8080/api/student',
                expect.objectContaining({
                    params: expect.objectContaining({
                        rowsPerPage: 25
                    })
                })
            )
        })
    })
})
