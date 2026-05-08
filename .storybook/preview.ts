import type { Preview } from '@storybook/nextjs-vite';
import '../src/app/globals.css';

const FIGMA_FILE = 'TPytjALjphlR0C6DJGvohU';

export const figmaUrl = (nodeId: string) =>
  `https://www.figma.com/design/${FIGMA_FILE}/REMA-Variable-POC--GitHub-?node-id=${nodeId.replace(':', '-')}`;

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' — show violations in UI only
      // 'error' — fail CI/test on violations
      test: 'todo',
    },
  },
};

export default preview;
