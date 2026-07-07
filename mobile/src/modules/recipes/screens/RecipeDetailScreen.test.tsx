import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { RecipeDetailScreen } from './RecipeDetailScreen';
import { saveRecipe, unsaveRecipe } from '../services/recipeApi';
import { useHomeStore } from '../../../store/useHomeStore';
import type { RecipesStackScreenProps } from '../../../app/navigation/types';

jest.mock('../services/recipeApi');

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
  isSaved: false,
};

function renderScreen(overrides: Partial<typeof recipe> = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <RecipeDetailScreen
        navigation={mockNavigation}
        route={
          { params: { recipe: { ...recipe, ...overrides } } } as RecipesStackScreenProps<'RecipeDetail'>['route']
        }
      />
    </QueryClientProvider>,
  );
}

describe('RecipeDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: 'home-1' });
  });

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

  it('shows "Kaydet" and saves the recipe when pressed', async () => {
    (saveRecipe as jest.Mock).mockResolvedValue(undefined);
    renderScreen({ isSaved: false });

    expect(screen.getByText('Kaydet')).toBeTruthy();
    fireEvent.press(screen.getByTestId('recipe-detail-save-button'));

    await waitFor(() => expect(saveRecipe).toHaveBeenCalledWith('home-1', 'recipe-1'));
    expect(await screen.findByText('Kaydedildi ✓')).toBeTruthy();
  });

  it('shows "Kaydedildi ✓" and unsaves the recipe when pressed', async () => {
    (unsaveRecipe as jest.Mock).mockResolvedValue(undefined);
    renderScreen({ isSaved: true });

    expect(screen.getByText('Kaydedildi ✓')).toBeTruthy();
    fireEvent.press(screen.getByTestId('recipe-detail-save-button'));

    await waitFor(() => expect(unsaveRecipe).toHaveBeenCalledWith('home-1', 'recipe-1'));
    expect(await screen.findByText('Kaydet')).toBeTruthy();
  });
});
