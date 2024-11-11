import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Searchbar from '../components/Searchbar'

jest.mock('@mui/material', () => ({
    Box: ({ children, sx }: { children: React.ReactNode; sx?: any }) => (
        <div data-testid="box">{children}</div>
    ),
    IconButton: ({ children, onClick, sx }: { children: React.ReactNode; onClick: () => void; sx?: any }) => (
        <button data-testid="search-button" onClick={onClick}>{children}</button>
    ),
    InputBase: ({
                    value,
                    onChange,
                    onKeyDown,
                    placeholder,
                    sx
                }: {
        value: string
        onChange: (e: any) => void
        onKeyDown: (e: any) => void
        placeholder: string
        sx?: any
    }) => (
        <input
            data-testid="search-input"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
        />
    ),
}))

jest.mock('@heroicons/react/24/solid', () => ({
    MagnifyingGlassIcon: () => <span data-testid="search-icon">Search Icon</span>
}))

describe('Searchbar', () => {
    const mockOnSearch = jest.fn()
    const mockPlaceholder = 'Search...'

    beforeEach(() => {
        mockOnSearch.mockClear()
    })

    it('renders correctly with placeholder', () => {
        render(
            <Searchbar
                onSearch={mockOnSearch}
                placeholder={mockPlaceholder}
            />
        )

        const input = screen.getByTestId('search-input')
        const searchButton = screen.getByTestId('search-button')
        const searchIcon = screen.getByTestId('search-icon')

        expect(input).toBeInTheDocument()
        expect(input).toHaveAttribute('placeholder', mockPlaceholder)
        expect(searchButton).toBeInTheDocument()
        expect(searchIcon).toBeInTheDocument()
    })

    it('updates input value when typing', () => {
        render(
            <Searchbar
                onSearch={mockOnSearch}
                placeholder={mockPlaceholder}
            />
        )

        const input = screen.getByTestId('search-input')
        fireEvent.change(input, { target: { value: 'test search' } })

        expect(input).toHaveValue('test search')
    })

    it('calls onSearch when search button is clicked', () => {
        render(
            <Searchbar
                onSearch={mockOnSearch}
                placeholder={mockPlaceholder}
            />
        )

        const input = screen.getByTestId('search-input')
        const searchButton = screen.getByTestId('search-button')

        fireEvent.change(input, { target: { value: 'test search' } })
        fireEvent.click(searchButton)

        expect(mockOnSearch).toHaveBeenCalledTimes(1)
        expect(mockOnSearch).toHaveBeenCalledWith('test search')
    })

    it('calls onSearch when Enter key is pressed', () => {
        render(
            <Searchbar
                onSearch={mockOnSearch}
                placeholder={mockPlaceholder}
            />
        )

        const input = screen.getByTestId('search-input')

        fireEvent.change(input, { target: { value: 'test search' } })
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

        expect(mockOnSearch).toHaveBeenCalledTimes(1)
        expect(mockOnSearch).toHaveBeenCalledWith('test search')
    })

    it('does not call onSearch when other keys are pressed', () => {
        render(
            <Searchbar
                onSearch={mockOnSearch}
                placeholder={mockPlaceholder}
            />
        )

        const input = screen.getByTestId('search-input')

        fireEvent.change(input, { target: { value: 'test search' } })
        fireEvent.keyDown(input, { key: 'Space', code: 'Space' })

        expect(mockOnSearch).not.toHaveBeenCalled()
    })

    it('handles empty search term', () => {
        render(
            <Searchbar
                onSearch={mockOnSearch}
                placeholder={mockPlaceholder}
            />
        )

        const searchButton = screen.getByTestId('search-button')
        fireEvent.click(searchButton)

        expect(mockOnSearch).toHaveBeenCalledWith('')
    })

    it('maintains state between searches', () => {
        render(
            <Searchbar
                onSearch={mockOnSearch}
                placeholder={mockPlaceholder}
            />
        )

        const input = screen.getByTestId('search-input')
        const searchButton = screen.getByTestId('search-button')

        fireEvent.change(input, { target: { value: 'first search' } })
        fireEvent.click(searchButton)
        expect(mockOnSearch).toHaveBeenCalledWith('first search')

        fireEvent.change(input, { target: { value: 'second search' } })
        fireEvent.click(searchButton)
        expect(mockOnSearch).toHaveBeenCalledWith('second search')

        expect(mockOnSearch).toHaveBeenCalledTimes(2)
    })
})
