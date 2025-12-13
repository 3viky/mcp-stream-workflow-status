import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { PresenceAvatar } from '../PresenceAvatar'

describe('PresenceAvatar', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <PresenceAvatar status="online" src="test.jpg" alt="User" />
      </ThemeProvider>
    )
  })
})
