import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { MetricCard } from '../MetricCard'

describe('MetricCard', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <MetricCard label="Test" value={100} />
      </ThemeProvider>
    )
  })
})
