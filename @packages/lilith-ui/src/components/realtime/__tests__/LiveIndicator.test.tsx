import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { LiveIndicator } from '../LiveIndicator'

describe('LiveIndicator', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <LiveIndicator  />
      </ThemeProvider>
    )
  })
})
