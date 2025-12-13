import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { PhoneInput } from '../PhoneInput'

describe('PhoneInput', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <PhoneInput value="" onChange={jest.fn()} />
      </ThemeProvider>
    )
  })
})
