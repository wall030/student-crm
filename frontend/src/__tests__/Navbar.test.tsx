import React from 'react'
import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import Navbar from '../components/Navbar'

jest.mock('@heroicons/react/24/outline', () => ({
    GlobeAltIcon: () => <div data-testid="globe-icon">Globe Icon</div>,
}))

describe('Navbar', () => {
    const mockSetLocale = jest.fn()

    const renderNavbar = (path: string = '/') => {
        return render(
            <MemoryRouter
                future={{
                    v7_relativeSplatPath: true,
                    v7_startTransition: true,
                }}
                initialEntries={[path]}>
                <IntlProvider locale="en" messages={{}}>
                    <Navbar setLocale={mockSetLocale} />
                </IntlProvider>
            </MemoryRouter>
        )
    }

    beforeEach(() => {
        mockSetLocale.mockClear()
    })

    it('renders the navbar with correct brand text', () => {
        renderNavbar()
        expect(screen.getByRole('nav-home')).toHaveTextContent('StudentCRM')
    })

    it('renders navigation buttons with correct text', () => {
        renderNavbar()
        expect(screen.getByRole('nav-students')).toHaveTextContent('Students')
        expect(screen.getByRole('nav-courses')).toHaveTextContent('Courses')
    })

    it('applies correct button variants based on current route - students page', () => {
        renderNavbar('/students')
        const studentsButton = screen.getByRole('nav-students')
        const coursesButton = screen.getByRole('nav-courses')

        expect(studentsButton).toHaveClass('MuiButton-contained')
        expect(coursesButton).toHaveClass('MuiButton-outlined')
    })

    it('applies correct button variants based on current route - courses page', () => {
        renderNavbar('/courses')
        const studentsButton = screen.getByRole('nav-students')
        const coursesButton = screen.getByRole('nav-courses')

        expect(studentsButton).toHaveClass('MuiButton-outlined')
        expect(coursesButton).toHaveClass('MuiButton-contained')
    })

    it('renders language selector button', () => {
        renderNavbar()
        expect(screen.getByTestId('globe-icon')).toBeInTheDocument()
    })

    it('opens language menu when clicking the language selector', () => {
        renderNavbar()
        const languageButton = screen.getByTestId('globe-icon').parentElement
        fireEvent.click(languageButton)

        expect(screen.getByText('English')).toBeInTheDocument()
        expect(screen.getByText('German')).toBeInTheDocument()
    })

    it('calls setLocale with correct language when selecting a language', async () => {
        renderNavbar()

        const languageButton = screen.getByTestId('globe-icon').parentElement
        fireEvent.click(languageButton)

        fireEvent.click(screen.getByText('English'))
        expect(mockSetLocale).toHaveBeenCalledWith('en')

        await waitForElementToBeRemoved(() => screen.queryByText('English'))

        fireEvent.click(languageButton)
        fireEvent.click(screen.getByText('German'))
        expect(mockSetLocale).toHaveBeenCalledWith('de')
    })

    it('closes the language menu when a selection is made', async () => {
        renderNavbar()

        const languageButton = screen.getByTestId('globe-icon').parentElement
        fireEvent.click(languageButton)

        fireEvent.click(screen.getByText('English'))

        await waitForElementToBeRemoved(() => screen.queryByText('English'))
    })

    it('navigation links have correct href attributes', () => {
        renderNavbar()

        expect(screen.getByRole('nav-students').closest('a')).toHaveAttribute('href', '/students')
        expect(screen.getByRole('nav-courses').closest('a')).toHaveAttribute('href', '/courses')
        expect(screen.getByRole('nav-home').closest('a')).toHaveAttribute('href', '/')
    })
})
