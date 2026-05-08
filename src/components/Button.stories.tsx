import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from './Button';
import { figmaUrl } from '../../.storybook/preview';

// Simple inline icons available in the controls panel
const ArrowRight = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const ArrowLeft = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
const Plus = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const iconOptions = ['None', 'ArrowRight', 'ArrowLeft', 'Plus'] as const;
const iconMapping = {
  None: undefined,
  ArrowRight,
  ArrowLeft,
  Plus,
};

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
    leftIcon: { control: 'select', options: iconOptions, mapping: iconMapping },
    rightIcon: { control: 'select', options: iconOptions, mapping: iconMapping },
    onClick: { control: false, table: { disable: true } },
    className: { control: false, table: { disable: true } },
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
export const WithIcon: Story = { args: { rightIcon: ArrowRight, children: 'Continue' } };

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
            <Button variant={variant} size="md" rightIcon={ArrowRight}>With icon</Button>
          </div>
        </div>
      ))}
    </div>
  ),
};
