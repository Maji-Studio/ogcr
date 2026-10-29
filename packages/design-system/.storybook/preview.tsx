import type { Preview } from '@storybook/react-vite'
import '../src/styles/global.css'

const preview: Preview = {
  // Toolbar theme switch. Dark is opt-in via `data-theme="dark"` on <html>
  // (palette.css); there is no OS auto-switch, so the toggle is the only way
  // to see dark in Storybook. In docs mode several stories share one iframe,
  // so the attribute goes on <html> rather than on a per-story wrapper.
  globalTypes: {
    theme: {
      description: 'Colour theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === 'dark' ? 'dark' : 'light'
      document.documentElement.dataset.theme = theme
      return <Story />
    },
  ],

  parameters: {
    options: {
      // Pin the Overview welcome page first, then the conceptual groups.
      storySort: {
        order: ['Overview', 'Foundations', 'Components', 'Modules', '*'],
      },
    },

    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo'  - show a11y violations in the test UI only (current)
      // 'error' - fail CI on a11y violations
      // 'off'   - skip a11y checks entirely
      //
      // Kept at 'todo' until the brand palette clears WCAG AA: several
      // Figma-sourced color tokens (text-secondary on light surfaces, the
      // green interaction-primary on light tints) fail color-contrast and
      // need a design decision. Structural a11y (names, roles, ARIA) is clean.
      // Run the gate manually any time: `npm run test:a11y`.
      test: 'todo'
    }
  },
};

export default preview;