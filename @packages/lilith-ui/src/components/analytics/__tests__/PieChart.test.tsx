import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { PieChart } from '../PieChart'

describe('PieChart', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <PieChart data={[{ label: "A", value: 50 }]} />
      </ThemeProvider>
    )
  })
})
