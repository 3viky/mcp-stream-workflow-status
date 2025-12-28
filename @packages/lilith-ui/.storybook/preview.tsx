import type { Preview } from '@storybook/react'
import { ThemeProvider } from '@transftw/theme-provider'
import { createElement } from 'react'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'luxe',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'luxe', title: 'Luxe', icon: 'star' },
          { value: 'cyberpunk', title: 'Cyberpunk', icon: 'lightning' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'luxe'
      return createElement(
        ThemeProvider,
        { theme },
        createElement(Story)
      )
    },
  ],
}

export default preview
