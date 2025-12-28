import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { BarChart } from '../BarChart'

describe('BarChart', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <BarChart data={[{ label: "A", value: 10 }]} />
      </ThemeProvider>
    )
  })
})
