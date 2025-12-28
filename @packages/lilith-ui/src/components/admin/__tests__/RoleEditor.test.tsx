import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { RoleEditor } from '../RoleEditor'

describe('RoleEditor', () => {
  const mockRole = {
    id: '1',
    name: 'Admin',
    permissions: ['read:posts', 'write:posts']
  }

  const mockPermissions = [
    { id: 'read:posts', name: 'Read Posts', category: 'content' },
    { id: 'write:posts', name: 'Write Posts', category: 'content' },
    { id: 'delete:posts', name: 'Delete Posts', category: 'content' }
  ]

  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <RoleEditor
          role={mockRole}
          availablePermissions={mockPermissions}
          onSave={jest.fn()}
        />
      </ThemeProvider>
    )
  })

  it('displays role name', () => {
    render(
      <ThemeProvider theme="luxe">
        <RoleEditor
          role={mockRole}
          availablePermissions={mockPermissions}
          onSave={jest.fn()}
        />
      </ThemeProvider>
    )

    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('displays permissions grouped by category', () => {
    render(
      <ThemeProvider theme="luxe">
        <RoleEditor
          role={mockRole}
          availablePermissions={mockPermissions}
          onSave={jest.fn()}
        />
      </ThemeProvider>
    )

    expect(screen.getByText('content')).toBeInTheDocument()
  })
})
