import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { ActivityIndicator } from '../ActivityIndicator'

describe('ActivityIndicator', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <ActivityIndicator status="online" />
      </ThemeProvider>
    )
  })
})
