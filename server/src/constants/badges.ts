export type BadgeDefinition = {
  id: string;
  name: string;
  description: string;
  target: number;
};

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first-item',
    name: 'İlk Ürün',
    description: 'Dolabına ilk ürününü ekle.',
    target: 1,
  },
  {
    id: 'regular-tracker',
    name: 'Düzenli Takipçi',
    description: '10 ürün ekle.',
    target: 10,
  },
  {
    id: 'waste-preventer',
    name: 'İsraf Önleyici',
    description: 'Son kullanma tarihinden önce 5 ürün tüket.',
    target: 5,
  },
  {
    id: 'list-master',
    name: 'Liste Ustası',
    description: 'Alışveriş listesinden 10 ürün işaretle.',
    target: 10,
  },
  {
    id: 'family-team',
    name: 'Aile Ekibi',
    description: 'Evine bir üye daha katıl.',
    target: 2,
  },
];
