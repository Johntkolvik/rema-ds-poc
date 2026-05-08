import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';
import { figmaUrl } from '../../.storybook/preview';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: figmaUrl('2136:1324'),
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['Primary', 'Secondary', 'Ghost', 'Danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    shape: { control: 'select', options: ['Pill', 'Sharp'] },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Button',
    variant: 'Primary',
    size: 'md',
    shape: 'Pill',
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = { args: { variant: 'Secondary' } };
export const Ghost: Story = { args: { variant: 'Ghost' } };
export const Danger: Story = { args: { variant: 'Danger' } };

export const Sharp: Story = { args: { shape: 'Sharp' } };
export const Disabled: Story = { args: { disabled: true } };

export const Overview: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {(['Primary', 'Secondary', 'Ghost', 'Danger'] as const).map((variant) => (
        <div key={variant}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, color: 'var(--global-text-quaternary)' }}>
            {variant}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button variant={variant} size="sm">SM</Button>
            <Button variant={variant} size="md">MD</Button>
            <Button variant={variant} size="lg">LG</Button>
            <Button variant={variant} size="md" shape="Sharp">Sharp</Button>
            <Button variant={variant} size="md" disabled>Disabled</Button>
          </div>
        </div>
      ))}
    </div>
  ),
};
