import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { RecipeCard } from './RecipeCard';
import { figmaUrl } from '../../.storybook/preview';

const meta = {
  title: 'Components/RecipeCard',
  component: RecipeCard,
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: figmaUrl('2342:8605'),
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    size: 'md',
    category: 'Pasta',
    title: 'Pasta med kylling og kremet saus',
    time: '20 min',
    difficulty: 'Enkel',
    ingredientCount: 10,
    rating: 3.4,
  },
} satisfies Meta<typeof RecipeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Overview: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <RecipeCard size="sm" category="Suppe" title="Tomatsuppe" time="15 min" difficulty="Enkel" ingredientCount={6} rating={4.2} />
      <RecipeCard size="md" category="Pasta" title="Pasta med kylling og kremet saus" time="20 min" difficulty="Enkel" ingredientCount={10} rating={3.4} />
      <RecipeCard size="lg" category="Middag" title="Lasagne med kjøttdeig og bechamel" time="60 min" difficulty="Medium" ingredientCount={14} rating={4.7} />
    </div>
  ),
};
