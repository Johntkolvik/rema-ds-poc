import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProductCard } from './ProductCard';
import { figmaUrl } from '../../.storybook/preview';

const meta = {
  title: 'Components/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: figmaUrl('2170:339'),
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    size: 'md',
    name: 'Coca-Cola Original',
    weight: '1.5L',
    price: 23.9,
    originalPrice: 34.9,
    badge: 'Tilbud',
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoBadge: Story = { args: { badge: undefined, originalPrice: undefined } };
