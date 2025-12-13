import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { RealtimeCounter } from '../RealtimeCounter'

describe('RealtimeCounter', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <RealtimeCounter value={42} />
      </ThemeProvider>
    )
  })
})
