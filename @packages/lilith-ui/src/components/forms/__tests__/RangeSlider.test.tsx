import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { RangeSlider } from '../RangeSlider'

describe('RangeSlider', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <RangeSlider min={0} max={100} value={[25, 75]} onChange={jest.fn()} />
      </ThemeProvider>
    )
  })
})
