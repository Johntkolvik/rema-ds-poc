import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge } from './Badge';
import { figmaUrl } from '../../.storybook/preview';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: figmaUrl('2154:2660'),
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['Primary', 'Danger', 'Subtle'] },
    children: { control: 'text' },
  },
  args: {
    children: 'Badge',
    variant: 'Primary',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Danger: Story = { args: { variant: 'Danger' } };
export const Subtle: Story = { args: { variant: 'Subtle' } };

export const Overview: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Badge variant="Primary">Primary</Badge>
      <Badge variant="Danger">Danger</Badge>
      <Badge variant="Subtle">Subtle</Badge>
    </div>
  ),
};
