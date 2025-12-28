import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { MediaUpload } from '../MediaUpload'

describe('MediaUpload', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <MediaUpload onUpload={jest.fn().mockResolvedValue([])} />
      </ThemeProvider>
    )
  })
})
