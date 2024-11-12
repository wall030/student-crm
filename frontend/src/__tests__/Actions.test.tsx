import { render, screen, fireEvent } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import Actions from '../components/Actions'

jest.mock('@heroicons/react/24/solid', () => ({
    TrashIcon: () => <div data-testid="trash-icon">Trash Icon</div>,
    PlusIcon: () => <div data-testid="plus-icon">Plus Icon</div>,
    PencilSquareIcon: () => <div data-testid="pencil-icon">Pencil Icon</div>,
    AcademicCapIcon: () => <div data-testid="academic-cap-icon">Academic Cap Icon</div>,
}))

describe('Actions', () => {
    const defaultProps = {
        manageButtonTitle: 'Manage Students',
        isEditDisabled: false,
        selected: [],
        onDelete: jest.fn(),
        onOpenCreateModal: jest.fn(),
        onOpenEditModal: jest.fn(),
        onOpenManageModal: jest.fn(),
    }

    const renderActions = (props = {}) => {
        return render(
            <IntlProvider locale="en" messages={{}}>
                <Actions {...defaultProps} {...props} />
            </IntlProvider>
        )
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Manage Button', () => {
        it('renders manage students button with correct text and color', () => {
            renderActions({ manageButtonTitle: 'Manage Students' })
            const button = screen.getByText('Manage Students')
            expect(button).toBeInTheDocument()
            expect(button.closest('button')).toHaveStyle({ backgroundColor: 'violet.main' })
        })

        it('renders manage courses button with correct text and color', () => {
            renderActions({ manageButtonTitle: 'Manage Courses' })
            const button = screen.getByText('Manage Courses')
            expect(button).toBeInTheDocument()
            expect(button.closest('button')).toHaveStyle({ backgroundColor: 'teal.main' })
        })

        it('disables manage button when isEditDisabled is true', () => {
            renderActions({ isEditDisabled: true })
            const button = screen.getByText('Manage Students')
            expect(button.closest('button')).toBeDisabled()
        })

        it('calls onOpenManageModal when clicked', () => {
            renderActions()
            fireEvent.click(screen.getByText('Manage Students'))
            expect(defaultProps.onOpenManageModal).toHaveBeenCalledTimes(1)
        })
    })

    describe('Edit Button', () => {
        it('renders edit button with tooltip', () => {
            renderActions()
            expect(screen.getByTestId('pencil-icon')).toBeInTheDocument()
            expect(screen.getByRole('edit-button')).toBeInTheDocument()
        })

        it('disables edit button when isEditDisabled is true', () => {
            renderActions({ isEditDisabled: true })
            const button = screen.getByTestId('pencil-icon').closest('button')
            expect(button).toBeDisabled()
        })

        it('calls onOpenEditModal when clicked', () => {
            renderActions()
            fireEvent.click(screen.getByTestId('pencil-icon'))
            expect(defaultProps.onOpenEditModal).toHaveBeenCalledTimes(1)
        })
    })

    describe('Delete Button', () => {
        it('renders delete button with tooltip', () => {
            renderActions()
            expect(screen.getByTestId('trash-icon')).toBeInTheDocument()
            expect(screen.getByRole('delete-button')).toBeInTheDocument()
        })

        it('disables delete button when no items are selected', () => {
            renderActions({ selected: [] })
            const button = screen.getByTestId('trash-icon').closest('button')
            expect(button).toBeDisabled()
        })

        it('enables delete button when items are selected', () => {
            renderActions({ selected: [1, 2] })
            const button = screen.getByTestId('trash-icon').closest('button')
            expect(button).not.toBeDisabled()
        })

        it('calls onDelete when clicked', () => {
            renderActions({ selected: [1] })
            fireEvent.click(screen.getByTestId('trash-icon'))
            expect(defaultProps.onDelete).toHaveBeenCalledTimes(1)
        })
    })

    describe('Add Button', () => {
        it('renders add button with tooltip', () => {
            renderActions()
            expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
            expect(screen.getByRole('add-button')).toBeInTheDocument()
        })

        it('calls onOpenCreateModal when clicked', () => {
            renderActions()
            fireEvent.click(screen.getByTestId('plus-icon'))
            expect(defaultProps.onOpenCreateModal).toHaveBeenCalledTimes(1)
        })

        it('is never disabled', () => {
            renderActions({ isEditDisabled: true })
            const button = screen.getByTestId('plus-icon').closest('button')
            expect(button).not.toBeDisabled()
        })
    })

    describe('Button Colors', () => {
        it('has correct colors for all buttons', () => {
            renderActions()

            const editButton = screen.getByTestId('pencil-icon').closest('button')
            expect(editButton).toHaveStyle({ backgroundColor: 'primary.main' })

            const deleteButton = screen.getByTestId('trash-icon').closest('button')
            expect(deleteButton).toHaveStyle({ backgroundColor: 'red.main' })

            const addButton = screen.getByTestId('plus-icon').closest('button')
            expect(addButton).toHaveStyle({ backgroundColor: 'green.main' })
        })
    })
})
