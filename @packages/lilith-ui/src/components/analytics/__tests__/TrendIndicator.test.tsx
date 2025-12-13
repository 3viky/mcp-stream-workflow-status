import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { TrendIndicator } from '../TrendIndicator'

describe('TrendIndicator', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <TrendIndicator value={15.5} trend="up" />
      </ThemeProvider>
    )
  })
})
