import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

// Brand the sidebar header and make it a link back to the overview page.
// On the combined Vercel deploy, Storybook is served at /storybook/ and the
// overview lives at the root, so the brand link points there.
addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'OGCR Design System — Overview',
    brandUrl: '/',
    brandTarget: '_self',
  }),
});
