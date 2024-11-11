import 'jest-css-modules-transform'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

describe('App Component', () => {
    it('Renders the Navbar component', () => {
        render(<App />)
        expect(screen.getByRole('main-nav')).toBeInTheDocument()
    })

    it('Renders all pages', async () => {
        render(<App />)
        expect(screen.getByRole('home-page')).toBeInTheDocument()

        fireEvent.click(screen.getByRole('nav-students'))
        expect(screen.getByRole('students-page')).toBeInTheDocument()

        fireEvent.click(screen.getByRole('nav-courses'))
        expect(screen.getByRole('courses-page')).toBeInTheDocument()
    })
})
