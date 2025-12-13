import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { ColorPicker } from '../ColorPicker'

describe('ColorPicker', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <ColorPicker value="#FF0000" onChange={jest.fn()} />
      </ThemeProvider>
    )
  })
})
