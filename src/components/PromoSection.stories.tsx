import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PromoSection } from './PromoSection';
import { figmaUrl } from '../../.storybook/preview';

const meta = {
  title: 'Components/PromoSection',
  component: PromoSection,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: figmaUrl('2044:734'),
    },
  },
  argTypes: {
    cardSize: { control: 'select', options: ['sm', 'md', 'lg'] },
    primaryCta: { control: 'object' },
    secondaryCta: { control: 'object' },
    cards: { control: false, table: { disable: true } },
  },
  args: {
    headline: 'Til under 200-lappen',
    body: 'Det er tid for ukens billigste middag – og vi har gjort planleggingen for deg.',
    primaryCta: { label: 'Se ukas oppskrift', href: '#' },
    secondaryCta: { label: 'Alle oppskrifter', href: '#' },
    cardSize: 'md',
  },
} satisfies Meta<typeof PromoSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
