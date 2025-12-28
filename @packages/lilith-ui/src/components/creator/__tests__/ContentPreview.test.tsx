import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { ContentPreview } from '../ContentPreview'

describe('ContentPreview', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <ContentPreview title="Test" content="<p>Content</p>" />
      </ThemeProvider>
    )
  })

  it('displays title and content', () => {
    render(
      <ThemeProvider theme="luxe">
        <ContentPreview title="Test Post" content="<p>Test content</p>" />
      </ThemeProvider>
    )

    expect(screen.getByText('Test Post')).toBeInTheDocument()
  })

  it('shows status badge', () => {
    render(
      <ThemeProvider theme="luxe">
        <ContentPreview
          title="Test"
          content="<p>Content</p>"
          status="published"
        />
      </ThemeProvider>
    )

    expect(screen.getByText('published')).toBeInTheDocument()
  })
})
