import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert, Share } from 'react-native';
import { FamilyScreen } from './FamilyScreen';
import { listMembers, regenerateInviteCode, removeMember, type Member } from '../services/familyApi';
import { useHomeStore } from '../../../store/useHomeStore';
import { useAuthStore } from '../../../store/useAuthStore';

jest.mock('../services/familyApi');

const OWNER: Member = {
  membershipId: 'm-1',
  userId: 'user-owner',
  name: 'Ayşe',
  email: 'owner@example.com',
  avatarUrl: null,
  role: 'owner',
  joinedAt: '2026-01-01T00:00:00.000Z',
};

const MEMBER: Member = {
  membershipId: 'm-2',
  userId: 'user-member',
  name: 'Mehmet',
  email: 'member@example.com',
  avatarUrl: null,
  role: 'member',
  joinedAt: '2026-01-02T00:00:00.000Z',
};

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <FamilyScreen />
    </QueryClientProvider>,
  );
}

describe('FamilyScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useHomeStore.setState({ selectedHomeId: 'home-1' });
    useAuthStore.setState({ user: { id: 'user-owner', name: 'Ayşe', email: 'owner@example.com' } });
    (listMembers as jest.Mock).mockResolvedValue([OWNER, MEMBER]);
    jest.spyOn(Share, 'share').mockResolvedValue({ action: 'sharedAction' } as never);
  });

  it('shows the member list with role labels', async () => {
    renderScreen();

    expect(await screen.findByText('Ayşe')).toBeTruthy();
    expect(screen.getByText('Member')).toBeTruthy();
    expect(screen.getByText('member@example.com')).toBeTruthy();
  });

  it('lets an owner remove a non-owner member', async () => {
    (removeMember as jest.Mock).mockResolvedValue(undefined);
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons) => {
      const confirm = buttons?.find((button) => button.text === 'Remove');
      confirm?.onPress?.();
    });
    renderScreen();
    await screen.findByText('Mehmet');

    fireEvent.press(screen.getByText('Remove'));

    await waitFor(() => expect(removeMember).toHaveBeenCalledWith('home-1', 'user-member'));
  });

  it('does not show a remove action for the owner row', async () => {
    renderScreen();

    await screen.findByText('Ayşe');

    expect(screen.queryAllByText('Remove')).toHaveLength(1);
  });

  it('regenerates the invite code and opens the share sheet when Invite is pressed', async () => {
    (regenerateInviteCode as jest.Mock).mockResolvedValue('ABC12345');
    renderScreen();
    await screen.findByText('Ayşe');

    fireEvent.press(screen.getByText('Invite'));

    await waitFor(() => expect(regenerateInviteCode).toHaveBeenCalledWith('home-1'));
    expect(Share.share).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('ABC12345') }),
    );
  });
});
