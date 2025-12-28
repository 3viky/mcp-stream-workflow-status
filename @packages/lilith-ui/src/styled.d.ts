/**
 * Styled Components Type Augmentation
 *
 * Extends styled-components DefaultTheme with our ThemeInterface.
 * This allows TypeScript to recognize theme properties in styled components.
 */

import 'styled-components';
import type { ThemeInterface } from '@transftw/theme-provider';

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeInterface {}
}
