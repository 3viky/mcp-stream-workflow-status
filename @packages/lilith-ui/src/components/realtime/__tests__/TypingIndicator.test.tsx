import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { TypingIndicator } from '../TypingIndicator'

describe('TypingIndicator', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <TypingIndicator  />
      </ThemeProvider>
    )
  })
})
