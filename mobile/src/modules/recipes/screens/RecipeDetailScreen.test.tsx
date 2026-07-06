import { render, screen } from '@testing-library/react-native';
import { RecipeDetailScreen } from './RecipeDetailScreen';
import type { RecipesStackScreenProps } from '../../../app/navigation/types';

const mockNavigation = {
  setOptions: jest.fn(),
} as unknown as RecipesStackScreenProps<'RecipeDetail'>['navigation'];

const recipe = {
  id: 'recipe-1',
  name: 'Mercimek Çorbası',
  category: 'Çorba',
  imageUrl: null,
  coveragePercent: 66,
  missingIngredients: ['Havuç'],
  ingredients: [
    { name: 'Kırmızı Mercimek', optional: false },
    { name: 'Soğan', optional: false },
    { name: 'Havuç', optional: false },
  ],
  instructions: ['Sebzeleri kavurun.', 'Kaynatın.'],
};

function renderScreen() {
  return render(
    <RecipeDetailScreen
      navigation={mockNavigation}
      route={{ params: { recipe } } as RecipesStackScreenProps<'RecipeDetail'>['route']}
    />,
  );
}

describe('RecipeDetailScreen', () => {
  it('renders ingredients with missing markers and instructions', () => {
    renderScreen();

    expect(screen.getByText(/Kırmızı Mercimek/)).toBeTruthy();
    expect(screen.getByText(/✗ Havuç/)).toBeTruthy();
    expect(screen.getByText(/✓ Soğan/)).toBeTruthy();
    expect(screen.getByText('Sebzeleri kavurun.')).toBeTruthy();
    expect(screen.getByText('Kaynatın.')).toBeTruthy();
  });

  it('sets the screen title to the recipe name', () => {
    renderScreen();

    expect(mockNavigation.setOptions).toHaveBeenCalledWith({ title: 'Mercimek Çorbası' });
  });
});
