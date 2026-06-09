import type { Preview } from '@storybook/react-vite'
import '../src/styles/global.css'

const preview: Preview = {
  parameters: {
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