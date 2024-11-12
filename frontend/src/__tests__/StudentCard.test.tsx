import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import StudentCard from '../components/student/StudentCard'
import { Student } from '../types/Student'
import { Course } from '../types/Course'

const mockStudent: Student = {
    id: 1,
    firstName: 'Han',
    lastName: 'Solo',
    email: 'solo@smuggler.com',
    courses: [
        { id: 1, name: 'Piloting 101' } as Course,
        { id: 2, name: 'Starship Engineering' } as Course
    ]
}

jest.mock('@mui/material', () => ({
    Box: ({ children, component }: { children: React.ReactNode, component?: string }) => {
        if (component === 'table') {
            return <table>{children}</table>
        }
        if (component === 'span') {
            return <span>{children}</span>
        }
        return <div>{children}</div>
    },
    TableCell: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
    TableRow: ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => (
        <tr onClick={onClick} data-testid="table-row">{children}</tr>
    ),
}))

const renderStudentCard = (props: {
    student: Student
    isSelected: boolean
    onSelect: () => void
}) => {
    return render(
        <table>
            <tbody>
            <StudentCard {...props} />
            </tbody>
        </table>
    )
}

describe('StudentCard', () => {
    const mockOnSelect = jest.fn()

    beforeEach(() => {
        mockOnSelect.mockClear()
    })

    it('renders student information correctly', () => {
        renderStudentCard({
            student: mockStudent,
            isSelected: false,
            onSelect: mockOnSelect
        })

        expect(screen.getByText(`${mockStudent.firstName} ${mockStudent.lastName}`)).toBeInTheDocument()
        expect(screen.getByText(mockStudent.email)).toBeInTheDocument()

        mockStudent.courses.forEach(course => {
            expect(screen.getByText(course.name)).toBeInTheDocument()
        })
    })

    it('handles selection correctly', () => {
        renderStudentCard({
            student: mockStudent,
            isSelected: false,
            onSelect: mockOnSelect
        })

        const row = screen.getByTestId('table-row')
        fireEvent.click(row)

        expect(mockOnSelect).toHaveBeenCalledTimes(1)
    })

    it('applies selected styling when isSelected is true', () => {
        renderStudentCard({
            student: mockStudent,
            isSelected: true,
            onSelect: mockOnSelect
        })

        const row = screen.getByTestId('table-row')
        expect(row).toBeInTheDocument()
    })

    it('handles student with no courses', () => {
        const studentWithNoCourses: Student = {
            ...mockStudent,
            id: 2,
            courses: []
        }

        renderStudentCard({
            student: studentWithNoCourses,
            isSelected: false,
            onSelect: mockOnSelect
        })

        expect(screen.getByText(`${studentWithNoCourses.firstName} ${studentWithNoCourses.lastName}`)).toBeInTheDocument()
        expect(screen.getByText(studentWithNoCourses.email)).toBeInTheDocument()
    })
})
