import { Home } from '../models/Home';
import { Membership } from '../models/Membership';
import { PantryLocation } from '../models/PantryLocation';
import { ShoppingList } from '../models/ShoppingList';
import { AppError } from '../middlewares/errorHandler';
import { generateInviteCode, hashToken } from '../utils/tokens';
import type { CreateHomeInput } from '../validations/homeValidation';

const DEFAULT_LOCATIONS: Array<{ name: string; type: 'fridge' | 'freezer' | 'pantry' }> = [
  { name: 'Buzdolabı', type: 'fridge' },
  { name: 'Dondurucu', type: 'freezer' },
  { name: 'Kiler', type: 'pantry' },
];

type HomeSummary = {
  id: string;
  name: string;
  timezone: string;
  defaultCurrency: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
};

// Not: Docker Compose'daki local MongoDB tek node (replica set değil), bu yüzden
// burada Mongoose transaction kullanılmıyor — Atlas'ta da localde de aynı şekilde
// çalışması için sıralı create tercih edildi. Kabul edilen risk: adımlardan biri
// başarısız olursa yarım kalan kayıtlar oluşabilir (MVP için düşük olasılık/etki).
export async function createHome(userId: string, input: CreateHomeInput): Promise<{
  home: HomeSummary;
  inviteCode: string;
}> {
  const { code, codeHash } = generateInviteCode();

  const home = await Home.create({
    name: input.name,
    ownerId: userId,
    inviteCodeHash: codeHash,
    timezone: input.timezone,
    defaultCurrency: input.defaultCurrency,
  });

  await Membership.create({
    homeId: home._id,
    userId,
    role: 'owner',
    status: 'active',
  });

  await PantryLocation.insertMany(
    DEFAULT_LOCATIONS.map((location, index) => ({
      homeId: home._id,
      name: location.name,
      type: location.type,
      order: index,
    })),
  );

  await ShoppingList.create({
    homeId: home._id,
    name: 'Alışveriş Listesi',
    isDefault: true,
  });

  return {
    home: {
      id: home._id.toString(),
      name: home.name,
      timezone: home.timezone,
      defaultCurrency: home.defaultCurrency,
      role: 'owner',
    },
    inviteCode: code,
  };
}

export async function listHomesForUser(userId: string): Promise<HomeSummary[]> {
  const memberships = await Membership.find({ userId, status: 'active' }).populate<{
    homeId: { _id: string; name: string; timezone: string; defaultCurrency: string };
  }>('homeId');

  return memberships
    .filter((membership) => membership.homeId)
    .map((membership) => ({
      id: membership.homeId._id.toString(),
      name: membership.homeId.name,
      timezone: membership.homeId.timezone,
      defaultCurrency: membership.homeId.defaultCurrency,
      role: membership.role,
    }));
}

export async function joinHome(userId: string, inviteCode: string): Promise<HomeSummary> {
  const home = await Home.findOne({ inviteCodeHash: hashToken(inviteCode) });

  if (!home) {
    throw new AppError('Invalid invite code', 404, 'INVALID_INVITE_CODE');
  }

  const existing = await Membership.findOne({ homeId: home._id, userId });

  if (existing && existing.status === 'active') {
    throw new AppError('Already a member of this home', 409, 'ALREADY_MEMBER');
  }

  if (existing) {
    existing.status = 'active';
    existing.role = 'member';
    existing.joinedAt = new Date();
    await existing.save();
  } else {
    await Membership.create({ homeId: home._id, userId, role: 'member', status: 'active' });
  }

  return {
    id: home._id.toString(),
    name: home.name,
    timezone: home.timezone,
    defaultCurrency: home.defaultCurrency,
    role: 'member',
  };
}
