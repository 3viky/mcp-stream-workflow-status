import 'styled-components'
import { ThemeInterface } from '@transftw/theme-provider'

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeInterface {}
}
