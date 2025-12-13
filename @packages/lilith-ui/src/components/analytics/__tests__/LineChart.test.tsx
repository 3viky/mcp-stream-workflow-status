import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { LineChart } from '../LineChart'

describe('LineChart', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <LineChart data={[{ x: 1, y: 10 }, { x: 2, y: 20 }]} />
      </ThemeProvider>
    )
  })
})
