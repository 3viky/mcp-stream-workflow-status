import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { TagInput } from '../TagInput'

describe('TagInput', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <TagInput value={[]} onChange={jest.fn()} />
      </ThemeProvider>
    )
  })

  it('displays existing tags', () => {
    const { container } = render(
      <ThemeProvider theme="luxe">
        <TagInput value={['react', 'typescript']} onChange={jest.fn()} />
      </ThemeProvider>
    )

    expect(container.textContent).toContain('react')
    expect(container.textContent).toContain('typescript')
  })
})
