import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { MarkdownEditor } from '../MarkdownEditor'

describe('MarkdownEditor', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <MarkdownEditor value="" onChange={jest.fn()} />
      </ThemeProvider>
    )
  })

  it('shows write and preview tabs when showPreview is true', () => {
    render(
      <ThemeProvider theme="luxe">
        <MarkdownEditor value="" onChange={jest.fn()} showPreview={true} />
      </ThemeProvider>
    )

    expect(screen.getByText('Write')).toBeInTheDocument()
    expect(screen.getByText('Preview')).toBeInTheDocument()
  })
})
