import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { DatePicker } from '../DatePicker'

describe('DatePicker', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <DatePicker value={null} onChange={jest.fn()} />
      </ThemeProvider>
    )
  })
})
