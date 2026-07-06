export type RecipeSeedIngredient = { name: string; optional?: boolean };

export type RecipeSeed = {
  name: string;
  category: string;
  ingredients: RecipeSeedIngredient[];
  instructions: string[];
};

export const RECIPES_SEED_DATA: RecipeSeed[] = [
  {
    name: 'Domates Çorbası',
    category: 'Çorba',
    ingredients: [
      { name: 'Domates' },
      { name: 'Soğan' },
      { name: 'Un' },
      { name: 'Tereyağı' },
      { name: 'Tuz' },
      { name: 'Krema', optional: true },
    ],
    instructions: [
      'Soğanı tereyağında kavurun.',
      'Domatesleri ekleyip pişirin.',
      'Un ile kısa süre kavurup su ekleyin, kaynatın.',
      'Tuzunu ayarlayıp isteğe göre krema ile servis edin.',
    ],
  },
  {
    name: 'Mercimek Çorbası',
    category: 'Çorba',
    ingredients: [
      { name: 'Kırmızı Mercimek' },
      { name: 'Soğan' },
      { name: 'Havuç' },
      { name: 'Patates', optional: true },
      { name: 'Tuz' },
    ],
    instructions: [
      'Soğan ve havucu kavurun.',
      'Mercimeği ve suyu ekleyip yumuşayana kadar kaynatın.',
      'Blenderdan geçirip tuzunu ayarlayın.',
    ],
  },
  {
    name: 'Tavuk Sote',
    category: 'Ana Yemek',
    ingredients: [
      { name: 'Tavuk But' },
      { name: 'Soğan' },
      { name: 'Biber' },
      { name: 'Domates' },
      { name: 'Zeytinyağı' },
      { name: 'Tuz' },
    ],
    instructions: [
      'Tavuğu zeytinyağında mühürleyin.',
      'Soğan ve biberi ekleyip kavurun.',
      'Domatesi ekleyip kısık ateşte pişirin.',
    ],
  },
  {
    name: 'Fırın Tavuk But',
    category: 'Ana Yemek',
    ingredients: [
      { name: 'Tavuk But' },
      { name: 'Patates' },
      { name: 'Zeytinyağı' },
      { name: 'Tuz' },
    ],
    instructions: [
      'Tavuk ve patatesleri zeytinyağı ve tuzla harmanlayın.',
      '200 derece fırında altın rengi olana kadar pişirin.',
    ],
  },
  {
    name: 'Kıymalı Makarna',
    category: 'Ana Yemek',
    ingredients: [
      { name: 'Makarna' },
      { name: 'Kıyma' },
      { name: 'Domates' },
      { name: 'Soğan' },
      { name: 'Tuz' },
    ],
    instructions: [
      'Kıymayı soğanla kavurun.',
      'Domatesi ekleyip sos kıvamına gelene kadar pişirin.',
      'Haşlanmış makarna ile karıştırıp servis edin.',
    ],
  },
  {
    name: 'Sade Makarna',
    category: 'Ana Yemek',
    ingredients: [
      { name: 'Makarna' },
      { name: 'Tereyağı' },
      { name: 'Tuz' },
      { name: 'Kaşar Peyniri', optional: true },
    ],
    instructions: [
      'Makarnayı tuzlu suda haşlayın.',
      'Süzüp tereyağıyla karıştırın.',
      'İsteğe göre rendelenmiş kaşar ile servis edin.',
    ],
  },
  {
    name: 'Menemen',
    category: 'Kahvaltı',
    ingredients: [
      { name: 'Yumurta' },
      { name: 'Domates' },
      { name: 'Biber' },
      { name: 'Zeytinyağı' },
      { name: 'Tuz' },
    ],
    instructions: [
      'Biber ve domatesi zeytinyağında kavurun.',
      'Yumurtaları kırıp karıştırarak pişirin.',
      'Tuzunu ekleyip sıcak servis edin.',
    ],
  },
  {
    name: 'Omlet',
    category: 'Kahvaltı',
    ingredients: [
      { name: 'Yumurta' },
      { name: 'Süt', optional: true },
      { name: 'Tuz' },
      { name: 'Kaşar Peyniri', optional: true },
    ],
    instructions: [
      'Yumurtaları süt ve tuzla çırpın.',
      'Yağlanmış tavada pişirin, isteğe göre peynir ekleyin.',
    ],
  },
  {
    name: 'Yoğurtlu Havuç Salatası',
    category: 'Salata',
    ingredients: [
      { name: 'Havuç' },
      { name: 'Yoğurt' },
      { name: 'Sarımsak', optional: true },
      { name: 'Tuz' },
    ],
    instructions: [
      'Havucu rendeleyip hafifçe kavurun.',
      'Yoğurt, sarımsak ve tuzla karıştırıp soğutarak servis edin.',
    ],
  },
  {
    name: 'Çoban Salata',
    category: 'Salata',
    ingredients: [
      { name: 'Domates' },
      { name: 'Salatalık' },
      { name: 'Soğan' },
      { name: 'Zeytinyağı' },
      { name: 'Tuz' },
    ],
    instructions: [
      'Tüm sebzeleri küçük küp doğrayın.',
      'Zeytinyağı ve tuz ile karıştırıp servis edin.',
    ],
  },
  {
    name: 'Pirinç Pilavı',
    category: 'Ana Yemek',
    ingredients: [
      { name: 'Pirinç' },
      { name: 'Tereyağı' },
      { name: 'Tuz' },
      { name: 'Şehriye', optional: true },
    ],
    instructions: [
      'Pirinci yıkayıp süzün.',
      'Tereyağında kavurup su ekleyin.',
      'Kısık ateşte suyunu çekene kadar pişirin.',
    ],
  },
  {
    name: 'Etli Nohut',
    category: 'Ana Yemek',
    ingredients: [
      { name: 'Nohut' },
      { name: 'Kuşbaşı Et' },
      { name: 'Soğan' },
      { name: 'Domates' },
      { name: 'Tuz' },
    ],
    instructions: [
      'Eti soğanla kavurun.',
      'Domates ve nohutu ekleyip su ile kaynatın.',
      'Kısık ateşte pişirip tuzunu ayarlayın.',
    ],
  },
  {
    name: 'Süt Muhallebisi',
    category: 'Tatlı',
    ingredients: [
      { name: 'Süt' },
      { name: 'Şeker' },
      { name: 'Nişasta' },
      { name: 'Vanilya', optional: true },
    ],
    instructions: [
      'Süt, şeker ve nişastayı karıştırın.',
      'Kısık ateşte koyulaşana kadar karıştırarak pişirin.',
      'Kaselere alıp soğutun.',
    ],
  },
  {
    name: 'Peynirli Tost',
    category: 'Kahvaltı',
    ingredients: [
      { name: 'Ekmek' },
      { name: 'Kaşar Peyniri' },
      { name: 'Tereyağı', optional: true },
    ],
    instructions: [
      'Ekmek dilimlerinin arasına peyniri koyun.',
      'Tost makinesinde altın rengi olana kadar pişirin.',
    ],
  },
  {
    name: 'Sebzeli Tavuk Çorbası',
    category: 'Çorba',
    ingredients: [
      { name: 'Tavuk But' },
      { name: 'Havuç' },
      { name: 'Patates' },
      { name: 'Soğan' },
      { name: 'Tuz' },
    ],
    instructions: [
      'Tavuğu suda haşlayıp parçalayın.',
      'Sebzeleri ekleyip yumuşayana kadar kaynatın.',
      'Tuzunu ayarlayıp servis edin.',
    ],
  },
];
