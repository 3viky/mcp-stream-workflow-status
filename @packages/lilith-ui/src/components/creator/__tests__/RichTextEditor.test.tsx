import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { RichTextEditor } from '../RichTextEditor'

describe('RichTextEditor', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <RichTextEditor value="" onChange={jest.fn()} />
      </ThemeProvider>
    )
  })

  it('displays toolbar with formatting options', () => {
    const { container } = render(
      <ThemeProvider theme="luxe">
        <RichTextEditor value="" onChange={jest.fn()} />
      </ThemeProvider>
    )

    expect(container.textContent).toContain('B')
    expect(container.textContent).toContain('I')
  })
})
