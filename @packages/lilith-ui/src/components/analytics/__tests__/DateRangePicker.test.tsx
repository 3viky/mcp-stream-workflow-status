import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { DateRangePicker } from '../DateRangePicker'

describe('DateRangePicker', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <DateRangePicker value={{ start: new Date(), end: new Date() }} onChange={jest.fn()} />
      </ThemeProvider>
    )
  })
})
