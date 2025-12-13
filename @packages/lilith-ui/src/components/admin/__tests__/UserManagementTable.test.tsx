import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { UserManagementTable, User } from '../UserManagementTable'

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-01-02')
  }
]

describe('UserManagementTable', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <UserManagementTable users={mockUsers} onApprove={jest.fn()} onReject={jest.fn()} />
      </ThemeProvider>
    )
  })

  it('displays user data', () => {
    render(
      <ThemeProvider theme="luxe">
        <UserManagementTable users={mockUsers} onApprove={jest.fn()} onReject={jest.fn()} />
      </ThemeProvider>
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
  })

  it('shows bulk actions when items are selected', () => {
    const onBulkAction = jest.fn()
    render(
      <ThemeProvider theme="luxe">
        <UserManagementTable users={mockUsers} onBulkAction={onBulkAction} />
      </ThemeProvider>
    )

    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[1]) // Select first user

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('item selected')).toBeInTheDocument()
  })
})
