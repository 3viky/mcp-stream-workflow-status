import { render } from '@testing-library/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { LeaderboardTable } from '../LeaderboardTable'

describe('LeaderboardTable', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme="luxe">
        <LeaderboardTable entries={[{ id: "1", rank: 1, name: "Test", score: 100 }]} />
      </ThemeProvider>
    )
  })
})
