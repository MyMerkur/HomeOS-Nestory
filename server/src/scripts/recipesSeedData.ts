import type { RecipeCategory } from '../constants/recipe';

export type RecipeSeedIngredient = { name: string; nameEn: string; optional?: boolean };

export type RecipeSeed = {
  name: string;
  nameEn: string;
  category: RecipeCategory;
  ingredients: RecipeSeedIngredient[];
  instructions: string[];
  instructionsEn: string[];
};

export const RECIPES_SEED_DATA: RecipeSeed[] = [
  {
    name: 'Domates Çorbası',
    nameEn: 'Tomato Soup',
    category: 'Soup',
    ingredients: [
      { name: 'Domates', nameEn: 'Tomato' },
      { name: 'Soğan', nameEn: 'Onion' },
      { name: 'Un', nameEn: 'Flour' },
      { name: 'Tereyağı', nameEn: 'Butter' },
      { name: 'Tuz', nameEn: 'Salt' },
      { name: 'Krema', nameEn: 'Cream', optional: true },
    ],
    instructions: [
      'Soğanı tereyağında kavurun.',
      'Domatesleri ekleyip pişirin.',
      'Un ile kısa süre kavurup su ekleyin, kaynatın.',
      'Tuzunu ayarlayıp isteğe göre krema ile servis edin.',
    ],
    instructionsEn: [
      'Sauté the onion in butter.',
      'Add the tomatoes and cook.',
      'Stir in the flour briefly, add water, and bring to a boil.',
      'Season with salt and serve with cream if desired.',
    ],
  },
  {
    name: 'Mercimek Çorbası',
    nameEn: 'Red Lentil Soup',
    category: 'Soup',
    ingredients: [
      { name: 'Kırmızı Mercimek', nameEn: 'Red Lentils' },
      { name: 'Soğan', nameEn: 'Onion' },
      { name: 'Havuç', nameEn: 'Carrot' },
      { name: 'Patates', nameEn: 'Potato', optional: true },
      { name: 'Tuz', nameEn: 'Salt' },
    ],
    instructions: [
      'Soğan ve havucu kavurun.',
      'Mercimeği ve suyu ekleyip yumuşayana kadar kaynatın.',
      'Blenderdan geçirip tuzunu ayarlayın.',
    ],
    instructionsEn: [
      'Sauté the onion and carrot.',
      'Add the lentils and water, and simmer until soft.',
      'Blend until smooth and season with salt.',
    ],
  },
  {
    name: 'Tavuk Sote',
    nameEn: 'Chicken Sauté',
    category: 'Main',
    ingredients: [
      { name: 'Tavuk But', nameEn: 'Chicken Thighs' },
      { name: 'Soğan', nameEn: 'Onion' },
      { name: 'Biber', nameEn: 'Pepper' },
      { name: 'Domates', nameEn: 'Tomato' },
      { name: 'Zeytinyağı', nameEn: 'Olive Oil' },
      { name: 'Tuz', nameEn: 'Salt' },
    ],
    instructions: [
      'Tavuğu zeytinyağında mühürleyin.',
      'Soğan ve biberi ekleyip kavurun.',
      'Domatesi ekleyip kısık ateşte pişirin.',
    ],
    instructionsEn: [
      'Sear the chicken in olive oil.',
      'Add the onion and pepper and sauté.',
      'Add the tomato and cook over low heat.',
    ],
  },
  {
    name: 'Fırın Tavuk But',
    nameEn: 'Baked Chicken Thighs',
    category: 'Main',
    ingredients: [
      { name: 'Tavuk But', nameEn: 'Chicken Thighs' },
      { name: 'Patates', nameEn: 'Potato' },
      { name: 'Zeytinyağı', nameEn: 'Olive Oil' },
      { name: 'Tuz', nameEn: 'Salt' },
    ],
    instructions: [
      'Tavuk ve patatesleri zeytinyağı ve tuzla harmanlayın.',
      '200 derece fırında altın rengi olana kadar pişirin.',
    ],
    instructionsEn: [
      'Toss the chicken and potatoes with olive oil and salt.',
      'Bake at 200°C (400°F) until golden brown.',
    ],
  },
  {
    name: 'Kıymalı Makarna',
    nameEn: 'Pasta with Ground Beef',
    category: 'Main',
    ingredients: [
      { name: 'Makarna', nameEn: 'Pasta' },
      { name: 'Kıyma', nameEn: 'Ground Beef' },
      { name: 'Domates', nameEn: 'Tomato' },
      { name: 'Soğan', nameEn: 'Onion' },
      { name: 'Tuz', nameEn: 'Salt' },
    ],
    instructions: [
      'Kıymayı soğanla kavurun.',
      'Domatesi ekleyip sos kıvamına gelene kadar pişirin.',
      'Haşlanmış makarna ile karıştırıp servis edin.',
    ],
    instructionsEn: [
      'Sauté the ground beef with the onion.',
      'Add the tomato and cook until it reaches a sauce consistency.',
      'Toss with cooked pasta and serve.',
    ],
  },
  {
    name: 'Sade Makarna',
    nameEn: 'Buttered Pasta',
    category: 'Main',
    ingredients: [
      { name: 'Makarna', nameEn: 'Pasta' },
      { name: 'Tereyağı', nameEn: 'Butter' },
      { name: 'Tuz', nameEn: 'Salt' },
      { name: 'Kaşar Peyniri', nameEn: 'Kashar Cheese', optional: true },
    ],
    instructions: [
      'Makarnayı tuzlu suda haşlayın.',
      'Süzüp tereyağıyla karıştırın.',
      'İsteğe göre rendelenmiş kaşar ile servis edin.',
    ],
    instructionsEn: [
      'Boil the pasta in salted water.',
      'Drain and toss with butter.',
      'Serve with grated kashar cheese if desired.',
    ],
  },
  {
    name: 'Menemen',
    nameEn: 'Turkish Scrambled Eggs (Menemen)',
    category: 'Breakfast',
    ingredients: [
      { name: 'Yumurta', nameEn: 'Eggs' },
      { name: 'Domates', nameEn: 'Tomato' },
      { name: 'Biber', nameEn: 'Pepper' },
      { name: 'Zeytinyağı', nameEn: 'Olive Oil' },
      { name: 'Tuz', nameEn: 'Salt' },
    ],
    instructions: [
      'Biber ve domatesi zeytinyağında kavurun.',
      'Yumurtaları kırıp karıştırarak pişirin.',
      'Tuzunu ekleyip sıcak servis edin.',
    ],
    instructionsEn: [
      'Sauté the pepper and tomato in olive oil.',
      'Crack in the eggs and cook while stirring.',
      'Season with salt and serve hot.',
    ],
  },
  {
    name: 'Omlet',
    nameEn: 'Omelet',
    category: 'Breakfast',
    ingredients: [
      { name: 'Yumurta', nameEn: 'Eggs' },
      { name: 'Süt', nameEn: 'Milk', optional: true },
      { name: 'Tuz', nameEn: 'Salt' },
      { name: 'Kaşar Peyniri', nameEn: 'Kashar Cheese', optional: true },
    ],
    instructions: [
      'Yumurtaları süt ve tuzla çırpın.',
      'Yağlanmış tavada pişirin, isteğe göre peynir ekleyin.',
    ],
    instructionsEn: [
      'Whisk the eggs with milk and salt.',
      'Cook in a greased pan, adding cheese if desired.',
    ],
  },
  {
    name: 'Yoğurtlu Havuç Salatası',
    nameEn: 'Carrot Salad with Yogurt',
    category: 'Salad',
    ingredients: [
      { name: 'Havuç', nameEn: 'Carrot' },
      { name: 'Yoğurt', nameEn: 'Yogurt' },
      { name: 'Sarımsak', nameEn: 'Garlic', optional: true },
      { name: 'Tuz', nameEn: 'Salt' },
    ],
    instructions: [
      'Havucu rendeleyip hafifçe kavurun.',
      'Yoğurt, sarımsak ve tuzla karıştırıp soğutarak servis edin.',
    ],
    instructionsEn: [
      'Grate the carrot and sauté it lightly.',
      'Mix with yogurt, garlic, and salt, then chill before serving.',
    ],
  },
  {
    name: 'Çoban Salata',
    nameEn: "Shepherd's Salad",
    category: 'Salad',
    ingredients: [
      { name: 'Domates', nameEn: 'Tomato' },
      { name: 'Salatalık', nameEn: 'Cucumber' },
      { name: 'Soğan', nameEn: 'Onion' },
      { name: 'Zeytinyağı', nameEn: 'Olive Oil' },
      { name: 'Tuz', nameEn: 'Salt' },
    ],
    instructions: [
      'Tüm sebzeleri küçük küp doğrayın.',
      'Zeytinyağı ve tuz ile karıştırıp servis edin.',
    ],
    instructionsEn: [
      'Dice all the vegetables finely.',
      'Toss with olive oil and salt, then serve.',
    ],
  },
  {
    name: 'Pirinç Pilavı',
    nameEn: 'Rice Pilaf',
    category: 'Main',
    ingredients: [
      { name: 'Pirinç', nameEn: 'Rice' },
      { name: 'Tereyağı', nameEn: 'Butter' },
      { name: 'Tuz', nameEn: 'Salt' },
      { name: 'Şehriye', nameEn: 'Vermicelli', optional: true },
    ],
    instructions: [
      'Pirinci yıkayıp süzün.',
      'Tereyağında kavurup su ekleyin.',
      'Kısık ateşte suyunu çekene kadar pişirin.',
    ],
    instructionsEn: [
      'Rinse and drain the rice.',
      'Sauté it in butter, then add water.',
      'Cook over low heat until the water is absorbed.',
    ],
  },
  {
    name: 'Etli Nohut',
    nameEn: 'Chickpea Stew with Beef',
    category: 'Main',
    ingredients: [
      { name: 'Nohut', nameEn: 'Chickpeas' },
      { name: 'Kuşbaşı Et', nameEn: 'Diced Beef' },
      { name: 'Soğan', nameEn: 'Onion' },
      { name: 'Domates', nameEn: 'Tomato' },
      { name: 'Tuz', nameEn: 'Salt' },
    ],
    instructions: [
      'Eti soğanla kavurun.',
      'Domates ve nohutu ekleyip su ile kaynatın.',
      'Kısık ateşte pişirip tuzunu ayarlayın.',
    ],
    instructionsEn: [
      'Sauté the beef with the onion.',
      'Add the tomato and chickpeas, then add water and bring to a boil.',
      'Simmer over low heat and season with salt.',
    ],
  },
  {
    name: 'Süt Muhallebisi',
    nameEn: 'Milk Pudding',
    category: 'Dessert',
    ingredients: [
      { name: 'Süt', nameEn: 'Milk' },
      { name: 'Şeker', nameEn: 'Sugar' },
      { name: 'Nişasta', nameEn: 'Starch' },
      { name: 'Vanilya', nameEn: 'Vanilla', optional: true },
    ],
    instructions: [
      'Süt, şeker ve nişastayı karıştırın.',
      'Kısık ateşte koyulaşana kadar karıştırarak pişirin.',
      'Kaselere alıp soğutun.',
    ],
    instructionsEn: [
      'Mix the milk, sugar, and starch together.',
      'Cook over low heat, stirring, until thickened.',
      'Pour into bowls and chill.',
    ],
  },
  {
    name: 'Peynirli Tost',
    nameEn: 'Cheese Toast',
    category: 'Breakfast',
    ingredients: [
      { name: 'Ekmek', nameEn: 'Bread' },
      { name: 'Kaşar Peyniri', nameEn: 'Kashar Cheese' },
      { name: 'Tereyağı', nameEn: 'Butter', optional: true },
    ],
    instructions: [
      'Ekmek dilimlerinin arasına peyniri koyun.',
      'Tost makinesinde altın rengi olana kadar pişirin.',
    ],
    instructionsEn: [
      'Place the cheese between the bread slices.',
      'Grill in a sandwich press until golden.',
    ],
  },
  {
    name: 'Sebzeli Tavuk Çorbası',
    nameEn: 'Chicken Vegetable Soup',
    category: 'Soup',
    ingredients: [
      { name: 'Tavuk But', nameEn: 'Chicken Thighs' },
      { name: 'Havuç', nameEn: 'Carrot' },
      { name: 'Patates', nameEn: 'Potato' },
      { name: 'Soğan', nameEn: 'Onion' },
      { name: 'Tuz', nameEn: 'Salt' },
    ],
    instructions: [
      'Tavuğu suda haşlayıp parçalayın.',
      'Sebzeleri ekleyip yumuşayana kadar kaynatın.',
      'Tuzunu ayarlayıp servis edin.',
    ],
    instructionsEn: [
      'Boil the chicken in water and shred it.',
      'Add the vegetables and simmer until soft.',
      'Season with salt and serve.',
    ],
  },
{
  "name": "Karnıyarık",
  "nameEn": "Stuffed Eggplant with Ground Beef",
  "category": "Main",
  "ingredients": [
    {
      "name": "Patlıcan",
      "nameEn": "Eggplant"
    },
    {
      "name": "Kıyma",
      "nameEn": "Ground Beef"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Yeşil Biber",
      "nameEn": "Green Pepper"
    },
    {
      "name": "Domates Salçası",
      "nameEn": "Tomato Paste"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Patlıcanları soyup uzunlamasına yarın ve tuzlu suda bekletin.",
    "Zeytinyağında patlıcanları hafifçe kızartın.",
    "Soğan ve sarımsağı kıyma ile birlikte kavurun.",
    "Domates ve yeşil biberi doğrayıp kıymaya ekleyin, domates salçasını karıştırın.",
    "Karışımı patlıcanların ortasına doldurun.",
    "Fırın tepsisine dizip üzerine dilimlenmiş domates koyun.",
    "180 derece fırında 30 dakika pişirin."
  ],
  "instructionsEn": [
    "Peel the eggplants, slit them lengthwise, and soak in salted water.",
    "Lightly fry the eggplants in olive oil.",
    "Sauté the onion and garlic together with the ground beef.",
    "Chop the tomato and green pepper, add to the beef, and stir in the tomato paste.",
    "Spoon the mixture into the center of each eggplant.",
    "Arrange on a baking tray and top with sliced tomato.",
    "Bake at 180°C (350°F) for 30 minutes."
  ]
},
{
  "name": "İzmir Köfte",
  "nameEn": "Izmir-Style Meatballs with Potatoes",
  "category": "Main",
  "ingredients": [
    {
      "name": "Kıyma",
      "nameEn": "Ground Beef"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Galeta Unu",
      "nameEn": "Breadcrumbs"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Patates",
      "nameEn": "Potato"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Domates Salçası",
      "nameEn": "Tomato Paste"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Kıymayı soğan, galeta unu ve yumurta ile yoğurup köfte harcı hazırlayın.",
    "Harçtan parmak şeklinde köfteler şekillendirin.",
    "Köfteleri hafifçe kızartın.",
    "Patatesleri soyup kalın dilimler halinde kesip kızartın.",
    "Köfte ve patatesleri fırın tepsisine dizin.",
    "Domatesi rendeleyip salça ile karıştırın ve üzerine dökün.",
    "180 derece fırında 25 dakika pişirin."
  ],
  "instructionsEn": [
    "Knead the ground beef with onion, breadcrumbs, and egg to make the meatball mixture.",
    "Shape the mixture into finger-shaped meatballs.",
    "Lightly fry the meatballs.",
    "Peel the potatoes, cut into thick slices, and fry.",
    "Arrange the meatballs and potatoes on a baking tray.",
    "Grate the tomato, mix with the tomato paste, and pour over the top.",
    "Bake at 180°C (350°F) for 25 minutes."
  ]
},
{
  "name": "Hünkar Beğendi",
  "nameEn": "Lamb Stew over Smoky Eggplant Purée",
  "category": "Main",
  "ingredients": [
    {
      "name": "Kuzu Kuşbaşı",
      "nameEn": "Cubed Lamb"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Domates Salçası",
      "nameEn": "Tomato Paste"
    },
    {
      "name": "Patlıcan",
      "nameEn": "Eggplant"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Kaşar Peyniri",
      "nameEn": "Kashar Cheese"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    }
  ],
  "instructions": [
    "Soğanı tereyağında kavurup kuzu kuşbaşıyı ekleyin ve etin suyunu salıncaya kadar pişirin.",
    "Domates ve salçayı ilave edip kısık ateşte 40 dakika güveç şeklinde pişirin.",
    "Patlıcanları közleyip kabuklarını soyun ve iyice ezin.",
    "Tereyağını eritip ezilmiş patlıcanı içine ekleyin.",
    "Süt ve rendelenmiş kaşar peynirini katıp pürüzsüz kıvam alana kadar karıştırın.",
    "Beğendiyi tabağa alıp üzerine et yahnisini dökerek servis edin."
  ],
  "instructionsEn": [
    "Sauté the onion in butter, add the cubed lamb, and cook until the meat releases its juices.",
    "Add the tomato and tomato paste, then simmer over low heat as a stew for 40 minutes.",
    "Char-grill the eggplants, peel off the skins, and mash thoroughly.",
    "Melt butter and stir in the mashed eggplant.",
    "Add the milk and grated kashar cheese, stirring until smooth.",
    "Spoon the purée onto plates and top with the lamb stew to serve."
  ]
},
{
  "name": "Izgara Levrek",
  "nameEn": "Grilled Sea Bass",
  "category": "Main",
  "ingredients": [
    {
      "name": "Levrek",
      "nameEn": "Sea Bass"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Kekik",
      "nameEn": "Thyme"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Levrekleri temizleyip iyice yıkayın.",
    "Zeytinyağı, limon suyu, ezilmiş sarımsak ve kekikle balıkları marine edin.",
    "Izgarayı iyice kızdırın.",
    "Balıkları her yüzü altın rengi alana kadar közleyin.",
    "Sıcak servis edin, üzerine limon sıkın."
  ],
  "instructionsEn": [
    "Clean the sea bass and rinse thoroughly.",
    "Marinate the fish in olive oil, lemon juice, crushed garlic, and thyme.",
    "Heat the grill until very hot.",
    "Grill the fish on each side until golden.",
    "Serve hot with a squeeze of lemon."
  ]
},
{
  "name": "Fırında Somon",
  "nameEn": "Baked Salmon with Lemon",
  "category": "Main",
  "ingredients": [
    {
      "name": "Somon Fileto",
      "nameEn": "Salmon Fillet"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Kekik",
      "nameEn": "Thyme"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Fırını 200 dereceye ısıtın.",
    "Somon filetoları fırın tepsisine yerleştirin.",
    "Zeytinyağı, limon suyu, ezilmiş sarımsak ve kekikle üzerini gezdirin.",
    "Tuz ekleyip 15-18 dakika fırınlayın.",
    "Limon dilimleriyle servis edin."
  ],
  "instructionsEn": [
    "Preheat the oven to 200°C (400°F).",
    "Place the salmon fillets on a baking tray.",
    "Drizzle with olive oil, lemon juice, crushed garlic, and thyme.",
    "Season with salt and bake for 15-18 minutes.",
    "Serve with lemon wedges."
  ]
},
{
  "name": "Etli Kuru Fasulye",
  "nameEn": "Beef and White Bean Stew",
  "category": "Main",
  "ingredients": [
    {
      "name": "Kuru Fasulye",
      "nameEn": "Dried White Beans"
    },
    {
      "name": "Kuşbaşı Et",
      "nameEn": "Cubed Beef"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Domates Salçası",
      "nameEn": "Tomato Paste"
    },
    {
      "name": "Biber Salçası",
      "nameEn": "Pepper Paste"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Kuru fasulyeyi bir gece suda bekletin.",
    "Kuşbaşı eti soğanla birlikte zeytinyağında kavurun.",
    "Domates salçası ve biber salçasını ekleyip kavurmaya devam edin.",
    "Fasulyeleri süzüp tencereye ekleyin, üzerini geçecek kadar su koyun.",
    "Kısık ateşte fasulye yumuşayana kadar pişirin.",
    "Tuzunu ayarlayıp sıcak servis edin."
  ],
  "instructionsEn": [
    "Soak the dried beans in water overnight.",
    "Sauté the cubed beef with the onion in olive oil.",
    "Add the tomato paste and pepper paste, continuing to sauté.",
    "Drain the beans, add to the pot, and cover with water.",
    "Simmer over low heat until the beans are tender.",
    "Adjust the salt and serve hot."
  ]
},
{
  "name": "Fırın Kuzu İncik",
  "nameEn": "Oven-Braised Lamb Shanks",
  "category": "Main",
  "ingredients": [
    {
      "name": "Kuzu İncik",
      "nameEn": "Lamb Shank"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Havuç",
      "nameEn": "Carrot"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Domates Salçası",
      "nameEn": "Tomato Paste"
    },
    {
      "name": "Defne Yaprağı",
      "nameEn": "Bay Leaf",
      "optional": true
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Kuzu incikleri zeytinyağında her tarafı kızarana kadar mühürleyin.",
    "Soğan, havuç ve sarımsağı doğrayıp etin yanına ekleyin.",
    "Domates salçası ve defne yaprağını karıştırıp üzerine sıcak su ilave edin.",
    "Fırın tepsisine alıp folyo ile sıkıca kapatın.",
    "160 derece fırında 2,5 saat pişirin.",
    "Sos koyulaşana kadar folyoyu açıp 15 dakika daha pişirin."
  ],
  "instructionsEn": [
    "Sear the lamb shanks in olive oil until browned on all sides.",
    "Chop the onion, carrot, and garlic, and add alongside the meat.",
    "Stir in the tomato paste and bay leaf, then add hot water.",
    "Transfer to a baking dish and cover tightly with foil.",
    "Bake at 160°C (320°F) for 2.5 hours.",
    "Uncover and bake for 15 more minutes until the sauce thickens."
  ]
},
{
  "name": "Tavuk Şiş",
  "nameEn": "Grilled Chicken Skewers",
  "category": "Main",
  "ingredients": [
    {
      "name": "Tavuk Göğsü",
      "nameEn": "Chicken Breast"
    },
    {
      "name": "Yoğurt",
      "nameEn": "Yogurt"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Domates Salçası",
      "nameEn": "Tomato Paste"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Kırmızı Biber",
      "nameEn": "Red Bell Pepper"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Tavuk göğsünü küp küp doğrayın.",
    "Yoğurt, sarımsak, domates salçası ve zeytinyağı ile marine edin.",
    "En az 1 saat buzdolabında dinlendirin.",
    "Tavuk parçalarını kırmızı biberle sırayla şişlere dizin.",
    "Izgarada ara ara çevirerek pişirin.",
    "Sıcak servis edin."
  ],
  "instructionsEn": [
    "Cut the chicken breast into cubes.",
    "Marinate with yogurt, garlic, tomato paste, and olive oil.",
    "Refrigerate for at least 1 hour.",
    "Thread the chicken onto skewers, alternating with red bell pepper.",
    "Grill, turning occasionally, until cooked through.",
    "Serve hot."
  ]
},
{
  "name": "Adana Kebap",
  "nameEn": "Adana-Style Grilled Lamb Kebab",
  "category": "Main",
  "ingredients": [
    {
      "name": "Kuzu Kıyma",
      "nameEn": "Ground Lamb"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes"
    },
    {
      "name": "Kırmızı Biber",
      "nameEn": "Red Bell Pepper",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Soğanı rendeleyip suyunu süzün.",
    "Kuzu kıymayı soğan, pul biber ve tuzla yoğurun.",
    "Harcı dinlendirmek için 30 dakika buzdolabında bekletin.",
    "Harçtan şişlere uzun kebaplar şekillendirin.",
    "Kırmızı biberleri şişe hazırlayın.",
    "Kebapları közde çevirerek pişirin."
  ],
  "instructionsEn": [
    "Grate the onion and drain off the excess liquid.",
    "Knead the ground lamb with the onion, red pepper flakes, and salt.",
    "Rest the mixture in the refrigerator for 30 minutes.",
    "Shape the mixture into long kebabs on skewers.",
    "Prepare the red bell peppers on a skewer.",
    "Grill the kebabs over hot coals, turning occasionally."
  ]
},
{
  "name": "Çoban Kavurma",
  "nameEn": "Shepherd's Sautéed Lamb",
  "category": "Main",
  "ingredients": [
    {
      "name": "Kuzu Kuşbaşı",
      "nameEn": "Cubed Lamb"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Yeşil Biber",
      "nameEn": "Green Pepper"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper",
      "optional": true
    }
  ],
  "instructions": [
    "Kuzu kuşbaşıyı zeytinyağında yüksek ateşte mühürleyin.",
    "Soğanı ekleyip yarı saydamlaşana kadar kavurun.",
    "Doğranmış domates ve yeşil biberi ilave edin.",
    "Kısık ateşte etin suyunu çekene kadar pişirin.",
    "Tuz ve karabiberle tatlandırıp sıcak servis edin."
  ],
  "instructionsEn": [
    "Sear the cubed lamb in olive oil over high heat.",
    "Add the onion and cook until translucent.",
    "Add the chopped tomato and green pepper.",
    "Simmer over low heat until the liquid reduces.",
    "Season with salt and black pepper, then serve hot."
  ]
},
{
  "name": "Karides Güveç",
  "nameEn": "Baked Shrimp Casserole",
  "category": "Main",
  "ingredients": [
    {
      "name": "Karides",
      "nameEn": "Shrimp"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Kaşar Peyniri",
      "nameEn": "Kashar Cheese"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Karidesleri temizleyip zeytinyağında sarımsakla kısaca soteleyin.",
    "Doğranmış domatesleri ekleyip sos koyulaşana kadar pişirin.",
    "Karışımı küçük güveç kaplarına paylaştırın.",
    "Üzerine rendelenmiş kaşar peynirini serpin.",
    "Pul biber ekleyip fırında peynir eriyene kadar pişirin."
  ],
  "instructionsEn": [
    "Clean the shrimp and briefly sauté with garlic in olive oil.",
    "Add the chopped tomatoes and cook until the sauce thickens.",
    "Divide the mixture into small casserole dishes.",
    "Sprinkle grated kashar cheese on top.",
    "Add red pepper flakes and bake until the cheese melts."
  ]
},
{
  "name": "Sebzeli Güveç",
  "nameEn": "Roasted Vegetable Casserole",
  "category": "Main",
  "ingredients": [
    {
      "name": "Patlıcan",
      "nameEn": "Eggplant"
    },
    {
      "name": "Kabak",
      "nameEn": "Zucchini"
    },
    {
      "name": "Patates",
      "nameEn": "Potato"
    },
    {
      "name": "Kırmızı Biber",
      "nameEn": "Red Bell Pepper"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Tüm sebzeleri küp küp doğrayın.",
    "Soğanı zeytinyağında hafifçe kavurun.",
    "Patates ve patlıcanı ekleyip birkaç dakika soteleyin.",
    "Kabak ve kırmızı biberi ilave edin.",
    "Doğranmış domatesi ekleyip güveç kabına alın.",
    "Fırında sebzeler yumuşayana kadar pişirin."
  ],
  "instructionsEn": [
    "Cut all the vegetables into cubes.",
    "Lightly sauté the onion in olive oil.",
    "Add the potato and eggplant, and sauté for a few minutes.",
    "Add the zucchini and red bell pepper.",
    "Add the chopped tomato and transfer to a casserole dish.",
    "Bake until the vegetables are tender."
  ]
},
{
  "name": "Mercimek Köftesi",
  "nameEn": "Red Lentil and Bulgur Patties",
  "category": "Main",
  "ingredients": [
    {
      "name": "Kırmızı Mercimek",
      "nameEn": "Red Lentils"
    },
    {
      "name": "Bulgur",
      "nameEn": "Bulgur"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Domates Salçası",
      "nameEn": "Tomato Paste"
    },
    {
      "name": "Biber Salçası",
      "nameEn": "Pepper Paste"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley",
      "optional": true
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    }
  ],
  "instructions": [
    "Kırmızı mercimeği suda haşlayın.",
    "Sıcak mercimeğin üzerine ince bulguru ekleyip kapağını kapatın ve dinlendirin.",
    "Soğanı zeytinyağında kavurup salçaları ekleyin.",
    "Kavrulan soğanlı harcı mercimekli bulgura karıştırın.",
    "Karışımı yoğurup küçük parçalar halinde şekillendirin.",
    "Üzerine doğranmış maydanoz serpip limonla servis edin."
  ],
  "instructionsEn": [
    "Boil the red lentils in water.",
    "Add the fine bulgur to the hot lentils, cover, and let it rest.",
    "Sauté the onion in olive oil and stir in the pastes.",
    "Mix the sautéed onion mixture into the lentil-bulgur blend.",
    "Knead the mixture and shape into small patties.",
    "Sprinkle with chopped parsley and serve with lemon."
  ]
},
{
  "name": "Patlıcan Musakka",
  "nameEn": "Eggplant Moussaka with Ground Beef",
  "category": "Main",
  "ingredients": [
    {
      "name": "Patlıcan",
      "nameEn": "Eggplant"
    },
    {
      "name": "Kıyma",
      "nameEn": "Ground Beef"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Domates Salçası",
      "nameEn": "Tomato Paste"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Patlıcanları dilimleyip tuzlu suda bekletin, sonra kızartın.",
    "Kıymayı soğanla birlikte zeytinyağında kavurun.",
    "Doğranmış domates ve salçayı ekleyip kısık ateşte pişirin.",
    "Kızarmış patlıcanları fırın kabına dizin.",
    "Üzerine kıymalı sosu yayın.",
    "180 derece fırında 20 dakika pişirin."
  ],
  "instructionsEn": [
    "Slice the eggplants, soak in salted water, then fry.",
    "Sauté the ground beef with the onion in olive oil.",
    "Add the chopped tomato and tomato paste, and simmer over low heat.",
    "Arrange the fried eggplant slices in a baking dish.",
    "Spread the meat sauce over the top.",
    "Bake at 180°C (350°F) for 20 minutes."
  ]
},
{
  "name": "Tas Kebabı",
  "nameEn": "Turkish-Style Beef and Potato Stew",
  "category": "Main",
  "ingredients": [
    {
      "name": "Kuşbaşı Et",
      "nameEn": "Cubed Beef"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Domates Salçası",
      "nameEn": "Tomato Paste"
    },
    {
      "name": "Patates",
      "nameEn": "Potato"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Kuşbaşı eti zeytinyağında kavurun.",
    "Soğan ve sarımsağı ekleyip birlikte kavurmaya devam edin.",
    "Domates salçasını ilave edip üzerine sıcak su ekleyin.",
    "Kısık ateşte et yumuşayana kadar pişirin.",
    "Küp doğranmış patatesleri ekleyip patatesler pişene kadar devam edin.",
    "Tuzunu ayarlayıp servis edin."
  ],
  "instructionsEn": [
    "Sauté the cubed beef in olive oil.",
    "Add the onion and garlic, and continue sautéing together.",
    "Stir in the tomato paste and add hot water.",
    "Simmer over low heat until the meat is tender.",
    "Add the cubed potatoes and cook until they are done.",
    "Adjust the salt and serve."
  ]
},
{
  "name": "Kağıtta Tavuk",
  "nameEn": "Chicken Baked in Parchment",
  "category": "Main",
  "ingredients": [
    {
      "name": "Tavuk Göğsü",
      "nameEn": "Chicken Breast"
    },
    {
      "name": "Kabak",
      "nameEn": "Zucchini"
    },
    {
      "name": "Havuç",
      "nameEn": "Carrot"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Kekik",
      "nameEn": "Thyme",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Tavuk göğsünü ve sebzeleri ince dilimleyin.",
    "Fırın kağıdının üzerine tavuk ve sebzeleri yerleştirin.",
    "Zeytinyağı, limon suyu ve kekikle harmanlayın.",
    "Kağıdı sıkıca paket yapıp kapatın.",
    "200 derece fırında 20 dakika pişirin.",
    "Paketi açmadan sıcak servis edin."
  ],
  "instructionsEn": [
    "Thinly slice the chicken breast and the vegetables.",
    "Arrange the chicken and vegetables on a sheet of parchment paper.",
    "Drizzle with olive oil, lemon juice, and thyme.",
    "Fold and seal the parchment into a tight packet.",
    "Bake at 200°C (400°F) for 20 minutes.",
    "Serve hot, opening the packet at the table."
  ]
},
{
  "name": "Sebzeli Kuskus",
  "nameEn": "Vegetable Couscous",
  "category": "Main",
  "ingredients": [
    {
      "name": "Kuskus",
      "nameEn": "Couscous"
    },
    {
      "name": "Kabak",
      "nameEn": "Zucchini"
    },
    {
      "name": "Havuç",
      "nameEn": "Carrot"
    },
    {
      "name": "Kırmızı Biber",
      "nameEn": "Red Bell Pepper"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Sebze Suyu",
      "nameEn": "Vegetable Broth"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Soğan, havuç ve kırmızı biberi zeytinyağında soteleyin.",
    "Kabağı ekleyip birkaç dakika daha pişirin.",
    "Sebze suyunu ilave edip kaynatın.",
    "Kuskusu ekleyip ocağı kapatın, kapağını örtün.",
    "10 dakika demlendirdikten sonra çatalla karıştırın.",
    "Sıcak servis edin."
  ],
  "instructionsEn": [
    "Sauté the onion, carrot, and red bell pepper in olive oil.",
    "Add the zucchini and cook for a few more minutes.",
    "Pour in the vegetable broth and bring to a boil.",
    "Stir in the couscous, turn off the heat, and cover.",
    "Let it steam for 10 minutes, then fluff with a fork.",
    "Serve hot."
  ]
},
{
  "name": "Chili Con Carne",
  "nameEn": "Chili Con Carne",
  "category": "Main",
  "ingredients": [
    {
      "name": "Kıyma",
      "nameEn": "Ground Beef"
    },
    {
      "name": "Kırmızı Fasulye",
      "nameEn": "Kidney Beans"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Kimyon",
      "nameEn": "Cumin"
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes",
      "optional": true
    },
    {
      "name": "Domates Salçası",
      "nameEn": "Tomato Paste"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Soğan ve sarımsağı kıyma ile birlikte kavurun.",
    "Kimyon ve pul biberi ekleyip baharatları kavurun.",
    "Doğranmış domates ve domates salçasını ilave edin.",
    "Kırmızı fasulyeyi süzüp tencereye ekleyin.",
    "Kısık ateşte 20 dakika kaynatın.",
    "Tuzunu ayarlayıp sıcak servis edin."
  ],
  "instructionsEn": [
    "Sauté the onion and garlic together with the ground beef.",
    "Add the cumin and red pepper flakes and toast briefly.",
    "Stir in the chopped tomato and tomato paste.",
    "Drain the kidney beans and add to the pot.",
    "Simmer over low heat for 20 minutes.",
    "Adjust the salt and serve hot."
  ]
},
{
  "name": "Mantarlı Risotto",
  "nameEn": "Mushroom Risotto",
  "category": "Main",
  "ingredients": [
    {
      "name": "Pirinç",
      "nameEn": "Rice"
    },
    {
      "name": "Mantar",
      "nameEn": "Mushroom"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Sebze Suyu",
      "nameEn": "Vegetable Broth"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Kaşar Peyniri",
      "nameEn": "Kashar Cheese"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Soğanı tereyağında kavurun.",
    "Mantarları ilave edip suyunu salana kadar pişirin.",
    "Pirinci ekleyip yağla harmanlanana kadar karıştırın.",
    "Sıcak sebze suyunu azar azar ekleyerek sürekli karıştırın.",
    "Pirinç yumuşayıp kremamsı kıvam alana kadar pişirmeye devam edin.",
    "Rendelenmiş kaşar peynirini karıştırıp sıcak servis edin."
  ],
  "instructionsEn": [
    "Sauté the onion in butter.",
    "Add the mushrooms and cook until they release their liquid.",
    "Add the rice and stir until coated with the fat.",
    "Add the hot vegetable broth a ladle at a time, stirring constantly.",
    "Continue cooking until the rice is tender and creamy.",
    "Stir in the grated kashar cheese and serve hot."
  ]
},
{
  "name": "Balık Buğulama",
  "nameEn": "Poached Fish with Vegetables",
  "category": "Main",
  "ingredients": [
    {
      "name": "Balık Fileto",
      "nameEn": "Fish Fillet"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Havuç",
      "nameEn": "Carrot"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Tencere tabanına halka doğranmış soğan ve havucu dizin.",
    "Üzerine domates dilimlerini yerleştirin.",
    "Balık filetoları sebzelerin üzerine koyun.",
    "Zeytinyağı ve limon suyunu gezdirin.",
    "Kapağını kapatıp kısık ateşte 15 dakika buğulayın.",
    "Üzerine maydanoz serperek servis edin."
  ],
  "instructionsEn": [
    "Layer the sliced onion and carrot in the bottom of a pot.",
    "Place the tomato slices on top.",
    "Lay the fish fillets over the vegetables.",
    "Drizzle with olive oil and lemon juice.",
    "Cover and gently poach over low heat for 15 minutes.",
    "Sprinkle with parsley and serve."
  ]
},
{
  "name": "Kremalı Mantarlı Tavuk",
  "nameEn": "Creamy Mushroom Chicken",
  "category": "Main",
  "ingredients": [
    {
      "name": "Tavuk Göğsü",
      "nameEn": "Chicken Breast"
    },
    {
      "name": "Mantar",
      "nameEn": "Mushroom"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Krema",
      "nameEn": "Heavy Cream"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Tavuk göğsünü küçük parçalara doğrayın.",
    "Tereyağında tavukları mühürleyip kenara alın.",
    "Aynı tavada soğan, sarımsak ve mantarı soteleyin.",
    "Tavukları tekrar tavaya ekleyin.",
    "Kremayı ilave edip kısık ateşte sos koyulaşana kadar pişirin.",
    "Tuzunu ayarlayıp sıcak servis edin."
  ],
  "instructionsEn": [
    "Cut the chicken breast into small pieces.",
    "Sear the chicken in butter and set aside.",
    "In the same pan, sauté the onion, garlic, and mushrooms.",
    "Return the chicken to the pan.",
    "Add the cream and simmer over low heat until the sauce thickens.",
    "Adjust the salt and serve hot."
  ]
},
{
  "name": "Bamya Yahnisi",
  "nameEn": "Beef and Okra Stew",
  "category": "Main",
  "ingredients": [
    {
      "name": "Bamya",
      "nameEn": "Okra"
    },
    {
      "name": "Kuşbaşı Et",
      "nameEn": "Cubed Beef"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Domates Salçası",
      "nameEn": "Tomato Paste"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon",
      "optional": true
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Kuşbaşı eti zeytinyağında kavurun.",
    "Soğanı ekleyip birlikte kavurmaya devam edin.",
    "Domates ve domates salçasını ilave edin.",
    "Bamyaları temizleyip tencereye ekleyin.",
    "Üzerine su ekleyip kısık ateşte etin ve bamyanın pişmesini bekleyin.",
    "Limon suyu ekleyip birkaç dakika daha pişirin."
  ],
  "instructionsEn": [
    "Sauté the cubed beef in olive oil.",
    "Add the onion and continue sautéing together.",
    "Stir in the tomato and tomato paste.",
    "Trim the okra and add it to the pot.",
    "Add water and simmer over low heat until the meat and okra are tender.",
    "Add the lemon juice and cook for a few more minutes."
  ]
},
{
  "name": "Izgara Pirzola",
  "nameEn": "Grilled Lamb Chops",
  "category": "Main",
  "ingredients": [
    {
      "name": "Kuzu Pirzola",
      "nameEn": "Lamb Chops"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Kekik",
      "nameEn": "Thyme"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper",
      "optional": true
    }
  ],
  "instructions": [
    "Pirzolaları zeytinyağı, ezilmiş sarımsak ve kekikle marine edin.",
    "En az 30 dakika dinlendirin.",
    "Izgarayı iyice kızdırın.",
    "Pirzolaları her yüzü 3-4 dakika olacak şekilde közleyin.",
    "Tuz ve karabiberle tatlandırıp sıcak servis edin."
  ],
  "instructionsEn": [
    "Marinate the lamb chops in olive oil, crushed garlic, and thyme.",
    "Let rest for at least 30 minutes.",
    "Heat the grill until very hot.",
    "Grill the chops for 3-4 minutes per side.",
    "Season with salt and black pepper, then serve hot."
  ]
},
{
  "name": "Tavuk Köri",
  "nameEn": "Chicken Curry",
  "category": "Main",
  "ingredients": [
    {
      "name": "Tavuk But",
      "nameEn": "Chicken Thigh"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Köri Baharatı",
      "nameEn": "Curry Powder"
    },
    {
      "name": "Hindistan Cevizi Sütü",
      "nameEn": "Coconut Milk"
    },
    {
      "name": "Domates Salçası",
      "nameEn": "Tomato Paste"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Tavuk butlarını küp küp doğrayın.",
    "Soğan ve sarımsağı zeytinyağında kavurun.",
    "Köri baharatını ekleyip kısa süre kavurun.",
    "Tavukları ilave edip yüzeyi renk değiştirene kadar pişirin.",
    "Domates salçası ve hindistan cevizi sütünü ekleyin.",
    "Kısık ateşte tavuk yumuşayana kadar pişirin.",
    "Tuzunu ayarlayıp sıcak servis edin."
  ],
  "instructionsEn": [
    "Cut the chicken thighs into cubes.",
    "Sauté the onion and garlic in olive oil.",
    "Add the curry powder and toast briefly.",
    "Add the chicken and cook until it changes color on all sides.",
    "Stir in the tomato paste and coconut milk.",
    "Simmer over low heat until the chicken is tender.",
    "Adjust the salt and serve hot."
  ]
},
{
  "name": "Biftek Stroganof",
  "nameEn": "Beef Stroganoff",
  "category": "Main",
  "ingredients": [
    {
      "name": "Biftek",
      "nameEn": "Beef Steak"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Mantar",
      "nameEn": "Mushroom"
    },
    {
      "name": "Krema",
      "nameEn": "Heavy Cream"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt",
      "optional": true
    }
  ],
  "instructions": [
    "Bifteği ince şeritler halinde doğrayın.",
    "Tereyağında yüksek ateşte kısa sürede mühürleyip kenara alın.",
    "Aynı tavada soğan ve mantarı soteleyin.",
    "Un ekleyip birkaç dakika kavurun.",
    "Kremayı ilave edip sos koyulaşana kadar karıştırın.",
    "Etleri tekrar tavaya ekleyip birlikte ısıtın.",
    "Tuzunu ayarlayıp sıcak servis edin."
  ],
  "instructionsEn": [
    "Cut the beef steak into thin strips.",
    "Sear quickly in butter over high heat and set aside.",
    "In the same pan, sauté the onion and mushrooms.",
    "Add the flour and cook for a few minutes.",
    "Stir in the cream and cook until the sauce thickens.",
    "Return the beef to the pan and heat through together.",
    "Adjust the salt and serve hot."
  ]
},
{
  "name": "Ezogelin Çorbası",
  "nameEn": "Ezogelin Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Kırmızı Mercimek",
      "nameEn": "Red Lentil"
    },
    {
      "name": "Pirinç",
      "nameEn": "Rice"
    },
    {
      "name": "Bulgur",
      "nameEn": "Bulgur"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Domates Salçası",
      "nameEn": "Tomato Paste"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Nane",
      "nameEn": "Mint",
      "optional": true
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Kırmızı mercimek, pirinç ve bulguru yıkayıp süzün.",
    "Soğanı ince ince doğrayıp tereyağında kavurun.",
    "Domates salçasını ekleyip birkaç dakika daha kavurun.",
    "Mercimek, pirinç ve bulguru ekleyip üzerini geçecek kadar su ilave edin, tuzunu ekleyin.",
    "Malzemeler yumuşayana kadar kısık ateşte pişirin, üzerine nane ve pul biber serperek servis yapın."
  ],
  "instructionsEn": [
    "Rinse the red lentils, rice, and bulgur, then drain.",
    "Finely chop the onion and sauté it in the butter.",
    "Stir in the tomato paste and cook for a few more minutes.",
    "Add the lentils, rice, and bulgur, pour in enough water to cover, and season with salt.",
    "Simmer until everything is tender, then serve sprinkled with mint and red pepper flakes."
  ]
},
{
  "name": "Yayla Çorbası",
  "nameEn": "Yogurt and Rice Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Pirinç",
      "nameEn": "Rice"
    },
    {
      "name": "Yoğurt",
      "nameEn": "Yogurt"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Nane",
      "nameEn": "Mint",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Pirinci bol suda yumuşayana kadar haşlayın.",
    "Bir kapta yoğurt, yumurta ve unu çırpın.",
    "Bu karışıma sıcak pirinç suyundan birkaç kaşık ekleyip terbiye yapın.",
    "Terbiyeyi yavaşça tencereye ilave edip kaynatmadan karıştırarak pişirin.",
    "Tereyağını eritip nane ile kavurun, çorbanın üzerine gezdirin."
  ],
  "instructionsEn": [
    "Boil the rice in plenty of water until tender.",
    "In a bowl, whisk together the yogurt, egg, and flour.",
    "Temper this mixture by stirring in a few spoonfuls of the hot rice water.",
    "Slowly pour the tempered mixture back into the pot, stirring constantly without letting it boil.",
    "Melt the butter, fry the mint in it, and drizzle it over the soup."
  ]
},
{
  "name": "Düğün Çorbası",
  "nameEn": "Turkish Wedding Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Kuşbaşı Et",
      "nameEn": "Cubed Beef"
    },
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Kuşbaşı eti bol suda tuzunu ekleyip yumuşayana kadar haşlayın.",
    "Etin suyunu süzüp ayırın, eti didikleyin.",
    "Tereyağında unu kavurup et suyunu yavaşça ekleyerek pürüzsüz bir kıvam elde edin.",
    "Yumurta ve limon suyunu çırpıp bir miktar sıcak çorbayla terbiye edin.",
    "Terbiyeyi çorbaya ekleyip didiklenmiş eti ilave edin, karabiberle tatlandırın.",
    "Üzerine eritilmiş tereyağı ve pul biber gezdirerek servis yapın."
  ],
  "instructionsEn": [
    "Boil the cubed beef in plenty of salted water until tender.",
    "Strain and reserve the broth, then shred the meat.",
    "Melt the butter, whisk in the flour, and gradually add the broth to make a smooth base.",
    "Beat the egg with lemon juice and temper it with a bit of the hot soup.",
    "Stir the tempered mixture back into the soup, add the shredded meat, and season with black pepper.",
    "Serve drizzled with melted butter and red pepper flakes."
  ]
},
{
  "name": "Tarhana Çorbası",
  "nameEn": "Tarhana Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Tarhana",
      "nameEn": "Tarhana"
    },
    {
      "name": "Domates Salçası",
      "nameEn": "Tomato Paste"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Nane",
      "nameEn": "Mint",
      "optional": true
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Tarhanayı bir kapta biraz suyla ezip pürüzsüz hale getirin.",
    "Soğanı ince doğrayıp tereyağında pembeleşene kadar kavurun.",
    "Domates salçasını ekleyip kısa süre kavurun.",
    "Tarhana karışımını ve kalan suyu ilave edip karıştırarak kaynatın.",
    "Kısık ateşte sık sık karıştırarak pişirin ve tuzunu ayarlayın.",
    "Üzerine nane ve pul biber serperek sıcak servis edin."
  ],
  "instructionsEn": [
    "Mash the tarhana with a little water in a bowl until smooth.",
    "Finely chop the onion and sauté it in butter until translucent.",
    "Add the tomato paste and cook briefly.",
    "Stir in the tarhana mixture and the remaining water, then bring to a boil.",
    "Simmer over low heat, stirring often, and adjust the salt.",
    "Serve hot, sprinkled with mint and red pepper flakes."
  ]
},
{
  "name": "Mantar Çorbası",
  "nameEn": "Cream of Mushroom Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Mantar",
      "nameEn": "Mushroom"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Krema",
      "nameEn": "Heavy Cream",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    }
  ],
  "instructions": [
    "Mantarları ince dilimleyin, soğanı küçük küçük doğrayın.",
    "Tereyağında soğanı kavurup mantarları ekleyin, suyunu salıp çekene kadar pişirin.",
    "Unu ekleyip birkaç dakika kavurun.",
    "Süt ilave edip sürekli karıştırarak kıvam alana kadar pişirin.",
    "Tuz ve karabiberle tatlandırın, isteğe göre krema ekleyip servis yapın."
  ],
  "instructionsEn": [
    "Slice the mushrooms thinly and finely chop the onion.",
    "Sauté the onion in butter, add the mushrooms, and cook until they release their liquid and it evaporates.",
    "Stir in the flour and cook for a few minutes.",
    "Add the milk and cook, stirring constantly, until thickened.",
    "Season with salt and pepper, stir in cream if using, and serve."
  ]
},
{
  "name": "İşkembe Çorbası",
  "nameEn": "Tripe Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "İşkembe",
      "nameEn": "Tripe"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Sirke",
      "nameEn": "Vinegar",
      "optional": true
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "İşkembeyi iyice yıkayıp bol suda uzun süre haşlayın.",
    "Haşlanan işkembeyi ince ince doğrayın.",
    "Tereyağında unu kavurup az miktarda soğuk süt ile açın.",
    "İşkembe suyunu ve doğranmış işkembeyi ekleyip karıştırarak kaynatın.",
    "Sütü ilave edip kısık ateşte pişirmeye devam edin, tuzunu ayarlayın.",
    "Sarımsağı sirkeyle ezip ayrı bir kapta servis edin, üzerine pul biber serpin."
  ],
  "instructionsEn": [
    "Wash the tripe thoroughly and simmer it in plenty of water for a long time until tender.",
    "Cut the cooked tripe into thin strips.",
    "Melt the butter, stir in the flour, and loosen it with a little cold milk.",
    "Add the tripe broth and the sliced tripe, stirring as it comes to a boil.",
    "Pour in the milk and continue simmering over low heat, adjusting the salt.",
    "Mash the garlic with vinegar and serve alongside, sprinkling red pepper flakes on top."
  ]
},
{
  "name": "Balık Çorbası",
  "nameEn": "Fish Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Balık",
      "nameEn": "Fish"
    },
    {
      "name": "Havuç",
      "nameEn": "Carrot"
    },
    {
      "name": "Patates",
      "nameEn": "Potato"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Domates Salçası",
      "nameEn": "Tomato Paste"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Balığı temizleyip parçalara ayırın, havuç ve patatesi küp küp doğrayın.",
    "Soğanı zeytinyağında kavurun, domates salçasını ekleyip karıştırın.",
    "Havuç ve patatesi ilave edip birkaç dakika kavurun.",
    "Üzerini geçecek kadar su ekleyip sebzeler yumuşayana kadar pişirin.",
    "Balık parçalarını ekleyip pişene kadar kaynatın.",
    "Tuzunu ayarlayıp isteğe göre limon sıkarak servis yapın."
  ],
  "instructionsEn": [
    "Clean the fish and cut it into pieces; dice the carrot and potato.",
    "Sauté the onion in olive oil, then stir in the tomato paste.",
    "Add the carrot and potato and cook for a few more minutes.",
    "Pour in enough water to cover and cook until the vegetables are tender.",
    "Add the fish pieces and simmer until cooked through.",
    "Adjust the salt and serve with a squeeze of lemon, if desired."
  ]
},
{
  "name": "Karides Çorbası",
  "nameEn": "Shrimp Bisque",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Karides",
      "nameEn": "Shrimp"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Domates Salçası",
      "nameEn": "Tomato Paste"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Krema",
      "nameEn": "Heavy Cream"
    },
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Karidesleri ayıklayıp kabuklarını ayırın.",
    "Tereyağında soğan ve sarımsağı kavurun.",
    "Domates salçasını ekleyip kısa süre kavurun, unu ilave edin.",
    "Su ekleyip karıştırarak kaynatın, karidesleri ilave edin.",
    "Karidesler pişince kremayı ekleyip kısık ateşte birkaç dakika daha pişirin.",
    "Tuzunu ayarlayıp sıcak servis edin."
  ],
  "instructionsEn": [
    "Peel and clean the shrimp.",
    "Sauté the onion and garlic in butter.",
    "Stir in the tomato paste briefly, then add the flour.",
    "Add water, bring to a boil, and stir in the shrimp.",
    "Once the shrimp are cooked, stir in the cream and simmer for a few more minutes.",
    "Adjust the salt and serve hot."
  ]
},
{
  "name": "Nohut Çorbası",
  "nameEn": "Chickpea Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Nohut",
      "nameEn": "Chickpea"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Havuç",
      "nameEn": "Carrot"
    },
    {
      "name": "Domates Salçası",
      "nameEn": "Tomato Paste"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Kimyon",
      "nameEn": "Cumin",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Haşlanmış nohutu süzün, soğan ve havucu küçük küp doğrayın.",
    "Zeytinyağında soğanı kavurup havucu ekleyin.",
    "Domates salçasını ilave edip kısa süre kavurun.",
    "Nohutu ekleyip üzerine su ilave edin.",
    "Kaynadıktan sonra kısık ateşte sebzeler yumuşayana kadar pişirin.",
    "Kimyon ve tuz ile tatlandırıp servis yapın."
  ],
  "instructionsEn": [
    "Drain the cooked chickpeas and finely dice the onion and carrot.",
    "Sauté the onion in olive oil, then add the carrot.",
    "Stir in the tomato paste and cook briefly.",
    "Add the chickpeas along with water.",
    "Once it comes to a boil, simmer over low heat until the vegetables are tender.",
    "Season with cumin and salt, then serve."
  ]
},
{
  "name": "Kuru Fasulye Çorbası",
  "nameEn": "White Bean Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Kuru Fasulye",
      "nameEn": "Dried White Bean"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Havuç",
      "nameEn": "Carrot"
    },
    {
      "name": "Domates Salçası",
      "nameEn": "Tomato Paste"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Kırmızı Toz Biber",
      "nameEn": "Paprika",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Kuru fasulyeyi bir gece önceden suda bekletip haşlayın.",
    "Soğan ve havucu küçük doğrayıp zeytinyağında kavurun.",
    "Domates salçasını ekleyip karıştırın.",
    "Haşlanmış fasulyeyi suyuyla birlikte ilave edin.",
    "Kısık ateşte kaynatarak lezzetlerin birleşmesini sağlayın.",
    "Tuz ve kırmızı toz biberle tatlandırıp servis yapın."
  ],
  "instructionsEn": [
    "Soak the dried beans overnight in water, then boil until tender.",
    "Finely dice the onion and carrot and sauté them in olive oil.",
    "Stir in the tomato paste.",
    "Add the cooked beans along with their cooking liquid.",
    "Simmer over low heat to let the flavors meld.",
    "Season with salt and paprika, then serve."
  ]
},
{
  "name": "Yeşil Mercimek Çorbası",
  "nameEn": "Green Lentil Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Yeşil Mercimek",
      "nameEn": "Green Lentil"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Havuç",
      "nameEn": "Carrot"
    },
    {
      "name": "Patates",
      "nameEn": "Potato"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Kimyon",
      "nameEn": "Cumin",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Yeşil mercimeği yıkayıp süzün.",
    "Soğan, havuç ve patatesi küçük küp doğrayın.",
    "Zeytinyağında soğanı kavurup diğer sebzeleri ekleyin.",
    "Mercimeği ilave edip üzerine su ekleyin.",
    "Mercimek ve sebzeler yumuşayana kadar kısık ateşte pişirin.",
    "Blenderdan geçirip kimyon ve tuzla tatlandırarak servis yapın."
  ],
  "instructionsEn": [
    "Rinse the green lentils and drain.",
    "Dice the onion, carrot, and potato.",
    "Sauté the onion in olive oil, then add the other vegetables.",
    "Stir in the lentils and add water.",
    "Simmer over low heat until the lentils and vegetables are tender.",
    "Blend until smooth, season with cumin and salt, and serve."
  ]
},
{
  "name": "Tavuk Şehriye Çorbası",
  "nameEn": "Chicken Noodle Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Tavuk But",
      "nameEn": "Chicken Thigh"
    },
    {
      "name": "Şehriye",
      "nameEn": "Vermicelli Noodles"
    },
    {
      "name": "Havuç",
      "nameEn": "Carrot"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    }
  ],
  "instructions": [
    "Tavuk butlarını soğanla birlikte bol suda haşlayın.",
    "Tavuğu sudan çıkarıp kemiklerinden ayırıp didikleyin, suyunu süzün.",
    "Havucu küçük küp doğrayıp süzülen tavuk suyunda pişirin.",
    "Şehriyeyi ekleyip yumuşayana kadar kaynatın.",
    "Didiklenmiş tavuğu tekrar tencereye ekleyin.",
    "Tereyağını eritip çorbaya ilave edin, tuz ve karabiberle tatlandırın."
  ],
  "instructionsEn": [
    "Boil the chicken thighs with the onion in plenty of water.",
    "Remove the chicken, debone and shred it, and strain the broth.",
    "Dice the carrot and cook it in the strained chicken broth.",
    "Add the noodles and boil until tender.",
    "Return the shredded chicken to the pot.",
    "Melt the butter and stir it in, then season with salt and pepper."
  ]
},
{
  "name": "Brokoli Çorbası",
  "nameEn": "Broccoli Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Brokoli",
      "nameEn": "Broccoli"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Patates",
      "nameEn": "Potato"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Krema",
      "nameEn": "Heavy Cream",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Brokoliyi çiçeklerine ayırıp yıkayın, patatesi küp küp doğrayın.",
    "Tereyağında soğanı kavurun.",
    "Patates ve brokoliyi ekleyip üzerine su ilave edin.",
    "Sebzeler yumuşayana kadar pişirin.",
    "Karışımı blenderdan geçirip pürüzsüz hale getirin.",
    "Süt ekleyip kısa süre daha pişirin, tuzunu ayarlayıp isteğe göre krema ile servis yapın."
  ],
  "instructionsEn": [
    "Cut the broccoli into florets and rinse; dice the potato.",
    "Sauté the onion in butter.",
    "Add the potato and broccoli, then pour in water.",
    "Cook until the vegetables are tender.",
    "Blend the mixture until smooth.",
    "Stir in the milk and simmer briefly, adjust the salt, and serve with a drizzle of cream if desired."
  ]
},
{
  "name": "Kabak Çorbası",
  "nameEn": "Zucchini Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Kabak",
      "nameEn": "Zucchini"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Patates",
      "nameEn": "Potato"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Süt",
      "nameEn": "Milk",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    }
  ],
  "instructions": [
    "Kabak ve patatesi soyup küp küp doğrayın.",
    "Soğanı zeytinyağında kavurun.",
    "Kabak ve patatesi ekleyip birkaç dakika kavurun.",
    "Üzerine su ekleyip sebzeler yumuşayana kadar pişirin.",
    "Karışımı blenderdan geçirin.",
    "İsteğe göre süt ekleyip tuz ve karabiberle tatlandırarak servis yapın."
  ],
  "instructionsEn": [
    "Peel and dice the zucchini and potato.",
    "Sauté the onion in olive oil.",
    "Add the zucchini and potato and cook for a few minutes.",
    "Pour in water and cook until the vegetables are tender.",
    "Blend the mixture until smooth.",
    "Stir in milk if using, season with salt and pepper, and serve."
  ]
},
{
  "name": "Ispanak Çorbası",
  "nameEn": "Spinach Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Ispanak",
      "nameEn": "Spinach"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Patates",
      "nameEn": "Potato"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Yoğurt",
      "nameEn": "Yogurt",
      "optional": true
    },
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Soğanı zeytinyağında kavurun.",
    "Küp doğranmış patatesi ekleyip birlikte kavurun.",
    "Ispanağı yıkayıp ekleyin, hafifçe pörtük hale gelene kadar karıştırın.",
    "Un ilave edip kısa süre kavurun, üzerine su ekleyin.",
    "Sebzeler yumuşayana kadar pişirip blenderdan geçirin.",
    "Tuzunu ayarlayıp isteğe göre yoğurtla servis yapın."
  ],
  "instructionsEn": [
    "Sauté the onion in olive oil.",
    "Add the diced potato and cook together.",
    "Rinse the spinach, add it in, and stir until slightly wilted.",
    "Stir in the flour and cook briefly, then add water.",
    "Cook until the vegetables are tender, then blend until smooth.",
    "Adjust the salt and serve with a dollop of yogurt, if desired."
  ]
},
{
  "name": "Havuç Çorbası",
  "nameEn": "Carrot Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Havuç",
      "nameEn": "Carrot"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Patates",
      "nameEn": "Potato"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Süt",
      "nameEn": "Milk",
      "optional": true
    },
    {
      "name": "Zencefil",
      "nameEn": "Ginger",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Havuç ve patatesi soyup küp küp doğrayın.",
    "Soğanı tereyağında kavurun.",
    "Havuç ve patatesi ekleyip birkaç dakika kavurun.",
    "Üzerine su ekleyip sebzeler yumuşayana kadar pişirin.",
    "Karışımı blenderdan geçirip pürüzsüz hale getirin.",
    "İsteğe göre süt ve rendelenmiş zencefil ekleyip tuzla tatlandırarak servis yapın."
  ],
  "instructionsEn": [
    "Peel and dice the carrot and potato.",
    "Sauté the onion in butter.",
    "Add the carrot and potato and cook for a few minutes.",
    "Pour in water and cook until the vegetables are tender.",
    "Blend the mixture until smooth.",
    "Stir in milk and grated ginger if using, season with salt, and serve."
  ]
},
{
  "name": "Mısır Çorbası",
  "nameEn": "Corn Chowder",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Mısır",
      "nameEn": "Corn"
    },
    {
      "name": "Patates",
      "nameEn": "Potato"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    }
  ],
  "instructions": [
    "Soğanı tereyağında kavurun.",
    "Küp doğranmış patatesi ekleyip birlikte kavurun.",
    "Mısır tanelerini ilave edin, unu serpip karıştırın.",
    "Üzerine su ekleyip sebzeler yumuşayana kadar pişirin.",
    "Sütü ekleyip kısık ateşte kıvam alana kadar pişirin.",
    "Tuz ve karabiberle tatlandırıp sıcak servis edin."
  ],
  "instructionsEn": [
    "Sauté the onion in butter.",
    "Add the diced potato and cook together.",
    "Stir in the corn kernels and sprinkle in the flour.",
    "Add water and cook until the vegetables are tender.",
    "Pour in the milk and simmer until thickened.",
    "Season with salt and pepper and serve hot."
  ]
},
{
  "name": "Kremalı Sebze Çorbası",
  "nameEn": "Creamy Mixed Vegetable Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Havuç",
      "nameEn": "Carrot"
    },
    {
      "name": "Kabak",
      "nameEn": "Zucchini"
    },
    {
      "name": "Patates",
      "nameEn": "Potato"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Krema",
      "nameEn": "Heavy Cream"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Havuç, kabak ve patatesi küp küp doğrayın.",
    "Soğanı tereyağında kavurun.",
    "Doğranmış sebzeleri ekleyip birkaç dakika kavurun.",
    "Üzerine su ekleyip sebzeler yumuşayana kadar pişirin.",
    "Karışımı blenderdan geçirip pürüzsüz hale getirin.",
    "Kremayı ekleyip karıştırın, tuzunu ayarlayıp servis yapın."
  ],
  "instructionsEn": [
    "Dice the carrot, zucchini, and potato.",
    "Sauté the onion in butter.",
    "Add the diced vegetables and cook for a few minutes.",
    "Pour in water and cook until the vegetables are tender.",
    "Blend the mixture until smooth.",
    "Stir in the cream, adjust the salt, and serve."
  ]
},
{
  "name": "Un Çorbası",
  "nameEn": "Toasted Flour Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    }
  ],
  "instructions": [
    "Tereyağını tencerede eritin.",
    "Unu ekleyip kızarmadan, kokusu çıkana kadar kavurun.",
    "Üzerine yavaş yavaş su ekleyip topaklanmaması için sürekli karıştırın.",
    "Sütü ilave edip kısık ateşte kıvam alana kadar pişirin.",
    "İsteğe göre çırpılmış yumurtayı ekleyip karıştırın.",
    "Tuz ve karabiberle tatlandırıp sıcak servis edin."
  ],
  "instructionsEn": [
    "Melt the butter in a pot.",
    "Add the flour and toast it until fragrant, without letting it brown too much.",
    "Gradually pour in water, stirring constantly to prevent lumps.",
    "Add the milk and simmer until thickened.",
    "Stir in a beaten egg, if using.",
    "Season with salt and pepper and serve hot."
  ]
},
{
  "name": "Ayran Aşı Çorbası",
  "nameEn": "Minted Yogurt and Chickpea Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Yoğurt",
      "nameEn": "Yogurt"
    },
    {
      "name": "Nohut",
      "nameEn": "Chickpea"
    },
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Nane",
      "nameEn": "Mint",
      "optional": true
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Nohutu haşlayıp süzün.",
    "Bir kapta yoğurt, yumurta ve unu pürüzsüz olana kadar çırpın.",
    "Karışıma azar azar su ekleyerek inceltin.",
    "Tencereye alıp sürekli karıştırarak kaynatmadan ısıtın.",
    "Haşlanmış nohutu ekleyip birkaç dakika pişirin.",
    "Tereyağını eritip kuru nane ile kavurun, çorbanın üzerine gezdirerek servis yapın."
  ],
  "instructionsEn": [
    "Boil the chickpeas and drain.",
    "In a bowl, whisk together the yogurt, egg, and flour until smooth.",
    "Gradually thin the mixture with water.",
    "Transfer to a pot and heat gently, stirring constantly, without letting it boil.",
    "Add the boiled chickpeas and cook for a few more minutes.",
    "Melt the butter, fry the dried mint in it, and drizzle over the soup before serving."
  ]
},
{
  "name": "Kremalı Tavuk Çorbası",
  "nameEn": "Cream of Chicken Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Tavuk Göğsü",
      "nameEn": "Chicken Breast"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Krema",
      "nameEn": "Heavy Cream",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    }
  ],
  "instructions": [
    "Tavuk göğsünü haşlayıp didikleyin, suyunu ayırın.",
    "Soğanı tereyağında kavurun.",
    "Unu ekleyip birkaç dakika kavurun.",
    "Tavuk suyunu yavaş yavaş ekleyerek pürüzsüz bir kıvam elde edin.",
    "Sütü ilave edip kısık ateşte kaynatın.",
    "Didiklenmiş tavuğu ekleyip tuz ve karabiberle tatlandırın, isteğe göre krema ile servis yapın."
  ],
  "instructionsEn": [
    "Boil the chicken breast, shred it, and reserve the broth.",
    "Sauté the onion in butter.",
    "Stir in the flour and cook for a few minutes.",
    "Gradually add the chicken broth, stirring to keep it smooth.",
    "Pour in the milk and simmer over low heat.",
    "Add the shredded chicken, season with salt and pepper, and serve with a swirl of cream if desired."
  ]
},
{
  "name": "Patates Çorbası",
  "nameEn": "Potato Leek Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Patates",
      "nameEn": "Potato"
    },
    {
      "name": "Pırasa",
      "nameEn": "Leek"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    }
  ],
  "instructions": [
    "Patates, pırasa ve soğanı küçük parçalar halinde doğrayın.",
    "Tereyağında soğan ve pırasayı yumuşayana kadar kavurun.",
    "Patatesi ekleyip birkaç dakika kavurun.",
    "Üzerine su ekleyip patatesler yumuşayana kadar pişirin.",
    "Karışımı blenderdan geçirip pürüzsüz hale getirin.",
    "Sütü ekleyip kısa süre daha pişirin, tuz ve karabiberle tatlandırıp servis yapın."
  ],
  "instructionsEn": [
    "Chop the potato, leek, and onion into small pieces.",
    "Sauté the onion and leek in butter until softened.",
    "Add the potato and cook for a few more minutes.",
    "Pour in water and cook until the potatoes are tender.",
    "Blend the mixture until smooth.",
    "Stir in the milk and simmer briefly, season with salt and pepper, and serve."
  ]
},
{
  "name": "Pancar Çorbası",
  "nameEn": "Beet and Vegetable Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Pancar",
      "nameEn": "Beet"
    },
    {
      "name": "Havuç",
      "nameEn": "Carrot"
    },
    {
      "name": "Patates",
      "nameEn": "Potato"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Yoğurt",
      "nameEn": "Yogurt",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Pancar, havuç ve patatesi soyup küp küp doğrayın.",
    "Soğanı zeytinyağında kavurun.",
    "Doğranmış sebzeleri ekleyip birlikte kavurun.",
    "Üzerine su ekleyip sebzeler yumuşayana kadar pişirin.",
    "İsteğe göre karışımı blenderdan geçirin.",
    "Tuzunu ayarlayıp bir kaşık yoğurtla servis yapın."
  ],
  "instructionsEn": [
    "Peel and dice the beet, carrot, and potato.",
    "Sauté the onion in olive oil.",
    "Add the diced vegetables and cook together.",
    "Pour in water and cook until the vegetables are tender.",
    "Blend the mixture until smooth, if desired.",
    "Adjust the salt and serve with a spoonful of yogurt."
  ]
},
{
  "name": "Minestrone Çorbası",
  "nameEn": "Minestrone",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Kuru Fasulye",
      "nameEn": "Dried White Bean"
    },
    {
      "name": "Makarna",
      "nameEn": "Pasta"
    },
    {
      "name": "Havuç",
      "nameEn": "Carrot"
    },
    {
      "name": "Patates",
      "nameEn": "Potato"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Havuç, patates ve domatesi küçük küp doğrayın.",
    "Soğanı zeytinyağında kavurun.",
    "Havuç ve patatesi ekleyip birkaç dakika kavurun.",
    "Domatesi ve haşlanmış fasulyeyi ilave edin, üzerine su ekleyin.",
    "Sebzeler yumuşamaya başlayınca makarnayı ekleyin.",
    "Makarna pişene kadar kaynatıp tuzunu ayarlayarak servis yapın."
  ],
  "instructionsEn": [
    "Dice the carrot, potato, and tomato.",
    "Sauté the onion in olive oil.",
    "Add the carrot and potato and cook for a few minutes.",
    "Stir in the tomato and cooked beans, then add water.",
    "Once the vegetables start to soften, add the pasta.",
    "Boil until the pasta is cooked, adjust the salt, and serve."
  ]
},
{
  "name": "Miso Çorbası",
  "nameEn": "Miso Soup",
  "category": "Soup",
  "ingredients": [
    {
      "name": "Miso Ezmesi",
      "nameEn": "Miso Paste"
    },
    {
      "name": "Tofu",
      "nameEn": "Tofu"
    },
    {
      "name": "Yeşil Soğan",
      "nameEn": "Green Onion"
    },
    {
      "name": "Deniz Yosunu",
      "nameEn": "Seaweed",
      "optional": true
    }
  ],
  "instructions": [
    "Tofuyu küçük küpler halinde doğrayın.",
    "Bir tencerede suyu ısıtın, kaynamadan hemen önce ocaktan azaltın.",
    "Bir kepçe sıcak suyla miso ezmesini pürüzsüz olana kadar karıştırın.",
    "Miso karışımını tencereye ekleyip yavaşça karıştırın.",
    "Tofu küplerini ve ıslatılmış deniz yosununu ekleyin.",
    "İnce doğranmış yeşil soğanla süsleyip hemen servis edin."
  ],
  "instructionsEn": [
    "Cut the tofu into small cubes.",
    "Heat water in a pot and reduce the heat just before it boils.",
    "Whisk the miso paste with a ladle of the hot water until smooth.",
    "Stir the miso mixture back into the pot gently.",
    "Add the tofu cubes and softened seaweed.",
    "Garnish with sliced green onion and serve immediately."
  ]
},
{
  "name": "Çılbır",
  "nameEn": "Turkish Poached Eggs with Garlic Yogurt",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Yoğurt",
      "nameEn": "Yogurt"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes"
    },
    {
      "name": "Sirke",
      "nameEn": "Vinegar"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Kuru Nane",
      "nameEn": "Dried Mint",
      "optional": true
    }
  ],
  "instructions": [
    "Yoğurdu sarımsak ve tuzla karıştırıp bir kaseye alın.",
    "Geniş bir tencerede su kaynatıp içine sirke ekleyin.",
    "Yumurtaları teker teker kaynayan suya kırarak 3 dakika haşlayın.",
    "Süzgeç kepçeyle alıp yoğurdun üzerine yerleştirin.",
    "Tereyağını eritip pul biberle karıştırın ve yumurtaların üzerine gezdirin.",
    "Üzerine kuru nane serperek sıcak servis edin."
  ],
  "instructionsEn": [
    "Stir the yogurt with the garlic and salt in a bowl.",
    "Bring a wide pot of water to a boil and add the vinegar.",
    "Crack the eggs one at a time into the simmering water and poach for 3 minutes.",
    "Lift them out with a slotted spoon and arrange over the yogurt.",
    "Melt the butter, stir in the red pepper flakes, and drizzle over the eggs.",
    "Sprinkle with dried mint and serve hot."
  ]
},
{
  "name": "Sahanda Yumurta",
  "nameEn": "Sunny-Side-Up Eggs",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    },
    {
      "name": "Kaşar Peyniri",
      "nameEn": "Kashar Cheese",
      "optional": true
    },
    {
      "name": "Domates",
      "nameEn": "Tomato",
      "optional": true
    }
  ],
  "instructions": [
    "Küçük bir tavada tereyağını kızdırın.",
    "Yumurtaları kırıp tavaya nazikçe bırakın.",
    "Üzerine tuz ve karabiber serpin.",
    "İsterseniz üzerine rendelenmiş kaşar peyniri ekleyin.",
    "Beyazlar pişip sarısı sulu kalana kadar kısık ateşte pişirip domates dilimleriyle servis edin."
  ],
  "instructionsEn": [
    "Heat the butter in a small pan.",
    "Crack the eggs gently into the pan.",
    "Season with salt and black pepper.",
    "If you like, top with grated kashar cheese.",
    "Cook over low heat until the whites are set but the yolk is still runny, and serve with tomato slices."
  ]
},
{
  "name": "Sucuklu Yumurta",
  "nameEn": "Eggs with Turkish Sausage",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Sucuk",
      "nameEn": "Turkish Sausage (Sucuk)"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato",
      "optional": true
    }
  ],
  "instructions": [
    "Sucuğu ince dilimleyip tavada tereyağıyla kavurun.",
    "Yağı çıkan sucuğun üzerine yumurtaları kırın.",
    "Üzerine karabiber serpip yumurta akı pişene kadar pişirin.",
    "Sıcak olarak, yanına domates dilimleriyle servis edin."
  ],
  "instructionsEn": [
    "Slice the sucuk thinly and fry it in butter in a pan.",
    "Crack the eggs over the sucuk once it releases its oil.",
    "Season with black pepper and cook until the egg whites are set.",
    "Serve hot alongside tomato slices."
  ]
},
{
  "name": "Pastırmalı Yumurta",
  "nameEn": "Eggs with Pastırma",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Pastırma",
      "nameEn": "Pastırma (Cured Beef)"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    },
    {
      "name": "Kaşar Peyniri",
      "nameEn": "Kashar Cheese",
      "optional": true
    }
  ],
  "instructions": [
    "Tavada tereyağını kızdırın.",
    "Pastırma dilimlerini ekleyip hafifçe kızartın.",
    "Üzerine yumurtaları kırıp karabiber serperek pişirin.",
    "İsteğe bağlı rendelenmiş kaşar peyniri ekleyip eriyene kadar pişirip sıcak servis edin."
  ],
  "instructionsEn": [
    "Heat the butter in a pan.",
    "Add the pastırma slices and fry briefly.",
    "Crack the eggs on top, season with black pepper, and cook.",
    "Stir in optional grated kashar cheese, let it melt, and serve hot."
  ]
},
{
  "name": "Poğaça",
  "nameEn": "Turkish Savory Buns",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Yoğurt",
      "nameEn": "Yogurt"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Kabartma Tozu",
      "nameEn": "Baking Powder"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Beyaz Peynir",
      "nameEn": "Feta Cheese"
    },
    {
      "name": "Susam",
      "nameEn": "Sesame Seeds",
      "optional": true
    }
  ],
  "instructions": [
    "Yoğurt, eritilmiş tereyağı, yumurta, tuz ve kabartma tozunu bir kapta karıştırın.",
    "Unu azar azar ekleyip yumuşak bir hamur yoğurun.",
    "Hamurdan küçük parçalar koparıp içine beyaz peynir koyarak yuvarlayın.",
    "Yağlı kağıt serili tepsiye dizin.",
    "Üzerlerine yumurta sarısı sürüp isteğe bağlı susam serpin.",
    "Önceden ısıtılmış fırında üzerleri altın rengi olana kadar pişirin."
  ],
  "instructionsEn": [
    "Mix the yogurt, melted butter, egg, salt, and baking powder in a bowl.",
    "Gradually add the flour and knead into a soft dough.",
    "Pinch off small pieces of dough, fill each with feta cheese, and roll into balls.",
    "Arrange them on a parchment-lined baking tray.",
    "Brush the tops with egg yolk and sprinkle with optional sesame seeds.",
    "Bake in a preheated oven until golden on top."
  ]
},
{
  "name": "Peynirli Gözleme",
  "nameEn": "Cheese-Stuffed Gözleme",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Beyaz Peynir",
      "nameEn": "Feta Cheese"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    }
  ],
  "instructions": [
    "Un, su ve tuzu yoğurup yumuşak bir hamur elde edin.",
    "Hamuru bezelere ayırıp dinlendirin.",
    "Her bezeyi ince yufka haline gelene kadar açın.",
    "Beyaz peynir ve maydanozu karıştırıp yufkanın yarısına yayın.",
    "Yufkayı katlayıp kenarlarını bastırarak kapatın.",
    "Sıcak sacda her iki tarafına tereyağı sürerek kızarana kadar pişirin."
  ],
  "instructionsEn": [
    "Knead the flour, water, and salt into a soft dough.",
    "Divide the dough into balls and let rest.",
    "Roll out each ball into a thin sheet.",
    "Mix the feta cheese with parsley and spread it over half of the sheet.",
    "Fold the sheet over and press the edges to seal.",
    "Cook on a hot griddle, brushing both sides with butter, until golden."
  ]
},
{
  "name": "Amerikan Pankek",
  "nameEn": "Fluffy American Pancakes",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Kabartma Tozu",
      "nameEn": "Baking Powder"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Akçaağaç Şurubu",
      "nameEn": "Maple Syrup",
      "optional": true
    }
  ],
  "instructions": [
    "Un, şeker, kabartma tozu ve tuzu bir kapta karıştırın.",
    "Ayrı bir kapta yumurta ve sütü çırpın.",
    "Islak karışımı kuru karışıma ekleyip pürüzsüz bir hamur elde edene kadar karıştırın.",
    "Tavayı orta ateşte ısıtıp tereyağı sürün, bir kepçe hamuru dökün.",
    "Yüzeyinde kabarcıklar oluşunca ters çevirip pişirin ve isteğe bağlı akçaağaç şurubuyla servis edin."
  ],
  "instructionsEn": [
    "Mix the flour, sugar, baking powder, and salt in a bowl.",
    "In a separate bowl, whisk together the egg and milk.",
    "Pour the wet mixture into the dry mixture and stir until just smooth.",
    "Heat a pan over medium heat, grease with butter, and pour in a ladle of batter.",
    "Flip once bubbles form on the surface, cook through, and serve with optional maple syrup."
  ]
},
{
  "name": "Belçika Waffle'ı",
  "nameEn": "Belgian Waffles",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Kabartma Tozu",
      "nameEn": "Baking Powder"
    },
    {
      "name": "Vanilya",
      "nameEn": "Vanilla Extract",
      "optional": true
    },
    {
      "name": "Bal",
      "nameEn": "Honey",
      "optional": true
    }
  ],
  "instructions": [
    "Un, şeker ve kabartma tozunu bir kapta karıştırın.",
    "Yumurta, süt, eritilmiş tereyağı ve isteğe bağlı vanilyayı ayrı bir kapta çırpın.",
    "Islak karışımı kuru karışıma ekleyip topaksız bir hamur hazırlayın.",
    "Waffle makinesini ısıtıp yağlayın ve hamuru dökerek talimatlara göre pişirin.",
    "Altın rengi ve gevrek olunca çıkarıp isteğe bağlı bal ile servis edin."
  ],
  "instructionsEn": [
    "Mix the flour, sugar, and baking powder in a bowl.",
    "In a separate bowl, whisk together the egg, milk, melted butter, and optional vanilla extract.",
    "Combine the wet and dry mixtures into a smooth, lump-free batter.",
    "Heat and grease the waffle iron, then pour in the batter and cook according to the manufacturer's instructions.",
    "Remove once golden and crisp, and serve with optional honey."
  ]
},
{
  "name": "Fransız Tostu",
  "nameEn": "French Toast",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Ekmek",
      "nameEn": "Bread"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Tarçın",
      "nameEn": "Cinnamon"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Bal",
      "nameEn": "Honey",
      "optional": true
    }
  ],
  "instructions": [
    "Yumurta, süt, şeker ve tarçını bir kapta çırpın.",
    "Ekmek dilimlerini bu karışıma her iki tarafını da batırarak iyice emdirin.",
    "Tavada tereyağını eritin.",
    "Islanmış ekmek dilimlerini tavaya alıp her iki tarafını altın rengi olana kadar pişirin.",
    "Sıcak olarak isteğe bağlı bal gezdirerek servis edin."
  ],
  "instructionsEn": [
    "Whisk together the egg, milk, sugar, and cinnamon in a bowl.",
    "Dip the bread slices into the mixture, soaking both sides well.",
    "Melt the butter in a pan.",
    "Cook the soaked bread slices until golden brown on both sides.",
    "Serve hot, drizzled with optional honey."
  ]
},
{
  "name": "Yulaf Lapası",
  "nameEn": "Oatmeal Porridge",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Yulaf",
      "nameEn": "Oats"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Bal",
      "nameEn": "Honey"
    },
    {
      "name": "Muz",
      "nameEn": "Banana",
      "optional": true
    },
    {
      "name": "Tarçın",
      "nameEn": "Cinnamon",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Sütü tencerede kaynatın.",
    "Yulafı ve bir tutam tuzu ekleyip karıştırarak kısık ateşte koyulaşana kadar pişirin.",
    "Ateşten alıp üzerine bal gezdirin.",
    "İsteğe bağlı dilimlenmiş muz ve tarçınla servis edin."
  ],
  "instructionsEn": [
    "Bring the milk to a boil in a saucepan.",
    "Add the oats and a pinch of salt, and simmer over low heat, stirring, until thickened.",
    "Remove from heat and drizzle with honey.",
    "Serve with optional sliced banana and a dash of cinnamon."
  ]
},
{
  "name": "Müsli Kase",
  "nameEn": "Yogurt Muesli Bowl",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Yulaf",
      "nameEn": "Oats"
    },
    {
      "name": "Yoğurt",
      "nameEn": "Yogurt"
    },
    {
      "name": "Bal",
      "nameEn": "Honey"
    },
    {
      "name": "Ceviz",
      "nameEn": "Walnut"
    },
    {
      "name": "Çilek",
      "nameEn": "Strawberry"
    },
    {
      "name": "Kuru Üzüm",
      "nameEn": "Raisins",
      "optional": true
    }
  ],
  "instructions": [
    "Yulafı yoğurtla karıştırıp bir kaseye alın.",
    "Üzerine dilimlenmiş çilek, ceviz ve isteğe bağlı kuru üzüm ekleyin.",
    "Üzerine bal gezdirerek servis edin."
  ],
  "instructionsEn": [
    "Mix the oats with the yogurt and transfer to a bowl.",
    "Top with sliced strawberries, walnuts, and optional raisins.",
    "Drizzle with honey and serve."
  ]
},
{
  "name": "Chia Puding",
  "nameEn": "Chia Seed Pudding",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Chia Tohumu",
      "nameEn": "Chia Seeds"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Bal",
      "nameEn": "Honey"
    },
    {
      "name": "Çilek",
      "nameEn": "Strawberry",
      "optional": true
    },
    {
      "name": "Muz",
      "nameEn": "Banana",
      "optional": true
    },
    {
      "name": "Vanilya",
      "nameEn": "Vanilla Extract",
      "optional": true
    }
  ],
  "instructions": [
    "Chia tohumlarını süt, bal ve isteğe bağlı vanilyayla bir kavanozda karıştırın.",
    "Karışımı buzdolabında en az 4 saat, tercihen bir gece bekletin.",
    "Kıvamı pelte gibi olduğunda karıştırıp kaselere paylaştırın.",
    "Üzerine isteğe bağlı dilimlenmiş çilek ve muz ekleyerek servis edin."
  ],
  "instructionsEn": [
    "Combine the chia seeds, milk, honey, and optional vanilla extract in a jar.",
    "Refrigerate for at least 4 hours, preferably overnight.",
    "Once thickened to a pudding-like consistency, stir and divide into bowls.",
    "Top with optional sliced strawberries and banana before serving."
  ]
},
{
  "name": "Ev Yapımı Granola Kase",
  "nameEn": "Homemade Granola Bowl",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Yulaf",
      "nameEn": "Oats"
    },
    {
      "name": "Bal",
      "nameEn": "Honey"
    },
    {
      "name": "Ceviz",
      "nameEn": "Walnut"
    },
    {
      "name": "Kuru Üzüm",
      "nameEn": "Raisins"
    },
    {
      "name": "Tarçın",
      "nameEn": "Cinnamon"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Yoğurt",
      "nameEn": "Yogurt"
    }
  ],
  "instructions": [
    "Yulaf, ceviz ve tarçını bir kapta karıştırın.",
    "Üzerine bal ve zeytinyağını ekleyip iyice harmanlayın.",
    "Karışımı fırın tepsisine ince bir şekilde yayın.",
    "Önceden ısıtılmış fırında ara ara karıştırarak altın rengi olana kadar kavurun.",
    "Soğuyunca kuru üzümü karıştırıp yoğurtla birlikte servis edin."
  ],
  "instructionsEn": [
    "Mix the oats, walnuts, and cinnamon in a bowl.",
    "Add the honey and olive oil and toss thoroughly.",
    "Spread the mixture in a thin layer on a baking tray.",
    "Bake in a preheated oven, stirring occasionally, until golden.",
    "Once cooled, mix in the raisins and serve with yogurt."
  ]
},
{
  "name": "Bal Kaymak",
  "nameEn": "Honey and Clotted Cream",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Kaymak",
      "nameEn": "Clotted Cream"
    },
    {
      "name": "Bal",
      "nameEn": "Honey"
    },
    {
      "name": "Ceviz",
      "nameEn": "Walnut",
      "optional": true
    },
    {
      "name": "Ekmek",
      "nameEn": "Bread"
    }
  ],
  "instructions": [
    "Kaymağı servis tabağına yayın.",
    "Üzerine bolca bal gezdirin.",
    "İsteğe bağlı çekilmiş ceviz serperek yanında ekmekle servis edin."
  ],
  "instructionsEn": [
    "Spread the clotted cream on a serving plate.",
    "Drizzle generously with honey.",
    "Sprinkle with optional crushed walnuts and serve with bread."
  ]
},
{
  "name": "Avokadolu Tost",
  "nameEn": "Avocado Toast",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Ekmek",
      "nameEn": "Bread"
    },
    {
      "name": "Avokado",
      "nameEn": "Avocado"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg",
      "optional": true
    }
  ],
  "instructions": [
    "Ekmek dilimlerini kızartın.",
    "Avokadoyu çatalla ezip üzerine limon suyu ve tuz ekleyin.",
    "Ezilmiş avokadoyu kızarmış ekmeğe yayın.",
    "Üzerine zeytinyağı gezdirip pul biber serpin.",
    "İsteğe bağlı olarak üzerine çırpılmış veya sahanda pişmiş bir yumurta ekleyerek servis edin."
  ],
  "instructionsEn": [
    "Toast the bread slices.",
    "Mash the avocado with a fork and mix in lemon juice and salt.",
    "Spread the mashed avocado over the toasted bread.",
    "Drizzle with olive oil and sprinkle with red pepper flakes.",
    "Optionally top with a scrambled or fried egg before serving."
  ]
},
{
  "name": "Somon Ekmek",
  "nameEn": "Smoked Salmon Toast",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Ekmek",
      "nameEn": "Bread"
    },
    {
      "name": "Füme Somon",
      "nameEn": "Smoked Salmon"
    },
    {
      "name": "Krem Peynir",
      "nameEn": "Cream Cheese"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Dereotu",
      "nameEn": "Dill",
      "optional": true
    },
    {
      "name": "Kırmızı Soğan",
      "nameEn": "Red Onion",
      "optional": true
    }
  ],
  "instructions": [
    "Ekmek dilimlerine bolca krem peynir sürün.",
    "Üzerine füme somon dilimlerini yerleştirin.",
    "İsteğe bağlı ince doğranmış kırmızı soğan ve dereotu serpin.",
    "Üzerine birkaç damla limon suyu sıkarak servis edin."
  ],
  "instructionsEn": [
    "Spread a generous layer of cream cheese on the bread slices.",
    "Arrange the smoked salmon slices on top.",
    "Sprinkle with optional finely chopped red onion and dill.",
    "Finish with a squeeze of lemon juice and serve."
  ]
},
{
  "name": "İngiliz Kahvaltı Tabağı",
  "nameEn": "Full English Breakfast Plate",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Sosis",
      "nameEn": "Sausage"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Mantar",
      "nameEn": "Mushroom"
    },
    {
      "name": "Konserve Fasulye",
      "nameEn": "Baked Beans"
    },
    {
      "name": "Ekmek",
      "nameEn": "Bread"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    }
  ],
  "instructions": [
    "Sosisleri tavada arada çevirerek pişirin.",
    "Aynı tavada mantar ve ikiye kesilmiş domatesleri kısa süre kavurun.",
    "Konserve fasulyeyi küçük bir tencerede ısıtın.",
    "Ayrı bir tavada tereyağıyla yumurtaları sahanda pişirin.",
    "Ekmek dilimlerini kızartın.",
    "Tüm malzemeleri büyük bir tabakta bir araya getirerek sıcak servis edin."
  ],
  "instructionsEn": [
    "Cook the sausages in a pan, turning occasionally.",
    "In the same pan, briefly sauté the mushrooms and halved tomatoes.",
    "Warm the baked beans in a small saucepan.",
    "In a separate pan, fry the eggs in butter.",
    "Toast the bread slices.",
    "Arrange everything together on a large plate and serve hot."
  ]
},
{
  "name": "Kahvaltı Burritosu",
  "nameEn": "Breakfast Burrito",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Tortilla",
      "nameEn": "Tortilla Wrap"
    },
    {
      "name": "Kaşar Peyniri",
      "nameEn": "Kashar Cheese"
    },
    {
      "name": "Sucuk",
      "nameEn": "Turkish Sausage (Sucuk)"
    },
    {
      "name": "Kırmızı Biber",
      "nameEn": "Red Bell Pepper"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    }
  ],
  "instructions": [
    "Soğan ve kırmızı biberi zeytinyağında kavurun.",
    "Sucuğu ekleyip birlikte biraz daha pişirin.",
    "Çırpılmış yumurtaları ilave edip karıştırarak pişirin.",
    "Tortillayı ısıtıp üzerine karışımı ve rendelenmiş kaşar peynirini yerleştirin.",
    "Tortillayı sıkıca sarıp ikiye keserek servis edin."
  ],
  "instructionsEn": [
    "Sauté the onion and red bell pepper in olive oil.",
    "Add the sucuk and cook a bit longer together.",
    "Pour in the beaten eggs and scramble until cooked.",
    "Warm the tortilla, then spoon the filling and grated kashar cheese onto it.",
    "Roll the tortilla up tightly, cut in half, and serve."
  ]
},
{
  "name": "Ispanaklı Peynirli Krep",
  "nameEn": "Savory Spinach and Cheese Crepes",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Ispanak",
      "nameEn": "Spinach"
    },
    {
      "name": "Beyaz Peynir",
      "nameEn": "Feta Cheese"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Un, yumurta, süt ve tuzu çırparak akıcı bir krep hamuru hazırlayın.",
    "Ispanağı yıkayıp ince kıyın ve beyaz peynirle karıştırın.",
    "Tavayı hafifçe tereyağlayıp bir kepçe hamuru dökerek ince bir krep pişirin.",
    "Krebin bir yarısına ıspanaklı peynir harcını yerleştirin.",
    "Krebi katlayarak harcı içine kapatın.",
    "Her iki tarafını hafifçe kızartarak sıcak servis edin."
  ],
  "instructionsEn": [
    "Whisk the flour, egg, milk, and salt into a smooth, pourable batter.",
    "Wash and finely chop the spinach, then mix it with the feta cheese.",
    "Lightly butter a pan and pour in a ladle of batter to cook a thin crepe.",
    "Place the spinach and cheese filling on one half of the crepe.",
    "Fold the crepe over to enclose the filling.",
    "Lightly crisp both sides and serve hot."
  ]
},
{
  "name": "Bagel ve Krem Peynir",
  "nameEn": "Bagel with Cream Cheese",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Bagel",
      "nameEn": "Bagel"
    },
    {
      "name": "Krem Peynir",
      "nameEn": "Cream Cheese"
    },
    {
      "name": "Salatalık",
      "nameEn": "Cucumber"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Kırmızı Soğan",
      "nameEn": "Red Onion",
      "optional": true
    }
  ],
  "instructions": [
    "Bageli ortadan ikiye kesip kızartın.",
    "İki yarısına da bolca krem peynir sürün.",
    "Üzerine ince dilimlenmiş salatalık ve domates yerleştirin.",
    "İsteğe bağlı kırmızı soğan ekleyerek servis edin."
  ],
  "instructionsEn": [
    "Slice the bagel in half and toast it.",
    "Spread a generous layer of cream cheese on both halves.",
    "Top with thinly sliced cucumber and tomato.",
    "Add optional red onion and serve."
  ]
},
{
  "name": "Türk Kahvaltı Tabağı",
  "nameEn": "Turkish Breakfast Spread",
  "category": "Breakfast",
  "ingredients": [
    {
      "name": "Beyaz Peynir",
      "nameEn": "Feta Cheese"
    },
    {
      "name": "Kaşar Peyniri",
      "nameEn": "Kashar Cheese"
    },
    {
      "name": "Zeytin",
      "nameEn": "Olives"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Salatalık",
      "nameEn": "Cucumber"
    },
    {
      "name": "Bal",
      "nameEn": "Honey"
    },
    {
      "name": "Kaymak",
      "nameEn": "Clotted Cream"
    },
    {
      "name": "Ekmek",
      "nameEn": "Bread"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    }
  ],
  "instructions": [
    "Beyaz peynir ve kaşar peynirini dilimleyip servis tabağına yerleştirin.",
    "Domates ve salatalığı dilimleyerek tabağa ekleyin.",
    "Zeytinleri küçük bir kaseye koyup tabağın kenarına yerleştirin.",
    "Bal ve kaymağı yan yana bir tabakta sunup yanına tereyağı ve ekmekle servis edin."
  ],
  "instructionsEn": [
    "Slice the feta and kashar cheeses and arrange them on a serving platter.",
    "Add sliced tomatoes and cucumbers to the platter.",
    "Place the olives in a small bowl at the edge of the platter.",
    "Serve the honey and clotted cream side by side, along with butter and bread."
  ]
},
{
  "name": "Mercimek Salatası",
  "nameEn": "Red Lentil Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Kırmızı Mercimek",
      "nameEn": "Red Lentil"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Kırmızı mercimeği yıkayıp yumuşayana kadar haşlayın ve süzün.",
    "Soğanı ince ince doğrayıp az tuzla ovarak acılığını giderin.",
    "Domatesi küçük küpler halinde doğrayın.",
    "Haşlanmış mercimeği, soğanı, domatesi ve doğranmış maydanozu geniş bir kapta karıştırın.",
    "Üzerine zeytinyağı ve limon suyu gezdirin, tuz ve pul biberle tatlandırın.",
    "İyice karıştırıp servis edin."
  ],
  "instructionsEn": [
    "Rinse the red lentils and boil until tender, then drain.",
    "Finely chop the onion and rub with a little salt to soften its sharpness.",
    "Dice the tomato into small cubes.",
    "In a large bowl, combine the cooked lentils, onion, tomato, and chopped parsley.",
    "Drizzle with olive oil and lemon juice, then season with salt and red pepper flakes.",
    "Toss well and serve."
  ]
},
{
  "name": "Roka ve Parmesanlı Salata",
  "nameEn": "Arugula and Parmesan Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Roka",
      "nameEn": "Arugula"
    },
    {
      "name": "Parmesan Peyniri",
      "nameEn": "Parmesan Cheese"
    },
    {
      "name": "Ceviz",
      "nameEn": "Walnut"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    }
  ],
  "instructions": [
    "Rokayı yıkayıp kurulayın ve geniş bir servis tabağına yerleştirin.",
    "Parmesan peynirini ince dilimler halinde rendeleyin veya soyun.",
    "Cevizleri kabaca kırın.",
    "Rokanın üzerine parmesan ve cevizleri serpiştirin.",
    "Zeytinyağı ve limon suyunu karıştırıp salatanın üzerine gezdirin.",
    "Tuz ve karabiber ekleyip hemen servis edin."
  ],
  "instructionsEn": [
    "Wash and dry the arugula, then arrange it on a large serving plate.",
    "Shave or grate the Parmesan cheese into thin curls.",
    "Roughly crush the walnuts.",
    "Scatter the Parmesan and walnuts over the arugula.",
    "Whisk together the olive oil and lemon juice, then drizzle over the salad.",
    "Season with salt and pepper and serve immediately."
  ]
},
{
  "name": "Nohutlu Salata",
  "nameEn": "Chickpea Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Nohut",
      "nameEn": "Chickpea"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Salatalık",
      "nameEn": "Cucumber"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Haşlanmış nohutları süzüp geniş bir kaba alın.",
    "Domates ve salatalığı küçük küpler halinde doğrayın.",
    "Soğanı ince kıyın, maydanozu doğrayın.",
    "Tüm sebzeleri nohutla birlikte karıştırın.",
    "Zeytinyağı, limon suyu ve tuzu ekleyip iyice harmanlayın.",
    "Buzdolabında biraz dinlendirip servis edin."
  ],
  "instructionsEn": [
    "Drain the cooked chickpeas and place them in a large bowl.",
    "Dice the tomato and cucumber into small cubes.",
    "Finely chop the onion and parsley.",
    "Combine all the vegetables with the chickpeas.",
    "Add the olive oil, lemon juice, and salt, then toss thoroughly.",
    "Chill briefly in the refrigerator before serving."
  ]
},
{
  "name": "Tavuklu Sezar Salata",
  "nameEn": "Chicken Caesar Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Tavuk Göğsü",
      "nameEn": "Chicken Breast"
    },
    {
      "name": "Marul",
      "nameEn": "Lettuce"
    },
    {
      "name": "Parmesan Peyniri",
      "nameEn": "Parmesan Cheese"
    },
    {
      "name": "Kruton",
      "nameEn": "Crouton"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Tavuk göğsünü tuzlayıp az zeytinyağıyla iki tarafı da altın rengi olana kadar pişirin.",
    "Pişen tavuğu dilimleyin.",
    "Marulu yıkayıp iri parçalar halinde doğrayın.",
    "Ezilmiş sarımsağı zeytinyağı ve limon suyuyla karıştırıp sos hazırlayın.",
    "Marulu sosla harmanlayın, üzerine tavuk dilimlerini yerleştirin.",
    "Kruton ve rendelenmiş parmesan peyniriyle süsleyip servis edin."
  ],
  "instructionsEn": [
    "Season the chicken breast with salt and cook in a little olive oil until golden on both sides.",
    "Slice the cooked chicken.",
    "Wash the lettuce and tear it into large pieces.",
    "Whisk crushed garlic with olive oil and lemon juice to make the dressing.",
    "Toss the lettuce with the dressing, then top with the sliced chicken.",
    "Garnish with croutons and grated Parmesan cheese and serve."
  ]
},
{
  "name": "Ton Balıklı Salata",
  "nameEn": "Tuna Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Ton Balığı",
      "nameEn": "Tuna"
    },
    {
      "name": "Mısır",
      "nameEn": "Corn"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Ton balığının suyunu süzün ve bir kaseye alıp çatalla dağıtın.",
    "Mısırı, ince doğranmış soğanı ve domatesi ekleyin.",
    "Doğranmış maydanozu karışıma katın.",
    "Zeytinyağı, limon suyu ve tuzla tatlandırın.",
    "Tüm malzemeleri hafifçe karıştırın.",
    "Soğuk olarak servis edin."
  ],
  "instructionsEn": [
    "Drain the tuna and flake it with a fork into a bowl.",
    "Add the corn, finely chopped onion, and tomato.",
    "Stir in the chopped parsley.",
    "Season with olive oil, lemon juice, and salt.",
    "Gently toss all the ingredients together.",
    "Serve chilled."
  ]
},
{
  "name": "Kinoa Salatası",
  "nameEn": "Quinoa Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Kinoa",
      "nameEn": "Quinoa"
    },
    {
      "name": "Salatalık",
      "nameEn": "Cucumber"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Nane",
      "nameEn": "Mint"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Beyaz Peynir",
      "nameEn": "Feta Cheese",
      "optional": true
    }
  ],
  "instructions": [
    "Kinoayı yıkayıp suda haşlayın, süzüp soğumaya bırakın.",
    "Salatalık ve domatesi küçük küpler halinde doğrayın.",
    "Nane ve maydanozu ince kıyın.",
    "Soğuyan kinoayı sebzeler ve otlarla karıştırın.",
    "Zeytinyağı, limon suyu ve tuz ekleyip harmanlayın.",
    "İsteğe bağlı olarak ufalanmış beyaz peynir serpip servis edin."
  ],
  "instructionsEn": [
    "Rinse the quinoa and boil until tender, then drain and let it cool.",
    "Dice the cucumber and tomato into small cubes.",
    "Finely chop the mint and parsley.",
    "Combine the cooled quinoa with the vegetables and herbs.",
    "Add the olive oil, lemon juice, and salt, then toss well.",
    "Optionally sprinkle with crumbled feta cheese before serving."
  ]
},
{
  "name": "Patates Salatası",
  "nameEn": "Potato Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Patates",
      "nameEn": "Potato"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Taze Soğan",
      "nameEn": "Green Onion"
    },
    {
      "name": "Mayonez",
      "nameEn": "Mayonnaise"
    },
    {
      "name": "Hardal",
      "nameEn": "Mustard"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    }
  ],
  "instructions": [
    "Patatesleri kabuklarıyla haşlayıp soyun ve küp küp doğrayın.",
    "Yumurtaları haşlayıp soyun, küçük parçalar halinde kesin.",
    "Taze soğanı ince ince doğrayın.",
    "Patates, yumurta ve taze soğanı geniş bir kapta birleştirin.",
    "Mayonez ve hardalı ekleyip nazikçe karıştırın.",
    "Tuz ve karabiberle tatlandırıp soğuk servis edin."
  ],
  "instructionsEn": [
    "Boil the potatoes with their skins on, then peel and cut into cubes.",
    "Boil the eggs, peel them, and cut into small pieces.",
    "Finely chop the green onion.",
    "Combine the potatoes, eggs, and green onion in a large bowl.",
    "Add the mayonnaise and mustard, then gently fold together.",
    "Season with salt and pepper and serve chilled."
  ]
},
{
  "name": "Karides Salatası",
  "nameEn": "Shrimp Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Karides",
      "nameEn": "Shrimp"
    },
    {
      "name": "Marul",
      "nameEn": "Lettuce"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Avokado",
      "nameEn": "Avocado"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Karidesleri temizleyip sarımsaklı zeytinyağında pişirin.",
    "Marulu yıkayıp doğrayın.",
    "Domatesi dilimleyin, avokadoyu küp küp doğrayın.",
    "Marul, domates ve avokadoyu bir kapta birleştirin.",
    "Pişmiş karidesleri üzerine ekleyin.",
    "Zeytinyağı, limon suyu ve tuzla harmanlayıp servis edin."
  ],
  "instructionsEn": [
    "Clean the shrimp and sauté them in garlic-infused olive oil.",
    "Wash and chop the lettuce.",
    "Slice the tomato and cube the avocado.",
    "Combine the lettuce, tomato, and avocado in a bowl.",
    "Add the cooked shrimp on top.",
    "Drizzle with olive oil and lemon juice, season with salt, and serve."
  ]
},
{
  "name": "Çilekli Ispanak Salatası",
  "nameEn": "Strawberry Spinach Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Ispanak",
      "nameEn": "Spinach"
    },
    {
      "name": "Çilek",
      "nameEn": "Strawberry"
    },
    {
      "name": "Badem",
      "nameEn": "Almond"
    },
    {
      "name": "Beyaz Peynir",
      "nameEn": "Feta Cheese",
      "optional": true
    },
    {
      "name": "Balzamik Sirke",
      "nameEn": "Balsamic Vinegar"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Bal",
      "nameEn": "Honey"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Taze ıspanak yapraklarını yıkayıp kurulayın.",
    "Çilekleri dilimleyin.",
    "Ispanak ve çilekleri geniş bir salata kabında birleştirin.",
    "Kavrulmuş bademleri ve isteğe bağlı ufalanmış beyaz peyniri ekleyin.",
    "Balzamik sirke, zeytinyağı, bal ve tuzu çırpıp sos hazırlayın.",
    "Sosu salatanın üzerine gezdirip hafifçe karıştırarak servis edin."
  ],
  "instructionsEn": [
    "Wash and dry the fresh spinach leaves.",
    "Slice the strawberries.",
    "Combine the spinach and strawberries in a large salad bowl.",
    "Add the toasted almonds and, if desired, crumbled feta cheese.",
    "Whisk together the balsamic vinegar, olive oil, honey, and salt to make the dressing.",
    "Drizzle the dressing over the salad, toss gently, and serve."
  ]
},
{
  "name": "Kapri Salatası",
  "nameEn": "Caprese Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Mozzarella Peyniri",
      "nameEn": "Mozzarella Cheese"
    },
    {
      "name": "Fesleğen",
      "nameEn": "Basil"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Balzamik Sirke",
      "nameEn": "Balsamic Vinegar",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    }
  ],
  "instructions": [
    "Domatesleri ve mozzarella peynirini eşit kalınlıkta dilimleyin.",
    "Domates ve peynir dilimlerini bir tabakta sırayla dizin.",
    "Aralarına taze fesleğen yapraklarını yerleştirin.",
    "Üzerine zeytinyağı gezdirin.",
    "İsteğe bağlı olarak balzamik sirke ekleyin.",
    "Tuz ve karabiberle tatlandırıp servis edin."
  ],
  "instructionsEn": [
    "Slice the tomatoes and mozzarella into even rounds.",
    "Arrange the tomato and cheese slices alternately on a plate.",
    "Tuck fresh basil leaves between the slices.",
    "Drizzle with olive oil.",
    "Optionally add a splash of balsamic vinegar.",
    "Season with salt and pepper and serve."
  ]
},
{
  "name": "Yumurtalı Salata",
  "nameEn": "Egg Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Mayonez",
      "nameEn": "Mayonnaise"
    },
    {
      "name": "Hardal",
      "nameEn": "Mustard"
    },
    {
      "name": "Taze Soğan",
      "nameEn": "Green Onion"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    }
  ],
  "instructions": [
    "Yumurtaları haşlayıp soğuduktan sonra soyun.",
    "Yumurtaları çatalla kabaca ezin.",
    "Taze soğanı ince doğrayıp ekleyin.",
    "Mayonez ve hardalı karışıma katın.",
    "Tuz ve karabiberle tatlandırıp iyice karıştırın.",
    "Ekmek üzerinde veya tek başına servis edin."
  ],
  "instructionsEn": [
    "Boil the eggs and peel them once cooled.",
    "Roughly mash the eggs with a fork.",
    "Finely chop the green onion and add it in.",
    "Stir in the mayonnaise and mustard.",
    "Season with salt and pepper and mix well.",
    "Serve on bread or on its own."
  ]
},
{
  "name": "Piyaz",
  "nameEn": "Turkish White Bean Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Beyaz Fasulye",
      "nameEn": "White Beans"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg",
      "optional": true
    }
  ],
  "instructions": [
    "Haşlanmış beyaz fasulyeleri süzüp geniş bir kaba alın.",
    "Soğanı ince doğrayıp az tuzla ovun.",
    "Domatesi küçük küpler halinde doğrayın.",
    "Fasulye, soğan, domates ve doğranmış maydanozu karıştırın.",
    "Zeytinyağı, limon suyu ve tuz ekleyip harmanlayın.",
    "İsteğe bağlı olarak dilimlenmiş haşlanmış yumurtayla süsleyip servis edin."
  ],
  "instructionsEn": [
    "Drain the cooked white beans and place them in a large bowl.",
    "Finely chop the onion and rub it with a little salt.",
    "Dice the tomato into small cubes.",
    "Combine the beans, onion, tomato, and chopped parsley.",
    "Add the olive oil, lemon juice, and salt, then toss together.",
    "Optionally garnish with sliced hard-boiled egg and serve."
  ]
},
{
  "name": "Kabak Salatası",
  "nameEn": "Grilled Zucchini Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Kabak",
      "nameEn": "Zucchini"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Nane",
      "nameEn": "Mint"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Beyaz Peynir",
      "nameEn": "Feta Cheese",
      "optional": true
    }
  ],
  "instructions": [
    "Kabakları ince uzun dilimler halinde kesin.",
    "Zeytinyağı sürülmüş ızgara tavada kabakları her iki tarafı da yumuşayana kadar pişirin.",
    "Pişen kabakları bir tabağa dizin.",
    "Ezilmiş sarımsağı zeytinyağı ve limon suyuyla karıştırıp üzerine gezdirin.",
    "Doğranmış naneyi serpiştirin.",
    "Tuz ekleyip isteğe bağlı ufalanmış beyaz peynirle servis edin."
  ],
  "instructionsEn": [
    "Cut the zucchini into thin, long slices.",
    "Grill the zucchini slices in a lightly oiled pan until softened on both sides.",
    "Arrange the cooked zucchini on a plate.",
    "Mix crushed garlic with olive oil and lemon juice, then drizzle over the top.",
    "Sprinkle with chopped mint.",
    "Season with salt and serve, optionally topped with crumbled feta cheese."
  ]
},
{
  "name": "Pancar Salatası",
  "nameEn": "Beet and Walnut Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Pancar",
      "nameEn": "Beet"
    },
    {
      "name": "Ceviz",
      "nameEn": "Walnut"
    },
    {
      "name": "Yoğurt",
      "nameEn": "Yogurt"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Pancarları kabuklarıyla yumuşayana kadar haşlayın.",
    "Haşlanan pancarları soyup küp küp doğrayın.",
    "Yoğurdu ezilmiş sarımsak ve tuzla karıştırın.",
    "Pancarları yoğurt karışımıyla harmanlayın.",
    "Üzerine kabaca kırılmış cevizleri serpin.",
    "Zeytinyağı gezdirip servis edin."
  ],
  "instructionsEn": [
    "Boil the beets with their skins on until tender.",
    "Peel the cooked beets and cut them into cubes.",
    "Mix the yogurt with crushed garlic and salt.",
    "Toss the beets with the yogurt mixture.",
    "Sprinkle roughly crushed walnuts on top.",
    "Drizzle with olive oil and serve."
  ]
},
{
  "name": "Kısır",
  "nameEn": "Bulgur Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Bulgur",
      "nameEn": "Bulgur"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Salatalık",
      "nameEn": "Cucumber"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Nane",
      "nameEn": "Mint"
    },
    {
      "name": "Salça",
      "nameEn": "Tomato Paste",
      "optional": true
    },
    {
      "name": "Nar Ekşisi",
      "nameEn": "Pomegranate Molasses"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    }
  ],
  "instructions": [
    "İnce bulguru sıcak suyla haşlayıp kabarmasını bekleyin.",
    "Domates ve salatalığı küçük küpler halinde doğrayın.",
    "Maydanoz ve naneyi ince kıyın.",
    "Kabaran bulguru sebzeler ve otlarla karıştırın.",
    "İsteğe bağlı salça, nar ekşisi, zeytinyağı ve limon suyunu ekleyin.",
    "Tüm malzemeleri iyice yoğurarak karıştırın.",
    "Buzdolabında dinlendirip servis edin."
  ],
  "instructionsEn": [
    "Soak the fine bulgur in hot water until it plumps up.",
    "Dice the tomato and cucumber into small cubes.",
    "Finely chop the parsley and mint.",
    "Mix the softened bulgur with the vegetables and herbs.",
    "Add the optional tomato paste, pomegranate molasses, olive oil, and lemon juice.",
    "Knead and mix all the ingredients together thoroughly.",
    "Chill in the refrigerator before serving."
  ]
},
{
  "name": "Waldorf Salata",
  "nameEn": "Waldorf Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Elma",
      "nameEn": "Apple"
    },
    {
      "name": "Kereviz Sapı",
      "nameEn": "Celery"
    },
    {
      "name": "Ceviz",
      "nameEn": "Walnut"
    },
    {
      "name": "Üzüm",
      "nameEn": "Grape"
    },
    {
      "name": "Mayonez",
      "nameEn": "Mayonnaise"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Elmayı küp küp doğrayıp üzerine limon suyu gezdirin.",
    "Kereviz sapını ince dilimleyin.",
    "Üzümleri yıkayıp ikiye bölün.",
    "Elma, kereviz, üzüm ve kabaca kırılmış cevizleri bir kapta birleştirin.",
    "Mayonez ve tuzu ekleyip nazikçe karıştırın.",
    "Soğuk olarak servis edin."
  ],
  "instructionsEn": [
    "Dice the apple and drizzle with lemon juice.",
    "Thinly slice the celery.",
    "Wash the grapes and halve them.",
    "Combine the apple, celery, grapes, and roughly crushed walnuts in a bowl.",
    "Add the mayonnaise and salt, then gently toss together.",
    "Serve chilled."
  ]
},
{
  "name": "Karnabahar Salatası",
  "nameEn": "Roasted Cauliflower Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Karnabahar",
      "nameEn": "Cauliflower"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Karnabaharı küçük parçalara ayırın.",
    "Zeytinyağı ve tuzla harmanlayıp fırın tepsisine yayın.",
    "Kızarana kadar fırında pişirin.",
    "Ezilmiş sarımsağı zeytinyağı ve limon suyuyla karıştırın.",
    "Fırınlanmış karnabaharı bir kaba alıp sosla harmanlayın.",
    "Doğranmış maydanoz ve isteğe bağlı pul biberle süsleyip servis edin."
  ],
  "instructionsEn": [
    "Break the cauliflower into small florets.",
    "Toss with olive oil and salt, then spread on a baking tray.",
    "Roast in the oven until golden.",
    "Mix crushed garlic with olive oil and lemon juice.",
    "Transfer the roasted cauliflower to a bowl and toss with the dressing.",
    "Garnish with chopped parsley and, if desired, red pepper flakes, then serve."
  ]
},
{
  "name": "Portakal Salatası",
  "nameEn": "Orange and Olive Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Portakal",
      "nameEn": "Orange"
    },
    {
      "name": "Zeytin",
      "nameEn": "Olive"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes",
      "optional": true
    },
    {
      "name": "Nane",
      "nameEn": "Mint"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Portakalları soyup zarlarından ayırarak dilimleyin.",
    "Soğanı ince ay dilimleri halinde doğrayın.",
    "Portakal dilimlerini bir tabağa dizin.",
    "Üzerine soğan ve zeytinleri ekleyin.",
    "Zeytinyağı gezdirip doğranmış naneyle süsleyin.",
    "İsteğe bağlı pul biber ve tuz ekleyip servis edin."
  ],
  "instructionsEn": [
    "Peel the oranges and slice into segments, removing the membranes.",
    "Cut the onion into thin half-moon slices.",
    "Arrange the orange segments on a plate.",
    "Add the onion and olives on top.",
    "Drizzle with olive oil and garnish with chopped mint.",
    "Season with salt and, if desired, red pepper flakes, then serve."
  ]
},
{
  "name": "Avokadolu Salata",
  "nameEn": "Avocado Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Avokado",
      "nameEn": "Avocado"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Mısır",
      "nameEn": "Corn"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Kişniş",
      "nameEn": "Cilantro",
      "optional": true
    }
  ],
  "instructions": [
    "Avokadoyu ikiye bölüp çekirdeğini çıkarın ve küp küp doğrayın.",
    "Domatesi küçük küpler halinde kesin.",
    "Mısır ve ince doğranmış soğanı ekleyin.",
    "Tüm malzemeleri bir kapta nazikçe karıştırın.",
    "Limon suyu ve zeytinyağı gezdirin.",
    "Tuz ve isteğe bağlı doğranmış kişnişle tatlandırıp servis edin."
  ],
  "instructionsEn": [
    "Halve the avocado, remove the pit, and cut into cubes.",
    "Dice the tomato into small cubes.",
    "Add the corn and finely chopped onion.",
    "Gently combine all the ingredients in a bowl.",
    "Drizzle with lemon juice and olive oil.",
    "Season with salt and, if desired, chopped cilantro, then serve."
  ]
},
{
  "name": "Kuşkonmaz Salatası",
  "nameEn": "Asparagus Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Kuşkonmaz",
      "nameEn": "Asparagus"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Parmesan Peyniri",
      "nameEn": "Parmesan Cheese",
      "optional": true
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Kuşkonmazların sert kısımlarını kırıp ayıklayın.",
    "Kaynar tuzlu suda birkaç dakika haşlayıp buzlu suya alın.",
    "Süzülen kuşkonmazları bir tabağa dizin.",
    "Ezilmiş sarımsağı zeytinyağı ve limon suyuyla karıştırın.",
    "Sosu kuşkonmazların üzerine gezdirin.",
    "İsteğe bağlı rendelenmiş parmesan peyniri ve tuzla servis edin."
  ],
  "instructionsEn": [
    "Snap off the tough ends of the asparagus.",
    "Blanch in boiling salted water for a few minutes, then plunge into ice water.",
    "Arrange the drained asparagus on a plate.",
    "Mix crushed garlic with olive oil and lemon juice.",
    "Drizzle the dressing over the asparagus.",
    "Serve with optional grated Parmesan cheese and salt."
  ]
},
{
  "name": "Beyaz Peynirli Kavun Salatası",
  "nameEn": "Melon and Feta Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Kavun",
      "nameEn": "Melon"
    },
    {
      "name": "Beyaz Peynir",
      "nameEn": "Feta Cheese"
    },
    {
      "name": "Nane",
      "nameEn": "Mint"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper",
      "optional": true
    }
  ],
  "instructions": [
    "Kavunu küp küp veya top şeklinde kesin.",
    "Beyaz peyniri küçük küpler halinde doğrayın.",
    "Kavun ve peyniri bir tabakta birleştirin.",
    "Üzerine doğranmış nane yapraklarını serpin.",
    "Zeytinyağı ve limon suyu gezdirin.",
    "İsteğe bağlı karabiberle tatlandırıp servis edin."
  ],
  "instructionsEn": [
    "Cut the melon into cubes or scoop into balls.",
    "Cut the feta cheese into small cubes.",
    "Combine the melon and feta on a plate.",
    "Sprinkle chopped mint leaves on top.",
    "Drizzle with olive oil and lemon juice.",
    "Season with pepper, if desired, and serve."
  ]
},
{
  "name": "Elmalı Lahana Salatası",
  "nameEn": "Apple Coleslaw",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Lahana",
      "nameEn": "Cabbage"
    },
    {
      "name": "Havuç",
      "nameEn": "Carrot"
    },
    {
      "name": "Elma",
      "nameEn": "Apple"
    },
    {
      "name": "Mayonez",
      "nameEn": "Mayonnaise"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Lahanayı ince ince doğrayın.",
    "Havucu rendeleyin.",
    "Elmayı ince çubuklar halinde kesip limon suyuyla karıştırın.",
    "Lahana, havuç ve elmayı geniş bir kapta birleştirin.",
    "Mayonez ve tuzu ekleyip iyice harmanlayın.",
    "Buzdolabında dinlendirip servis edin."
  ],
  "instructionsEn": [
    "Thinly shred the cabbage.",
    "Grate the carrot.",
    "Cut the apple into thin matchsticks and toss with lemon juice.",
    "Combine the cabbage, carrot, and apple in a large bowl.",
    "Add the mayonnaise and salt, then mix thoroughly.",
    "Chill in the refrigerator before serving."
  ]
},
{
  "name": "Barbunya Salatası",
  "nameEn": "Cranberry Bean Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Barbunya Fasulyesi",
      "nameEn": "Cranberry Beans"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Haşlanmış barbunya fasulyelerini süzüp geniş bir kaba alın.",
    "Soğanı ince doğrayıp az tuzla ovun.",
    "Domatesi küçük küpler halinde kesin.",
    "Fasulye, soğan, domates ve doğranmış maydanozu karıştırın.",
    "Zeytinyağı, limon suyu ve tuz ekleyip harmanlayın.",
    "Servis etmeden önce biraz dinlendirin."
  ],
  "instructionsEn": [
    "Drain the cooked cranberry beans and place them in a large bowl.",
    "Finely chop the onion and rub it with a little salt.",
    "Dice the tomato into small cubes.",
    "Combine the beans, onion, tomato, and chopped parsley.",
    "Add the olive oil, lemon juice, and salt, then toss together.",
    "Let it rest briefly before serving."
  ]
},
{
  "name": "Mantarlı Salata",
  "nameEn": "Warm Mushroom Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Mantar",
      "nameEn": "Mushroom"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    }
  ],
  "instructions": [
    "Mantarları temizleyip dilimleyin.",
    "Zeytinyağında ezilmiş sarımsakla birlikte kızarana kadar soteleyin.",
    "Pişen mantarları bir kaba alıp soğumaya bırakın.",
    "Üzerine doğranmış maydanoz ekleyin.",
    "Limon suyu, tuz ve karabiberle tatlandırın.",
    "Ilık veya soğuk olarak servis edin."
  ],
  "instructionsEn": [
    "Clean and slice the mushrooms.",
    "Sauté them in olive oil with crushed garlic until golden.",
    "Transfer the cooked mushrooms to a bowl and let them cool slightly.",
    "Add the chopped parsley.",
    "Season with lemon juice, salt, and pepper.",
    "Serve warm or chilled."
  ]
},
{
  "name": "Somonlu Salata",
  "nameEn": "Salmon Salad",
  "category": "Salad",
  "ingredients": [
    {
      "name": "Somon",
      "nameEn": "Salmon"
    },
    {
      "name": "Marul",
      "nameEn": "Lettuce"
    },
    {
      "name": "Salatalık",
      "nameEn": "Cucumber"
    },
    {
      "name": "Avokado",
      "nameEn": "Avocado"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    }
  ],
  "instructions": [
    "Somon fileyi tuz ve karabiberle tatlandırıp ızgarada pişirin.",
    "Marulu yıkayıp doğrayın.",
    "Salatalığı dilimleyin, avokadoyu küp küp doğrayın.",
    "Marul, salatalık ve avokadoyu bir kapta birleştirin.",
    "Pişen somonu parçalara ayırıp salatanın üzerine yerleştirin.",
    "Zeytinyağı ve limon suyu gezdirip servis edin."
  ],
  "instructionsEn": [
    "Season the salmon fillet with salt and pepper and grill it.",
    "Wash and chop the lettuce.",
    "Slice the cucumber and cube the avocado.",
    "Combine the lettuce, cucumber, and avocado in a bowl.",
    "Flake the cooked salmon and place it on top of the salad.",
    "Drizzle with olive oil and lemon juice, then serve."
  ]
},
{
  "name": "Humus",
  "nameEn": "Classic Hummus",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Nohut",
      "nameEn": "Chickpea"
    },
    {
      "name": "Tahin",
      "nameEn": "Tahini"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Kimyon",
      "nameEn": "Cumin",
      "optional": true
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes",
      "optional": true
    }
  ],
  "instructions": [
    "Haşlanmış nohutları bir robotta pürüzsüz hâle gelene kadar çekin.",
    "Tahin, limon suyu, sarımsak ve tuzu ekleyip tekrar çekin.",
    "Kıvamını ayarlamak için birkaç kaşık nohut suyu ekleyin.",
    "Servis tabağına alıp üzerini zeytinyağıyla gezdirin.",
    "İsteğe bağlı olarak kimyon ve pul biber serpip servis edin."
  ],
  "instructionsEn": [
    "Blend the cooked chickpeas in a food processor until smooth.",
    "Add the tahini, lemon juice, garlic, and salt, and blend again.",
    "Add a few spoonfuls of the chickpea cooking water to adjust the consistency.",
    "Spread onto a serving plate and drizzle with olive oil.",
    "Sprinkle with cumin and chili flakes, if desired, and serve."
  ]
},
{
  "name": "Babagannuş",
  "nameEn": "Smoky Eggplant Dip",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Patlıcan",
      "nameEn": "Eggplant"
    },
    {
      "name": "Tahin",
      "nameEn": "Tahini"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley",
      "optional": true
    },
    {
      "name": "Nar Ekşisi",
      "nameEn": "Pomegranate Molasses",
      "optional": true
    }
  ],
  "instructions": [
    "Patlıcanları doğrudan ateşte veya fırında kabukları kararana kadar közleyin.",
    "Sıcakken kabuklarını soyup etini bir kaseye alın.",
    "Tahin, limon suyu, ezilmiş sarımsak ve tuzu ekleyip çatalla ezerek karıştırın.",
    "Üzerine zeytinyağı gezdirin.",
    "İsteğe bağlı nar ekşisi ve maydanozla süsleyip servis edin."
  ],
  "instructionsEn": [
    "Char the eggplants directly over a flame or in the oven until the skins blacken.",
    "While still warm, peel off the skins and place the flesh in a bowl.",
    "Add the tahini, lemon juice, crushed garlic, and salt, mashing everything together with a fork.",
    "Drizzle with olive oil.",
    "Garnish with pomegranate molasses and parsley, if desired, and serve."
  ]
},
{
  "name": "Haydari",
  "nameEn": "Garlicky Herbed Yogurt Dip",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Yoğurt",
      "nameEn": "Yogurt"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Dereotu",
      "nameEn": "Dill"
    },
    {
      "name": "Nane",
      "nameEn": "Mint"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Süzme yoğurdu bir kaseye alın.",
    "Ezilmiş sarımsak, ince kıyılmış dereotu ve naneyi ekleyip karıştırın.",
    "Tuzu ekleyip iyice karıştırın.",
    "Üzerine zeytinyağı gezdirerek servis edin."
  ],
  "instructionsEn": [
    "Place the strained yogurt in a bowl.",
    "Stir in the crushed garlic along with the finely chopped dill and mint.",
    "Season with salt and mix well.",
    "Drizzle with olive oil and serve."
  ]
},
{
  "name": "Muhammara",
  "nameEn": "Walnut and Red Pepper Dip",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Kırmızı Biber",
      "nameEn": "Red Bell Pepper"
    },
    {
      "name": "Ceviz",
      "nameEn": "Walnut"
    },
    {
      "name": "Galeta Unu",
      "nameEn": "Breadcrumbs"
    },
    {
      "name": "Biber Salçası",
      "nameEn": "Pepper Paste"
    },
    {
      "name": "Nar Ekşisi",
      "nameEn": "Pomegranate Molasses"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Kırmızı biberleri fırında veya ateşte közleyip kabuklarını soyun.",
    "Közlenmiş biberleri ceviz, galeta unu, biber salçası, nar ekşisi ve sarımsakla robotta çekin.",
    "Pul biber ve tuz ekleyip karıştırın.",
    "Zeytinyağını azar azar ekleyerek kıvam verin.",
    "Buzdolabında dinlendirdikten sonra servis edin."
  ],
  "instructionsEn": [
    "Roast the red peppers over a flame or in the oven and peel off the skins.",
    "Blend the roasted peppers with the walnuts, breadcrumbs, pepper paste, pomegranate molasses, and garlic in a food processor.",
    "Add the chili flakes and salt, and mix.",
    "Drizzle in the olive oil gradually to reach a smooth consistency.",
    "Chill in the refrigerator before serving."
  ]
},
{
  "name": "Acılı Ezme",
  "nameEn": "Spicy Tomato and Pepper Relish",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Acı Biber",
      "nameEn": "Hot Pepper"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Biber Salçası",
      "nameEn": "Pepper Paste"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Domates, soğan, acı biber ve maydanozu çok ince kıyın.",
    "Kıydığınız malzemeleri bir kaseye alıp biber salçası ile karıştırın.",
    "Limon suyu, zeytinyağı, pul biber ve tuzu ekleyip iyice yoğurun.",
    "Oda sıcaklığında dinlendirip servis edin."
  ],
  "instructionsEn": [
    "Finely chop the tomato, onion, hot pepper, and parsley.",
    "Combine the chopped vegetables in a bowl with the pepper paste.",
    "Add the lemon juice, olive oil, chili flakes, and salt, and knead everything together well.",
    "Let it rest at room temperature before serving."
  ]
},
{
  "name": "Fava",
  "nameEn": "Broad Bean Puree",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Kuru Bakla",
      "nameEn": "Dried Broad Beans"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Dereotu",
      "nameEn": "Dill",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar",
      "optional": true
    }
  ],
  "instructions": [
    "Kuru baklayı doğranmış soğanla birlikte bol suda yumuşayana kadar haşlayın.",
    "Suyunu tamamen süzmeden robotta pürüzsüz hâle gelene kadar çekin.",
    "Zeytinyağı, tuz ve isterseniz bir tutam şeker ekleyip karıştırın.",
    "Karışımı bir tabağa yayıp soğumaya bırakın.",
    "Üzerine zeytinyağı gezdirip ince kıyılmış dereotuyla süsleyerek servis edin."
  ],
  "instructionsEn": [
    "Boil the dried broad beans with the chopped onion in plenty of water until tender.",
    "Blend until smooth in a food processor, without draining all the cooking liquid.",
    "Stir in the olive oil, salt, and a pinch of sugar, if using.",
    "Spread the mixture onto a plate and let it cool.",
    "Drizzle with olive oil, garnish with finely chopped dill, and serve."
  ]
},
{
  "name": "Yaprak Sarma",
  "nameEn": "Stuffed Grape Leaves",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Asma Yaprağı",
      "nameEn": "Grape Leaves"
    },
    {
      "name": "Pirinç",
      "nameEn": "Rice"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Kuru Üzüm",
      "nameEn": "Raisins"
    },
    {
      "name": "Çam Fıstığı",
      "nameEn": "Pine Nuts"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Nane",
      "nameEn": "Mint"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Pirinci yıkayıp süzün.",
    "Soğanı zeytinyağında kavurup pirinç, kuru üzüm ve çam fıstığını ilave edin.",
    "Nane, tuz ve az su ekleyip harcı hafifçe pişirin.",
    "Asma yapraklarının her birine az miktarda harç koyup sıkıca sarın.",
    "Sarmaları bir tencereye dizip üzerlerine su ve limon suyu ekleyin.",
    "Kısık ateşte pirinç yumuşayana kadar pişirip soğuk servis edin."
  ],
  "instructionsEn": [
    "Rinse and drain the rice.",
    "Sauté the onion in olive oil, then add the rice, raisins, and pine nuts.",
    "Stir in the mint, salt, and a little water, and cook the filling briefly.",
    "Place a small spoonful of filling on each grape leaf and roll it up tightly.",
    "Arrange the rolls in a pot and add water and lemon juice.",
    "Simmer over low heat until the rice is tender, then serve cold."
  ]
},
{
  "name": "Midye Dolma",
  "nameEn": "Stuffed Mussels",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Midye",
      "nameEn": "Mussel"
    },
    {
      "name": "Pirinç",
      "nameEn": "Rice"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Çam Fıstığı",
      "nameEn": "Pine Nuts"
    },
    {
      "name": "Kuru Üzüm",
      "nameEn": "Raisins"
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    },
    {
      "name": "Tarçın",
      "nameEn": "Cinnamon",
      "optional": true
    },
    {
      "name": "Limon",
      "nameEn": "Lemon",
      "optional": true
    }
  ],
  "instructions": [
    "Midyeleri iyice fırçalayıp yıkayın.",
    "Soğanı yağda kavurup pirinç, çam fıstığı ve kuru üzümü ekleyin.",
    "Pul biber, karabiber ve isteğe bağlı tarçınla harcı baharatlandırın.",
    "Her midyenin içine bir kaşık harç doldurup kapatın.",
    "Midyeleri bir tencerede üst üste dizip az suyla kısık ateşte pişirin.",
    "Soğuduktan sonra limonla servis edin."
  ],
  "instructionsEn": [
    "Scrub and rinse the mussels thoroughly.",
    "Sauté the onion in oil, then add the rice, pine nuts, and raisins.",
    "Season the filling with chili flakes, black pepper, and cinnamon, if using.",
    "Spoon a small amount of filling into each mussel and close it.",
    "Stack the mussels in a pot and cook over low heat with a little water.",
    "Let cool, then serve with lemon."
  ]
},
{
  "name": "Mantar Dolması",
  "nameEn": "Cheese-Stuffed Mushrooms",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Mantar",
      "nameEn": "Mushroom"
    },
    {
      "name": "Kaşar Peyniri",
      "nameEn": "Kashar Cheese"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Galeta Unu",
      "nameEn": "Breadcrumbs"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Mantarların saplarını çıkarıp içlerini oyun.",
    "Sapları ince kıyıp sarımsak ve maydanozla zeytinyağında kavurun.",
    "Karışıma rendelenmiş kaşar peyniri, galeta unu, karabiber ve tuz ekleyip karıştırın.",
    "Harcı mantar kapaklarına doldurun.",
    "Fırında mantarlar yumuşayıp üzeri kızarana kadar pişirip sıcak servis edin."
  ],
  "instructionsEn": [
    "Remove the stems from the mushrooms and hollow out the caps slightly.",
    "Finely chop the stems and sauté them with the garlic and parsley in olive oil.",
    "Mix in the grated kashar cheese, breadcrumbs, black pepper, and salt.",
    "Fill the mushroom caps with the mixture.",
    "Bake until the mushrooms are tender and the tops are golden, then serve hot."
  ]
},
{
  "name": "Kabak Çiçeği Dolması",
  "nameEn": "Stuffed Zucchini Flowers",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Kabak Çiçeği",
      "nameEn": "Zucchini Flower"
    },
    {
      "name": "Pirinç",
      "nameEn": "Rice"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Dereotu",
      "nameEn": "Dill"
    },
    {
      "name": "Nane",
      "nameEn": "Mint"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Kabak çiçeklerini nazikçe yıkayıp içindeki tozlanmayı temizleyin.",
    "Soğanı zeytinyağında kavurup pirinci ekleyin ve birkaç dakika çevirin.",
    "Dereotu, nane, maydanoz ve tuzu ekleyip harcı hafifçe pişirin.",
    "Her çiçeğin içine bir kaşık harç koyup uçlarını katlayarak kapatın.",
    "Dolmaları bir tencereye sıkıca dizip üzerine su ve limon suyu ekleyin.",
    "Kısık ateşte pişirip soğuk servis edin."
  ],
  "instructionsEn": [
    "Gently wash the zucchini flowers and clean out the pistils.",
    "Sauté the onion in olive oil, add the rice, and stir for a few minutes.",
    "Add the dill, mint, parsley, and salt, and cook the filling briefly.",
    "Spoon filling into each flower and fold the tips closed.",
    "Arrange the stuffed flowers snugly in a pot and add water and lemon juice.",
    "Simmer over low heat, then serve cold."
  ]
},
{
  "name": "Mücver",
  "nameEn": "Zucchini Fritters",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Kabak",
      "nameEn": "Zucchini"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Beyaz Peynir",
      "nameEn": "White Cheese"
    },
    {
      "name": "Dereotu",
      "nameEn": "Dill"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion",
      "optional": true
    },
    {
      "name": "Ayçiçek Yağı",
      "nameEn": "Sunflower Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Kabakları rendeleyip tuzlayarak suyunu sıkın.",
    "Rendelenmiş kabağa yumurta, un, ufalanmış beyaz peynir ve dereotu ekleyin.",
    "İsteğe bağlı ince kıyılmış soğanı da ekleyip karıştırın.",
    "Karışımdan kaşıkla aldığınız harcı sıcak yağa dökün.",
    "İki tarafı da kızarana kadar kızartıp servis edin."
  ],
  "instructionsEn": [
    "Grate the zucchini, salt it, and squeeze out the excess water.",
    "Add the egg, flour, crumbled white cheese, and dill to the grated zucchini.",
    "Stir in the finely chopped onion, if using.",
    "Drop spoonfuls of the batter into hot oil.",
    "Fry on both sides until golden and serve."
  ]
},
{
  "name": "Patates Köftesi",
  "nameEn": "Potato Croquettes",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Patates",
      "nameEn": "Potato"
    },
    {
      "name": "Kaşar Peyniri",
      "nameEn": "Kashar Cheese"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Galeta Unu",
      "nameEn": "Breadcrumbs"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Ayçiçek Yağı",
      "nameEn": "Sunflower Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Patatesleri haşlayıp soyun ve iyice ezin.",
    "Ezilmiş patatese rendelenmiş kaşar peyniri, maydanoz ve tuzu ekleyip yoğurun.",
    "Harçtan küçük parçalar koparıp köfte şekli verin.",
    "Köfteleri sırasıyla una, çırpılmış yumurtaya ve galeta ununa bulayın.",
    "Sıcak yağda her tarafı kızarana kadar kızartın.",
    "Kağıt havlu üzerinde yağını alıp sıcak servis edin."
  ],
  "instructionsEn": [
    "Boil the potatoes, peel them, and mash thoroughly.",
    "Knead in the grated kashar cheese, parsley, and salt.",
    "Shape the mixture into small croquettes.",
    "Coat each croquette in flour, then beaten egg, then breadcrumbs.",
    "Fry in hot oil until golden on all sides.",
    "Drain on paper towels and serve hot."
  ]
},
{
  "name": "Arnavut Ciğeri",
  "nameEn": "Albanian-Style Fried Liver",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Kuzu Ciğeri",
      "nameEn": "Lamb Liver"
    },
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Ayçiçek Yağı",
      "nameEn": "Sunflower Oil"
    },
    {
      "name": "Kırmızı Soğan",
      "nameEn": "Red Onion"
    },
    {
      "name": "Sumak",
      "nameEn": "Sumac",
      "optional": true
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Ciğeri küp küp doğrayın.",
    "Doğranmış ciğerleri una bulayın.",
    "Sıcak yağda ciğerleri kısa sürede kızartın.",
    "İnce doğranmış kırmızı soğan, maydanoz, pul biber ve isteğe bağlı sumakla karıştırın.",
    "Tuzunu ekleyip sıcak servis edin."
  ],
  "instructionsEn": [
    "Cut the liver into small cubes.",
    "Toss the cubed liver in flour.",
    "Fry the liver in hot oil for a short time until cooked through.",
    "Toss with thinly sliced red onion, parsley, chili flakes, and sumac, if using.",
    "Season with salt and serve hot."
  ]
},
{
  "name": "İspanaklı Börek",
  "nameEn": "Spinach Filo Rolls",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Yufka",
      "nameEn": "Phyllo Dough"
    },
    {
      "name": "Ispanak",
      "nameEn": "Spinach"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Beyaz Peynir",
      "nameEn": "White Cheese"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Susam",
      "nameEn": "Sesame Seeds",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Soğanı zeytinyağında kavurup doğranmış ıspanağı ekleyin ve suyunu çekene kadar pişirin.",
    "Ispanak soğuduktan sonra ufalanmış beyaz peyniri ekleyip karıştırın.",
    "Yufkaları uzun şeritler hâlinde kesin.",
    "Her şeridin ucuna harçtan koyup rulo şeklinde sarın.",
    "Ruloların üzerini çırpılmış yumurtayla fırçalayıp isteğe bağlı susam serpin.",
    "Fırında altın rengi olana kadar pişirip servis edin."
  ],
  "instructionsEn": [
    "Sauté the onion in olive oil, add the chopped spinach, and cook until the liquid evaporates.",
    "Once the spinach has cooled, mix in the crumbled white cheese.",
    "Cut the phyllo sheets into long strips.",
    "Place filling at the end of each strip and roll into a log.",
    "Brush the tops of the rolls with beaten egg and sprinkle with sesame seeds, if using.",
    "Bake until golden brown and serve."
  ]
},
{
  "name": "Peynirli Çıtır Rulo",
  "nameEn": "Crispy Cheese Rolls",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Yufka",
      "nameEn": "Phyllo Dough"
    },
    {
      "name": "Kaşar Peyniri",
      "nameEn": "Kashar Cheese"
    },
    {
      "name": "Beyaz Peynir",
      "nameEn": "White Cheese"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Ayçiçek Yağı",
      "nameEn": "Sunflower Oil"
    }
  ],
  "instructions": [
    "Rendelenmiş kaşar peynirini ufalanmış beyaz peynir ve maydanozla karıştırın.",
    "Yufkaları küçük dikdörtgenler hâlinde kesin.",
    "Her parçaya harçtan koyup sıkıca rulo yapın.",
    "Uçlarını yumurtayla kapatın.",
    "Sıcak yağda çıtır çıtır olana kadar kızartıp servis edin."
  ],
  "instructionsEn": [
    "Combine the grated kashar cheese with the crumbled white cheese and parsley.",
    "Cut the phyllo sheets into small rectangles.",
    "Place filling on each piece and roll tightly.",
    "Seal the ends with egg.",
    "Fry in hot oil until crisp and serve."
  ]
},
{
  "name": "Peynirli Puf Börek",
  "nameEn": "Cheese Puff Pastry Bites",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Milföy Hamuru",
      "nameEn": "Puff Pastry"
    },
    {
      "name": "Beyaz Peynir",
      "nameEn": "White Cheese"
    },
    {
      "name": "Kaşar Peyniri",
      "nameEn": "Kashar Cheese"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Susam",
      "nameEn": "Sesame Seeds"
    },
    {
      "name": "Çörek Otu",
      "nameEn": "Nigella Seeds",
      "optional": true
    }
  ],
  "instructions": [
    "Milföy hamurunu küçük kareler hâlinde kesin.",
    "Ufalanmış beyaz peynir ve rendelenmiş kaşar peynirini karıştırın.",
    "Her kareye bir parça peynir harcı koyup üçgen şeklinde katlayın.",
    "Üzerlerine çırpılmış yumurta sürüp susam ve isteğe bağlı çörek otu serpin.",
    "Önceden ısıtılmış fırında kabarıp altın rengi olana kadar pişirin."
  ],
  "instructionsEn": [
    "Cut the puff pastry into small squares.",
    "Combine the crumbled white cheese with the grated kashar cheese.",
    "Place a portion of the cheese filling on each square and fold into a triangle.",
    "Brush the tops with beaten egg and sprinkle with sesame seeds and nigella seeds, if using.",
    "Bake in a preheated oven until puffed and golden brown."
  ]
},
{
  "name": "Bademli Peynir Topları",
  "nameEn": "Almond-Crusted Cheese Balls",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Beyaz Peynir",
      "nameEn": "White Cheese"
    },
    {
      "name": "Krem Peynir",
      "nameEn": "Cream Cheese"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Dereotu",
      "nameEn": "Dill"
    },
    {
      "name": "Badem",
      "nameEn": "Almond"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    }
  ],
  "instructions": [
    "Ufalanmış beyaz peyniri krem peynirle karıştırın.",
    "Ezilmiş sarımsak, dereotu ve karabiberi ekleyip yoğurun.",
    "Karışımdan küçük toplar şekillendirin.",
    "Topları kıyılmış badem içinde yuvarlayıp servis edin."
  ],
  "instructionsEn": [
    "Mix the crumbled white cheese with the cream cheese.",
    "Knead in the crushed garlic, dill, and black pepper.",
    "Shape the mixture into small balls.",
    "Roll the balls in chopped almonds and serve."
  ]
},
{
  "name": "Közde Peynir",
  "nameEn": "Pan-Seared Halloumi",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Hellim Peyniri",
      "nameEn": "Halloumi Cheese"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Kekik",
      "nameEn": "Thyme",
      "optional": true
    },
    {
      "name": "Bal",
      "nameEn": "Honey",
      "optional": true
    }
  ],
  "instructions": [
    "Hellim peynirini kalın dilimler hâlinde kesin.",
    "Dilimleri her iki tarafı da altın rengi olana kadar sıcak bir tavada közleyin.",
    "Üzerine zeytinyağı ve limon suyu gezdirin.",
    "İsteğe bağlı kekik ve bal ile süsleyip sıcak servis edin."
  ],
  "instructionsEn": [
    "Slice the halloumi cheese into thick pieces.",
    "Sear the slices in a hot pan on both sides until golden.",
    "Drizzle with olive oil and lemon juice.",
    "Garnish with thyme and a drizzle of honey, if desired, and serve hot."
  ]
},
{
  "name": "Falafel",
  "nameEn": "Falafel",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Nohut",
      "nameEn": "Chickpea"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Kimyon",
      "nameEn": "Cumin"
    },
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Kabartma Tozu",
      "nameEn": "Baking Powder",
      "optional": true
    },
    {
      "name": "Ayçiçek Yağı",
      "nameEn": "Sunflower Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Bir gece suda bekletilmiş nohutları süzün.",
    "Nohutları soğan, sarımsak ve maydanozla robotta kaba çekin.",
    "Kimyon, tuz ve isteğe bağlı kabartma tozunu ekleyip karıştırın.",
    "Harçtan küçük toplar veya köfteler şekillendirin.",
    "Üzerlerine hafifçe un serpin.",
    "Sıcak yağda altın rengi ve çıtır olana kadar kızartıp servis edin."
  ],
  "instructionsEn": [
    "Drain the chickpeas that have been soaked overnight in water.",
    "Coarsely blend the chickpeas with the onion, garlic, and parsley in a food processor.",
    "Mix in the cumin, salt, and baking powder, if using.",
    "Shape the mixture into small balls or patties.",
    "Dust them lightly with flour.",
    "Fry in hot oil until golden and crisp, then serve."
  ]
},
{
  "name": "Domates Bruschetta",
  "nameEn": "Tomato Bruschetta",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Baget Ekmek",
      "nameEn": "Baguette"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Sarımsak",
      "nameEn": "Garlic"
    },
    {
      "name": "Fesleğen",
      "nameEn": "Basil"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Balzamik Sirke",
      "nameEn": "Balsamic Vinegar",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Baget ekmeği dilimleyip kızartın.",
    "Sıcak ekmek dilimlerini kesilmiş sarımsakla ovun.",
    "Küp küp doğranmış domatesi ince kıyılmış fesleğen, zeytinyağı ve tuzla karıştırın.",
    "İsteğe bağlı balzamik sirke ekleyin.",
    "Domates harcını ekmek dilimlerinin üzerine paylaştırıp hemen servis edin."
  ],
  "instructionsEn": [
    "Slice the baguette and toast the slices.",
    "Rub the warm bread slices with a cut clove of garlic.",
    "Combine the diced tomatoes with the finely chopped basil, olive oil, and salt.",
    "Add a splash of balsamic vinegar, if using.",
    "Spoon the tomato mixture onto the bread slices and serve immediately."
  ]
},
{
  "name": "Caprese Salatası",
  "nameEn": "Caprese Skewers",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Cherry Domates",
      "nameEn": "Cherry Tomato"
    },
    {
      "name": "Mozzarella Peyniri",
      "nameEn": "Mozzarella Cheese"
    },
    {
      "name": "Fesleğen",
      "nameEn": "Basil"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Balzamik Sirke",
      "nameEn": "Balsamic Vinegar"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Cherry domatesleri ve mozzarella peynirini benzer büyüklükte hazırlayın.",
    "Domates, mozzarella ve fesleğen yapraklarını sırayla kürdana geçirin.",
    "Üzerlerine zeytinyağı ve balzamik sirke gezdirin.",
    "Tuz serpip servis edin."
  ],
  "instructionsEn": [
    "Prepare the cherry tomatoes and mozzarella in similar-sized pieces.",
    "Skewer the tomato, mozzarella, and basil leaves onto toothpicks in sequence.",
    "Drizzle with olive oil and balsamic vinegar.",
    "Sprinkle with salt and serve."
  ]
},
{
  "name": "Fırında Acılı Tavuk Kanat",
  "nameEn": "Baked Buffalo Chicken Wings",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Tavuk Kanat",
      "nameEn": "Chicken Wing"
    },
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Acı Sos",
      "nameEn": "Hot Sauce",
      "optional": true
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Sarımsak Tozu",
      "nameEn": "Garlic Powder",
      "optional": true
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Tavuk kanatlarını una, karabiber ve tuza bulayın.",
    "Fırın tepsisine dizip önceden ısıtılmış fırında çevirerek çıtır olana kadar pişirin.",
    "Eritilmiş tereyağını acı sos ve isteğe bağlı sarımsak tozuyla karıştırın.",
    "Pişen kanatları bu sosla iyice kaplayın.",
    "Sıcak servis edin."
  ],
  "instructionsEn": [
    "Toss the chicken wings in flour, black pepper, and salt.",
    "Arrange on a baking tray and bake in a preheated oven, turning occasionally, until crisp.",
    "Mix the melted butter with the hot sauce and garlic powder, if using.",
    "Toss the baked wings thoroughly in the sauce.",
    "Serve hot."
  ]
},
{
  "name": "Doldurulmuş Yumurta",
  "nameEn": "Deviled Eggs",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Mayonez",
      "nameEn": "Mayonnaise"
    },
    {
      "name": "Hardal",
      "nameEn": "Mustard"
    },
    {
      "name": "Turşu",
      "nameEn": "Pickle",
      "optional": true
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Yumurtaları haşlayıp soğutun ve ikiye bölün.",
    "Sarılarını çıkarıp bir kaseye alın.",
    "Sarıları mayonez, hardal ve tuzla ezerek karıştırın.",
    "İsteğe bağlı ince doğranmış turşuyu ekleyin.",
    "Harcı yumurta beyazlarının içine doldurup üzerine pul biber serperek servis edin."
  ],
  "instructionsEn": [
    "Boil the eggs, let them cool, and slice them in half.",
    "Scoop out the yolks into a bowl.",
    "Mash the yolks with the mayonnaise, mustard, and salt.",
    "Stir in the finely chopped pickle, if using.",
    "Spoon the filling back into the egg whites, sprinkle with chili flakes, and serve."
  ]
},
{
  "name": "Kalamar Tava",
  "nameEn": "Fried Calamari",
  "category": "Appetizer",
  "ingredients": [
    {
      "name": "Kalamar",
      "nameEn": "Squid"
    },
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Ayçiçek Yağı",
      "nameEn": "Sunflower Oil"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Tartar Sos",
      "nameEn": "Tartar Sauce",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Kalamarları halkalar hâlinde doğrayın.",
    "Halkaları çırpılmış yumurtaya batırıp una bulayın.",
    "Bol sıcak yağda kısa sürede kızartın.",
    "Kağıt havlu üzerinde fazla yağını alın.",
    "Limon dilimleri ve isteğe bağlı tartar sosla sıcak servis edin."
  ],
  "instructionsEn": [
    "Cut the calamari into rings.",
    "Dip the rings in beaten egg, then coat them in flour.",
    "Fry briefly in plenty of hot oil.",
    "Drain the excess oil on paper towels.",
    "Serve hot with lemon wedges and tartar sauce, if desired."
  ]
},
{
  "name": "Ayran",
  "nameEn": "Turkish Yogurt Drink",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Yoğurt",
      "nameEn": "Yogurt"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Buz",
      "nameEn": "Ice",
      "optional": true
    },
    {
      "name": "Nane",
      "nameEn": "Mint",
      "optional": true
    }
  ],
  "instructions": [
    "Yoğurdu geniş bir kaba al.",
    "Üzerine soğuk su ekleyip tel çırpıcıyla köpürene kadar çırp.",
    "Tuzu ekleyip karıştır.",
    "Buzla dolu bardaklara paylaştır, istersen nane ile süsleyerek servis et."
  ],
  "instructionsEn": [
    "Put the yogurt in a large bowl.",
    "Add cold water and whisk until frothy.",
    "Stir in the salt.",
    "Pour into ice-filled glasses and garnish with mint if desired."
  ]
},
{
  "name": "Limonata",
  "nameEn": "Classic Lemonade",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Buz",
      "nameEn": "Ice",
      "optional": true
    },
    {
      "name": "Nane",
      "nameEn": "Mint",
      "optional": true
    }
  ],
  "instructions": [
    "Limonları yıkayıp sıkarak suyunu çıkar.",
    "Sürahiye limon suyunu, şekeri ve suyu ekleyip şeker erisin diye iyice karıştır.",
    "Buz ekle, istersen nane yaprağıyla süsleyerek servis et."
  ],
  "instructionsEn": [
    "Wash the lemons and squeeze out their juice.",
    "Combine the lemon juice, sugar, and water in a pitcher and stir until the sugar dissolves.",
    "Add ice and garnish with mint leaves if desired before serving."
  ]
},
{
  "name": "Naneli Limonlu Soda",
  "nameEn": "Sparkling Mint Lemonade",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Nane",
      "nameEn": "Mint"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Maden Sodası",
      "nameEn": "Soda Water"
    },
    {
      "name": "Buz",
      "nameEn": "Ice",
      "optional": true
    }
  ],
  "instructions": [
    "Limonları sıkıp suyunu bir bardağa al.",
    "Nane yapraklarını hafifçe ezerek limon suyuna kat.",
    "Şekeri ekleyip eriyene kadar karıştır.",
    "Üzerine buz ve soğuk maden sodası ekleyip nazikçe karıştırarak servis et."
  ],
  "instructionsEn": [
    "Squeeze the lemons and pour the juice into a glass.",
    "Lightly crush the mint leaves and add them to the lemon juice.",
    "Stir in the sugar until dissolved.",
    "Top with ice and cold soda water, stir gently, and serve."
  ]
},
{
  "name": "Türk Çayı",
  "nameEn": "Turkish Tea",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Siyah Çay",
      "nameEn": "Black Tea"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar",
      "optional": true
    }
  ],
  "instructions": [
    "Çaydanlığın alt kısmına su doldurup kaynat.",
    "Üst demliğe çayı koy ve az miktarda kaynar su ekleyerek 5 dakika demlenmeye bırak.",
    "Kaynayan suyu demliğe ekleyip demliği alt kısmın üzerine yerleştirerek 15-20 dakika demle.",
    "İnce belli bardaklara istediğin koyulukta süzerek doldur, istersen şeker ile servis et."
  ],
  "instructionsEn": [
    "Fill the bottom kettle with water and bring it to a boil.",
    "Add the tea leaves to the top teapot with a splash of boiling water and let them steep for 5 minutes.",
    "Pour the boiling water into the teapot, set it on top of the kettle, and brew for 15-20 minutes.",
    "Strain into tulip-shaped glasses to your preferred strength and serve with sugar if desired."
  ]
},
{
  "name": "Türk Kahvesi",
  "nameEn": "Turkish Coffee",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Kahve",
      "nameEn": "Coffee"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar",
      "optional": true
    }
  ],
  "instructions": [
    "Cezveye soğuk suyu ölç.",
    "Kahveyi ve istersen şekeri ekleyip karıştır.",
    "Kısık ateşte köpürene kadar yavaşça pişir, taşırmadan ocaktan al.",
    "Köpüğü fincanlara paylaştırıp kalanını fincanlara doldur, yanında su ile servis et."
  ],
  "instructionsEn": [
    "Measure cold water into the cezve (Turkish coffee pot).",
    "Add the coffee and sugar, if using, and stir well.",
    "Cook slowly over low heat until it foams, removing it from the heat just before it boils over.",
    "Spoon the foam into the cups, pour in the rest, and serve alongside a glass of water."
  ]
},
{
  "name": "Sahlep",
  "nameEn": "Turkish Salep",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Salep",
      "nameEn": "Salep Powder"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Tarçın",
      "nameEn": "Cinnamon",
      "optional": true
    }
  ],
  "instructions": [
    "Sütü bir tencerede ısıtmaya başla.",
    "Salebi az miktarda soğuk sütle karıştırarak topaklanmayan bir macun kıvamına getir.",
    "Salep karışımını ısınan süte ekleyip sürekli karıştırarak kaynat.",
    "Şekeri ilave edip kıvam koyulaşana kadar kısık ateşte pişirmeye devam et.",
    "Sıcak bardaklara paylaştır ve üzerine tarçın serperek servis et."
  ],
  "instructionsEn": [
    "Start heating the milk in a saucepan.",
    "Mix the salep powder with a little cold milk to form a smooth paste, preventing lumps.",
    "Stir the salep paste into the warming milk and bring to a boil, stirring constantly.",
    "Add the sugar and keep cooking over low heat until it thickens.",
    "Pour into warm cups and sprinkle with cinnamon before serving."
  ]
},
{
  "name": "Gül Şerbeti",
  "nameEn": "Rose Sherbet",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Gül Suyu",
      "nameEn": "Rose Water"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon",
      "optional": true
    }
  ],
  "instructions": [
    "Suyu ve şekeri bir tencereye alıp kaynatarak şurup kıvamına getir.",
    "Şurubu ocaktan alıp oda sıcaklığına gelene kadar soğut.",
    "Gül suyunu ve istersen birkaç damla limon suyunu şuruba ekleyip karıştır.",
    "Buzlu bardaklara dökerek soğuk servis et."
  ],
  "instructionsEn": [
    "Combine the water and sugar in a saucepan and boil until it forms a light syrup.",
    "Remove from the heat and let the syrup cool to room temperature.",
    "Stir in the rose water and a few drops of lemon juice, if using.",
    "Pour over ice into glasses and serve chilled."
  ]
},
{
  "name": "Vişne Şerbeti",
  "nameEn": "Sour Cherry Sherbet",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Vişne",
      "nameEn": "Sour Cherry"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Buz",
      "nameEn": "Ice",
      "optional": true
    }
  ],
  "instructions": [
    "Vişneleri çekirdeklerinden ayırıp bir tencereye al.",
    "Üzerine şekeri ve suyu ekleyip vişneler yumuşayana kadar kaynat.",
    "Karışımı süzgeçten geçirerek suyunu ayır ve soğumaya bırak.",
    "Soğuyan şerbeti buzlu bardaklara paylaştırarak servis et."
  ],
  "instructionsEn": [
    "Pit the sour cherries and place them in a saucepan.",
    "Add the sugar and water and simmer until the cherries soften.",
    "Strain the mixture to separate the juice and let it cool.",
    "Pour the cooled sherbet over ice and serve."
  ]
},
{
  "name": "Demirhindi Şerbeti",
  "nameEn": "Tamarind Sherbet",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Demirhindi",
      "nameEn": "Tamarind"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon",
      "optional": true
    }
  ],
  "instructions": [
    "Demirhindiyi ılık suda birkaç saat bekleterek yumuşat.",
    "Yumuşayan demirhindiyi elle ovarak suyunun içine karışmasını sağla, lif ve çekirdekleri süz.",
    "Süzülen suya şekeri ekleyip iyice karıştırarak eritene kadar bekle.",
    "İstersen birkaç damla limon suyu ekle ve buzlu bardaklarda soğuk servis et."
  ],
  "instructionsEn": [
    "Soak the tamarind in warm water for a few hours to soften it.",
    "Work the softened tamarind with your hands to release its pulp into the water, then strain out the fibers and seeds.",
    "Stir the sugar into the strained liquid until fully dissolved.",
    "Add a few drops of lemon juice if desired and serve chilled over ice."
  ]
},
{
  "name": "Tarçınlı Bal Sütü",
  "nameEn": "Cinnamon Honey Milk",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Bal",
      "nameEn": "Honey"
    },
    {
      "name": "Tarçın",
      "nameEn": "Cinnamon"
    }
  ],
  "instructions": [
    "Sütü bir tencerede kısık ateşte ısıt.",
    "Süt ısınınca tarçını ekleyip karıştır.",
    "Ocaktan aldıktan sonra balı ilave ederek karıştır.",
    "Ilık bardaklara paylaştırıp servis et."
  ],
  "instructionsEn": [
    "Warm the milk in a saucepan over low heat.",
    "Once the milk is warm, stir in the cinnamon.",
    "Remove from the heat and stir in the honey.",
    "Pour into warm cups and serve."
  ]
},
{
  "name": "Taze Portakal Suyu",
  "nameEn": "Fresh Orange Juice",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Portakal",
      "nameEn": "Orange"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar",
      "optional": true
    },
    {
      "name": "Buz",
      "nameEn": "Ice",
      "optional": true
    }
  ],
  "instructions": [
    "Portakalları yıkayıp ikiye kes.",
    "Narenciye sıkacağında suyunu çıkar.",
    "İstersen az şeker ekleyip karıştır.",
    "Buzlu bardaklara dökerek hemen servis et."
  ],
  "instructionsEn": [
    "Wash the oranges and cut them in half.",
    "Juice them using a citrus press.",
    "Stir in a little sugar if desired.",
    "Pour over ice and serve immediately."
  ]
},
{
  "name": "Elmalı Havuçlu Sıkma",
  "nameEn": "Apple Carrot Juice",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Elma",
      "nameEn": "Apple"
    },
    {
      "name": "Havuç",
      "nameEn": "Carrot"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon",
      "optional": true
    },
    {
      "name": "Su",
      "nameEn": "Water",
      "optional": true
    }
  ],
  "instructions": [
    "Elmaları ve havuçları iyice yıkayıp parçalara böl.",
    "Katı meyve sıkacağından geçirerek suyunu çıkar.",
    "İstersen birkaç damla limon suyu ekleyerek karıştır.",
    "Gerekirse biraz su ile inceltip bardaklara dökerek servis et."
  ],
  "instructionsEn": [
    "Wash the apples and carrots thoroughly and cut them into chunks.",
    "Run them through a juicer to extract the juice.",
    "Stir in a few drops of lemon juice if desired.",
    "Thin with a little water if needed, pour into glasses, and serve."
  ]
},
{
  "name": "Muzlu Süt Smoothie",
  "nameEn": "Banana Milk Smoothie",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Muz",
      "nameEn": "Banana"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Bal",
      "nameEn": "Honey",
      "optional": true
    },
    {
      "name": "Tarçın",
      "nameEn": "Cinnamon",
      "optional": true
    }
  ],
  "instructions": [
    "Muzu soyup parçalara böl.",
    "Muzu, sütü ve istersen balı blendera ekle.",
    "Pürüzsüz bir kıvam alana kadar karıştır.",
    "Bardaklara dökerek üzerine biraz tarçın serperek servis et."
  ],
  "instructionsEn": [
    "Peel the banana and cut it into chunks.",
    "Add the banana, milk, and honey, if using, to a blender.",
    "Blend until smooth and creamy.",
    "Pour into glasses, sprinkle with a little cinnamon, and serve."
  ]
},
{
  "name": "Çilekli Smoothie",
  "nameEn": "Strawberry Smoothie",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Çilek",
      "nameEn": "Strawberry"
    },
    {
      "name": "Yoğurt",
      "nameEn": "Yogurt"
    },
    {
      "name": "Bal",
      "nameEn": "Honey",
      "optional": true
    },
    {
      "name": "Buz",
      "nameEn": "Ice",
      "optional": true
    }
  ],
  "instructions": [
    "Çilekleri yıkayıp saplarını ayıkla.",
    "Çilekleri, yoğurdu ve istersen balı blendera al.",
    "Buz ekleyip pürüzsüz kıvam alana kadar karıştır.",
    "Bardaklara paylaştırarak hemen servis et."
  ],
  "instructionsEn": [
    "Wash the strawberries and remove the stems.",
    "Add the strawberries, yogurt, and honey, if using, to a blender.",
    "Add ice and blend until smooth.",
    "Pour into glasses and serve right away."
  ]
},
{
  "name": "Yeşil Detoks Smoothie",
  "nameEn": "Green Detox Smoothie",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Ispanak",
      "nameEn": "Spinach"
    },
    {
      "name": "Elma",
      "nameEn": "Apple"
    },
    {
      "name": "Muz",
      "nameEn": "Banana"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    }
  ],
  "instructions": [
    "Ispanağı iyice yıkayıp süz.",
    "Elmayı çekirdeklerinden ayırıp doğra, muzu soy.",
    "Tüm malzemeleri limon suyu ve su ile birlikte blendera ekle.",
    "Pürüzsüz bir kıvam alana kadar karıştırıp bardaklara dökerek servis et."
  ],
  "instructionsEn": [
    "Wash the spinach thoroughly and drain it.",
    "Core and chop the apple, and peel the banana.",
    "Add everything to the blender along with the lemon juice and water.",
    "Blend until smooth, pour into glasses, and serve."
  ]
},
{
  "name": "Karpuz Nane Kokteyli",
  "nameEn": "Watermelon Mint Cooler",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Karpuz",
      "nameEn": "Watermelon"
    },
    {
      "name": "Nane",
      "nameEn": "Mint"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon",
      "optional": true
    },
    {
      "name": "Buz",
      "nameEn": "Ice",
      "optional": true
    }
  ],
  "instructions": [
    "Karpuzun çekirdeklerini ayıklayıp küp küp doğra.",
    "Karpuz küplerini nane yapraklarıyla birlikte blendera al.",
    "İstersen birkaç damla limon suyu ekleyerek pürüzsüz olana kadar karıştır.",
    "Buzlu bardaklara süzerek veya süzmeden dökerek servis et."
  ],
  "instructionsEn": [
    "Remove the seeds from the watermelon and cut it into cubes.",
    "Blend the watermelon cubes with the mint leaves.",
    "Add a few drops of lemon juice if desired and blend until smooth.",
    "Pour over ice, straining if you like a smoother texture, and serve."
  ]
},
{
  "name": "Nar Suyu",
  "nameEn": "Pomegranate Juice",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Nar",
      "nameEn": "Pomegranate"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar",
      "optional": true
    },
    {
      "name": "Buz",
      "nameEn": "Ice",
      "optional": true
    }
  ],
  "instructions": [
    "Narın tanelerini ayıkla.",
    "Taneleri narenciye sıkacağı veya katı meyve sıkacağından geçirerek suyunu çıkar.",
    "İstersen az şeker ekleyip karıştır.",
    "Buzlu bardaklara dökerek soğuk servis et."
  ],
  "instructionsEn": [
    "Separate the pomegranate seeds from the fruit.",
    "Extract the juice by pressing the seeds through a juicer.",
    "Stir in a little sugar if desired.",
    "Pour over ice and serve chilled."
  ]
},
{
  "name": "Çikolatalı Milkshake",
  "nameEn": "Chocolate Milkshake",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Dondurma",
      "nameEn": "Ice Cream"
    },
    {
      "name": "Çikolata",
      "nameEn": "Chocolate"
    },
    {
      "name": "Krema",
      "nameEn": "Whipped Cream",
      "optional": true
    }
  ],
  "instructions": [
    "Dondurmayı, sütü ve çikolatayı blendera ekle.",
    "Kıvamı yoğun ve pürüzsüz olana kadar karıştır.",
    "Soğuk bardaklara dök.",
    "İstersen üzerine krema sıkarak servis et."
  ],
  "instructionsEn": [
    "Add the ice cream, milk, and chocolate to a blender.",
    "Blend until thick and smooth.",
    "Pour into chilled glasses.",
    "Top with whipped cream, if desired, and serve."
  ]
},
{
  "name": "Vanilyalı Milkshake",
  "nameEn": "Vanilla Milkshake",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Dondurma",
      "nameEn": "Ice Cream"
    },
    {
      "name": "Vanilya",
      "nameEn": "Vanilla"
    },
    {
      "name": "Krema",
      "nameEn": "Whipped Cream",
      "optional": true
    }
  ],
  "instructions": [
    "Dondurmayı, sütü ve vanilyayı blendera ekle.",
    "Kıvamı koyulaşana kadar yüksek hızda karıştır.",
    "Soğutulmuş bardaklara paylaştır.",
    "İstersen üzerine krema ekleyerek hemen servis et."
  ],
  "instructionsEn": [
    "Add the ice cream, milk, and vanilla to a blender.",
    "Blend on high speed until thick.",
    "Pour into chilled glasses.",
    "Top with whipped cream, if desired, and serve right away."
  ]
},
{
  "name": "Ihlamur Çayı",
  "nameEn": "Linden Tea",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Ihlamur",
      "nameEn": "Linden Flower"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Bal",
      "nameEn": "Honey",
      "optional": true
    },
    {
      "name": "Limon",
      "nameEn": "Lemon",
      "optional": true
    }
  ],
  "instructions": [
    "Suyu bir tencerede kaynat.",
    "Kaynayan suyu ocaktan alıp ihlamur çiçeklerini ekle.",
    "Üzerini kapatıp 5-7 dakika demlenmeye bırak.",
    "Süzerek fincanlara doldur, istersen bal ve limon ile tatlandırarak servis et."
  ],
  "instructionsEn": [
    "Bring the water to a boil in a saucepan.",
    "Remove from the heat and add the linden flowers.",
    "Cover and let it steep for 5-7 minutes.",
    "Strain into cups and sweeten with honey and lemon, if desired, before serving."
  ]
},
{
  "name": "Adaçayı",
  "nameEn": "Sage Tea",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Adaçayı",
      "nameEn": "Sage"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Bal",
      "nameEn": "Honey",
      "optional": true
    }
  ],
  "instructions": [
    "Suyu kaynatana kadar ısıt.",
    "Kaynayan suya adaçayı yapraklarını ekle.",
    "Üzerini kapatıp 5 dakika demlenmeye bırak.",
    "Süzerek fincanlara doldur, istersen bal ile tatlandırarak servis et."
  ],
  "instructionsEn": [
    "Heat the water until it comes to a boil.",
    "Add the sage leaves to the boiling water.",
    "Cover and let it steep for 5 minutes.",
    "Strain into cups and sweeten with honey, if desired, before serving."
  ]
},
{
  "name": "Zencefilli Limon Çayı",
  "nameEn": "Ginger Lemon Tea",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Zencefil",
      "nameEn": "Ginger"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Bal",
      "nameEn": "Honey",
      "optional": true
    }
  ],
  "instructions": [
    "Zencefili ince ince dilimle veya rendele.",
    "Suyu bir tencerede zencefille birlikte kaynat.",
    "Kısık ateşte 5 dakika kaynatarak zencefilin aromasının suya geçmesini sağla.",
    "Ocaktan alıp limon suyunu ekle, istersen bal ile tatlandırarak süzerek servis et."
  ],
  "instructionsEn": [
    "Thinly slice or grate the ginger.",
    "Bring the water to a boil in a saucepan with the ginger.",
    "Simmer for 5 minutes over low heat to let the ginger's flavor infuse the water.",
    "Remove from the heat, stir in the lemon juice, sweeten with honey if desired, and strain before serving."
  ]
},
{
  "name": "Sıcak Çikolata",
  "nameEn": "Hot Chocolate",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Kakao",
      "nameEn": "Cocoa Powder"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Çikolata",
      "nameEn": "Chocolate",
      "optional": true
    },
    {
      "name": "Krema",
      "nameEn": "Whipped Cream",
      "optional": true
    }
  ],
  "instructions": [
    "Sütü bir tencerede ısıtmaya başla.",
    "Kakao ve şekeri ekleyip topaklanmadan karıştır.",
    "İstersen doğranmış çikolatayı ekleyip eriyene kadar kısık ateşte karıştırmaya devam et.",
    "Köpürmeden kaynamaya yakın kıvama gelince ocaktan al.",
    "Sıcak bardaklara paylaştır, istersen üzerine krema ekleyerek servis et."
  ],
  "instructionsEn": [
    "Start warming the milk in a saucepan.",
    "Add the cocoa powder and sugar, whisking to avoid lumps.",
    "Add chopped chocolate, if using, and keep stirring over low heat until it melts.",
    "Remove from the heat just before it comes to a boil.",
    "Pour into warm cups, top with whipped cream if desired, and serve."
  ]
},
{
  "name": "Şeftalili Buzlu Çay",
  "nameEn": "Peach Iced Tea",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Siyah Çay",
      "nameEn": "Black Tea"
    },
    {
      "name": "Şeftali",
      "nameEn": "Peach"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar",
      "optional": true
    },
    {
      "name": "Buz",
      "nameEn": "Ice"
    }
  ],
  "instructions": [
    "Suyu kaynatıp çayı ekleyerek 10 dakika demle.",
    "Demli çayı süzüp oda sıcaklığına gelene kadar soğut.",
    "Şeftaliyi küçük parçalara doğrayıp çaya ekle.",
    "İstersen şeker ekleyip karıştır.",
    "Buzlu bardaklara dökerek soğuk servis et."
  ],
  "instructionsEn": [
    "Boil the water, add the tea, and let it steep for 10 minutes.",
    "Strain the tea and let it cool to room temperature.",
    "Cut the peach into small pieces and add them to the tea.",
    "Stir in sugar if desired.",
    "Pour over ice and serve chilled."
  ]
},
{
  "name": "Buzlu Kahve Frappe",
  "nameEn": "Iced Coffee Frappe",
  "category": "Drink",
  "ingredients": [
    {
      "name": "Kahve",
      "nameEn": "Coffee"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Buz",
      "nameEn": "Ice"
    },
    {
      "name": "Krema",
      "nameEn": "Whipped Cream",
      "optional": true
    }
  ],
  "instructions": [
    "Kahveyi az miktarda sıcak suyla eritip soğumaya bırak.",
    "Soğuyan kahveyi, sütü, şekeri ve buzu blendera ekle.",
    "Köpürüp yoğun bir kıvam alana kadar yüksek hızda karıştır.",
    "Soğuk bardaklara dök.",
    "İstersen üzerine krema ekleyerek servis et."
  ],
  "instructionsEn": [
    "Dissolve the coffee in a small amount of hot water and let it cool.",
    "Add the cooled coffee, milk, sugar, and ice to a blender.",
    "Blend on high speed until frothy and thick.",
    "Pour into chilled glasses.",
    "Top with whipped cream, if desired, and serve."
  ]
},
{
  "name": "Baklava",
  "nameEn": "Baklava",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Yufka",
      "nameEn": "Phyllo Dough"
    },
    {
      "name": "Ceviz",
      "nameEn": "Walnut"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Antep Fıstığı",
      "nameEn": "Pistachio",
      "optional": true
    }
  ],
  "instructions": [
    "Yufkaları tek tek eritilmiş tereyağı ile yağlayarak yağlanmış fırın tepsisine dizin.",
    "Yufkaların arasına iri kıyılmış cevizi eşit şekilde serpiştirin.",
    "Kalan yufkaları da yağlayarak dizmeye devam edin ve üst yüzeyi düzeltin.",
    "Baklavayı bıçakla eşkenar dörtgen dilimler halinde kesin.",
    "Önceden ısıtılmış 180 derece fırında üzeri altın rengi alana kadar pişirin.",
    "Şeker ve suyu kaynatıp birkaç damla limon ekleyerek şerbeti hazırlayın.",
    "Fırından çıkan sıcak baklavanın üzerine soğumuş şerbeti gezdirin ve isteğe bağlı olarak dövülmüş antep fıstığı serpin."
  ],
  "instructionsEn": [
    "Brush the phyllo sheets one by one with melted butter and layer them in a greased baking pan.",
    "Sprinkle coarsely chopped walnuts evenly between the layers.",
    "Continue buttering and layering the remaining phyllo sheets, smoothing the top.",
    "Cut the baklava into diamond-shaped pieces with a sharp knife.",
    "Bake in a preheated oven at 180°C (350°F) until golden brown on top.",
    "Boil the sugar and water together, then stir in a few drops of lemon juice to make the syrup.",
    "Pour the cooled syrup over the hot baklava straight from the oven and sprinkle with crushed pistachios if desired."
  ]
},
{
  "name": "Künefe",
  "nameEn": "Kunefe",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Kadayıf",
      "nameEn": "Shredded Phyllo Dough"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Kaşar Peyniri",
      "nameEn": "Kashar Cheese"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Antep Fıstığı",
      "nameEn": "Pistachio",
      "optional": true
    }
  ],
  "instructions": [
    "Kadayıfı elinizle ufalayarak eritilmiş tereyağı ile iyice yoğurun.",
    "Kadayıfın yarısını yağlı bir tepsiye bastırarak yayın.",
    "Üzerine rendelenmiş kaşar peynirini serpin ve kalan kadayıfla kapatıp bastırın.",
    "Tepsiyi ocakta veya fırında her iki yüzü de kızarana kadar pişirin.",
    "Sıcak künefenin üzerine kaynatılmış şerbeti gezdirin ve isteğe bağlı olarak antep fıstığı serpip sıcak servis edin."
  ],
  "instructionsEn": [
    "Crumble the shredded phyllo dough by hand and knead it thoroughly with melted butter.",
    "Press half of the mixture into a greased pan in an even layer.",
    "Sprinkle grated kashar cheese on top, then cover with the remaining mixture and press down.",
    "Cook the pan on the stovetop or in the oven until both sides are golden and crisp.",
    "Pour hot syrup over the freshly cooked kunefe, sprinkle with pistachios if desired, and serve immediately while hot."
  ]
},
{
  "name": "Tulumba Tatlısı",
  "nameEn": "Turkish Fried Dough in Syrup",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Yaş Maya",
      "nameEn": "Fresh Yeast"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Sıvı Yağ",
      "nameEn": "Vegetable Oil"
    }
  ],
  "instructions": [
    "Su ve tereyağını tencerede kaynatıp ocaktan alın.",
    "Unu kaynayan karışıma ekleyip pürüzsüz bir hamur oluşana kadar karıştırın.",
    "Hamur ılınınca yaş mayayı ve yumurtaları teker teker ekleyerek yoğurun.",
    "Hamuru sıkma torbasına alıp kızgın sıvı yağa küçük parçalar halinde sıkarak altın rengi olana kadar kızartın.",
    "Şeker, su ve limonu kaynatarak koyu kıvamlı bir şerbet hazırlayın.",
    "Kızarmış tulumbaları sıcakken soğuk şerbete atıp birkaç dakika bekletin.",
    "Şerbeti iyice çeken tulumbaları süzüp servis tabağına alın."
  ],
  "instructionsEn": [
    "Boil the water and butter together in a saucepan, then remove from heat.",
    "Add the flour to the boiling mixture and stir until a smooth dough forms.",
    "Once the dough has cooled slightly, knead in the fresh yeast and eggs one at a time.",
    "Pipe small pieces of the dough directly into hot oil and fry until golden brown.",
    "Boil the sugar, water, and lemon juice together to make a thick syrup.",
    "Drop the hot fried tulumbas into the cold syrup and let them soak for a few minutes.",
    "Drain the syrup-soaked tulumbas and arrange them on a serving plate."
  ]
},
{
  "name": "Şekerpare",
  "nameEn": "Semolina Cookies in Syrup",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "İrmik",
      "nameEn": "Semolina"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Kabartma Tozu",
      "nameEn": "Baking Powder"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Antep Fıstığı",
      "nameEn": "Pistachio",
      "optional": true
    }
  ],
  "instructions": [
    "Tereyağı, şeker ve yumurtayı derin bir kapta krema kıvamına gelene kadar çırpın.",
    "İrmik, un ve kabartma tozunu ekleyip yumuşak bir hamur elde edene kadar yoğurun.",
    "Hamurdan küçük parçalar koparıp yuvarlayın ve üzerine antep fıstığı bastırarak fırın tepsisine dizin.",
    "Önceden ısıtılmış fırında altın sarısı renk alana kadar pişirin.",
    "Şeker ve suyu kaynatıp ılık kıvamda bir şerbet hazırlayın.",
    "Fırından çıkan sıcak kurabiyelerin üzerine ılık şerbeti gezdirip dinlendirin."
  ],
  "instructionsEn": [
    "Beat the butter, sugar, and egg together in a bowl until creamy.",
    "Add the semolina, flour, and baking powder, then knead into a soft dough.",
    "Pinch off small pieces of dough, shape into balls, press a pistachio on top of each, and arrange on a baking tray.",
    "Bake in a preheated oven until golden brown.",
    "Boil the sugar and water together to make a warm syrup.",
    "Pour the warm syrup over the hot cookies as soon as they come out of the oven and let them rest."
  ]
},
{
  "name": "Revani",
  "nameEn": "Semolina Sponge Cake in Syrup",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "İrmik",
      "nameEn": "Semolina"
    },
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Yoğurt",
      "nameEn": "Yogurt"
    },
    {
      "name": "Kabartma Tozu",
      "nameEn": "Baking Powder"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    }
  ],
  "instructions": [
    "Yumurta ve şekeri çırpıp yoğurdu ekleyerek karıştırın.",
    "İrmik, un ve kabartma tozunu ekleyip pürüzsüz bir kek hamuru elde edin.",
    "Hamuru yağlanmış tepsiye dökün ve önceden ısıtılmış fırında pişirin.",
    "Şeker, su ve limonu kaynatarak şerbeti hazırlayın.",
    "Fırından çıkan sıcak keki dilimleyin.",
    "Sıcak dilimlerin üzerine soğuk şerbeti gezdirip şerbeti çekene kadar bekletin."
  ],
  "instructionsEn": [
    "Beat the eggs and sugar together, then mix in the yogurt.",
    "Add the semolina, flour, and baking powder to form a smooth cake batter.",
    "Pour the batter into a greased baking pan and bake in a preheated oven.",
    "Boil the sugar, water, and lemon juice together to make the syrup.",
    "Slice the hot cake as soon as it comes out of the oven.",
    "Pour the cold syrup over the hot slices and let it soak in before serving."
  ]
},
{
  "name": "Lokma",
  "nameEn": "Turkish Fritters in Syrup",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Yaş Maya",
      "nameEn": "Fresh Yeast"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    },
    {
      "name": "Sıvı Yağ",
      "nameEn": "Vegetable Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Ilık suda yaş mayayı ve bir tutam şekeri eritip 10 dakika bekletin.",
    "Un ve tuzu ekleyip pürüzsüz, akışkan bir hamur elde edene kadar iyice çırpın.",
    "Hamuru üzeri örtülü şekilde kabarana kadar mayalandırın.",
    "Elinizle küçük parçalar koparıp kızgın sıvı yağda altın rengi olana kadar kızartın.",
    "Şeker, su ve limonla hazırladığınız soğuk şerbete kızarmış lokmaları atıp iyice şerbeti çektikten sonra servis edin."
  ],
  "instructionsEn": [
    "Dissolve the fresh yeast and a pinch of sugar in lukewarm water and let sit for 10 minutes.",
    "Add the flour and salt, then whisk vigorously until you get a smooth, pourable batter.",
    "Cover the batter and let it rise until bubbly.",
    "Drop small pieces of the batter by hand into hot oil and fry until golden brown.",
    "Soak the fried lokma in cold syrup made from sugar, water, and lemon until well absorbed, then serve."
  ]
},
{
  "name": "Ekmek Kadayıfı",
  "nameEn": "Bread Pudding in Syrup",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Ekmek",
      "nameEn": "Bread"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Kaymak",
      "nameEn": "Clotted Cream",
      "optional": true
    },
    {
      "name": "Antep Fıstığı",
      "nameEn": "Pistachio",
      "optional": true
    }
  ],
  "instructions": [
    "Bayat ekmek dilimlerini fırın tepsisine dizip hafifçe kızartın.",
    "Şeker ve suyu kaynatarak koyu kıvamlı bir şerbet hazırlayın.",
    "Sıcak şerbeti kızarmış ekmek dilimlerinin üzerine yavaşça gezdirin.",
    "Ekmeğin şerbeti tamamen çekmesini bekleyin.",
    "Servis ederken üzerine isteğe bağlı olarak kaymak ve antep fıstığı ekleyin."
  ],
  "instructionsEn": [
    "Arrange slices of stale bread on a baking tray and toast lightly.",
    "Boil the sugar and water together to make a thick syrup.",
    "Slowly pour the hot syrup over the toasted bread slices.",
    "Let the bread fully absorb the syrup.",
    "Top with clotted cream and pistachios if desired before serving."
  ]
},
{
  "name": "Kazandibi",
  "nameEn": "Caramelized Milk Pudding",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Nişasta",
      "nameEn": "Cornstarch"
    },
    {
      "name": "Pirinç Unu",
      "nameEn": "Rice Flour"
    },
    {
      "name": "Vanilya",
      "nameEn": "Vanilla"
    }
  ],
  "instructions": [
    "Süt, şeker, nişasta ve pirinç ununu bir tencerede pürüzsüz olana kadar karıştırın.",
    "Karışımı orta ateşte sürekli karıştırarak koyu bir kıvama gelene kadar pişirin.",
    "Vanilyayı ekleyip birkaç dakika daha karıştırın.",
    "Karışımın bir kısmını yağlanmış geniş bir tepsiye ince şekilde yayın.",
    "Tepsiyi ocak üzerinde altı hafifçe kararana kadar pişirip yakın.",
    "Kararmış tabakayı rulo yapıp dilimleyin, kalan muhallebiyi üzerine dökerek servis edin."
  ],
  "instructionsEn": [
    "Whisk the milk, sugar, cornstarch, and rice flour together in a saucepan until smooth.",
    "Cook over medium heat, stirring constantly, until the mixture thickens.",
    "Stir in the vanilla and cook for a few more minutes.",
    "Spread a portion of the mixture thinly over a greased wide tray.",
    "Place the tray over direct heat until the bottom is lightly charred.",
    "Roll up the charred layer, slice it, and serve topped with the remaining pudding."
  ]
},
{
  "name": "Fırın Sütlaç",
  "nameEn": "Baked Rice Pudding",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Pirinç",
      "nameEn": "Rice"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Nişasta",
      "nameEn": "Cornstarch"
    },
    {
      "name": "Vanilya",
      "nameEn": "Vanilla"
    }
  ],
  "instructions": [
    "Pirinci az suda yumuşayana kadar haşlayın.",
    "Haşlanmış pirincin üzerine sütü ekleyip kaynatın.",
    "Şeker ve nişastayı bir miktar soğuk sütle açıp karışıma ilave edin.",
    "Vanilyayı ekleyip koyulaşana kadar karıştırarak pişirin.",
    "Karışımı küçük kaselere paylaştırıp önceden ısıtılmış fırında üzeri benekli kızarana kadar pişirin."
  ],
  "instructionsEn": [
    "Boil the rice in a small amount of water until softened.",
    "Add the milk to the softened rice and bring to a boil.",
    "Dissolve the sugar and cornstarch in a little cold milk and stir into the mixture.",
    "Add the vanilla and cook, stirring, until thickened.",
    "Divide the mixture into small bowls and bake in a preheated oven until speckled and golden on top."
  ]
},
{
  "name": "Keşkül",
  "nameEn": "Almond Milk Pudding",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Nişasta",
      "nameEn": "Cornstarch"
    },
    {
      "name": "Badem",
      "nameEn": "Almond"
    },
    {
      "name": "Vanilya",
      "nameEn": "Vanilla"
    },
    {
      "name": "Antep Fıstığı",
      "nameEn": "Pistachio",
      "optional": true
    }
  ],
  "instructions": [
    "Bademleri kabuklarını soyup ince ince öğütün.",
    "Süt, şeker ve nişastayı bir tencerede karıştırın.",
    "Öğütülmüş bademi ekleyip orta ateşte sürekli karıştırarak kaynatın.",
    "Karışım koyulaşınca vanilyayı ekleyip ocaktan alın.",
    "Sıcak muhallebiyi kaselere paylaştırıp soğuduktan sonra üzerine isteğe bağlı olarak antep fıstığı serpip servis edin."
  ],
  "instructionsEn": [
    "Peel the almonds and grind them finely.",
    "Combine the milk, sugar, and cornstarch in a saucepan.",
    "Add the ground almonds and bring to a boil over medium heat, stirring constantly.",
    "Once thickened, stir in the vanilla and remove from heat.",
    "Divide the warm pudding into bowls, let cool, and sprinkle with pistachios if desired before serving."
  ]
},
{
  "name": "Trileçe",
  "nameEn": "Tres Leches Cake",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Krema",
      "nameEn": "Heavy Cream"
    },
    {
      "name": "Kabartma Tozu",
      "nameEn": "Baking Powder"
    },
    {
      "name": "Vanilya",
      "nameEn": "Vanilla"
    }
  ],
  "instructions": [
    "Yumurta ve şekeri hacmi iki katına çıkana kadar çırpın.",
    "Un ve kabartma tozunu ekleyip hafifçe karıştırarak kek hamuru hazırlayın.",
    "Hamuru yağlanmış tepsiye dökün ve fırında pişirin.",
    "Pişen keki çatalla delip süt, krema ve vanilyadan oluşan karışımı üzerine gezdirin.",
    "Kekin sıvıyı tamamen emmesi için buzdolabında birkaç saat bekletin.",
    "Servis etmeden önce üzerine krema sürüp soğuk olarak sunun."
  ],
  "instructionsEn": [
    "Whisk the eggs and sugar together until doubled in volume.",
    "Gently fold in the flour and baking powder to make a cake batter.",
    "Pour the batter into a greased pan and bake.",
    "Poke holes all over the baked cake with a fork and pour the milk, cream, and vanilla mixture over it.",
    "Refrigerate for a few hours until the cake fully absorbs the liquid.",
    "Spread whipped cream on top and serve cold."
  ]
},
{
  "name": "Un Helvası",
  "nameEn": "Toasted Flour Helva",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Çam Fıstığı",
      "nameEn": "Pine Nut",
      "optional": true
    }
  ],
  "instructions": [
    "Tereyağını tencerede eritip çam fıstığını hafifçe kavurun.",
    "Unu ekleyip koku çıkana ve rengi koyulaşana kadar kısık ateşte sürekli karıştırarak kavurun.",
    "Şeker ve sütü ayrı bir tencerede kaynatıp şurup hazırlayın.",
    "Sıcak şurubu kavrulmuş una yavaşça, karıştırarak ekleyin.",
    "Ocaktan alıp üzeri kapalı şekilde dinlendirdikten sonra sıcak veya ılık servis edin."
  ],
  "instructionsEn": [
    "Melt the butter in a saucepan and lightly toast the pine nuts in it.",
    "Add the flour and toast over low heat, stirring constantly, until fragrant and golden brown.",
    "In a separate pot, boil the sugar and milk together to make a syrup.",
    "Slowly pour the hot syrup into the toasted flour while stirring continuously.",
    "Remove from heat, let rest covered, and serve warm or hot."
  ]
},
{
  "name": "İrmik Helvası",
  "nameEn": "Semolina Helva",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "İrmik",
      "nameEn": "Semolina"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Çam Fıstığı",
      "nameEn": "Pine Nut",
      "optional": true
    },
    {
      "name": "Vanilya",
      "nameEn": "Vanilla"
    }
  ],
  "instructions": [
    "Tereyağını eritip çam fıstığını kavurun.",
    "İrmiği ekleyip kısık ateşte rengi altın sarısı olana kadar kavurun.",
    "Şeker ve sütü ayrı bir tencerede kaynatın.",
    "Sıcak sütlü şurubu kavrulmuş irmiğe yavaşça dökerek karıştırın ve vanilyayı ekleyin.",
    "Kısık ateşte suyunu çekene kadar pişirip ocaktan alarak dinlendirin ve ılık servis edin."
  ],
  "instructionsEn": [
    "Melt the butter and toast the pine nuts in it.",
    "Add the semolina and toast over low heat until golden brown.",
    "In a separate pot, boil the sugar and milk together.",
    "Slowly pour the hot milk syrup into the toasted semolina while stirring, then add the vanilla.",
    "Cook over low heat until the liquid is absorbed, remove from heat, let rest, and serve warm."
  ]
},
{
  "name": "Ayva Tatlısı",
  "nameEn": "Poached Quince Dessert",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Ayva",
      "nameEn": "Quince"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Karanfil",
      "nameEn": "Cloves",
      "optional": true
    },
    {
      "name": "Kaymak",
      "nameEn": "Clotted Cream",
      "optional": true
    },
    {
      "name": "Ceviz",
      "nameEn": "Walnut",
      "optional": true
    }
  ],
  "instructions": [
    "Ayvaları ikiye bölüp çekirdeklerini oyarak çıkarın.",
    "Ayvaları kesik yüzü üstte kalacak şekilde geniş bir tencereye dizin.",
    "Şeker, su ve karanfili üzerine ekleyip kapağı kapatarak ayvalar yumuşayana kadar pişirin.",
    "Ayvaları pişirme suyunda kızıl bir renk alana kadar ağır ateşte pişirmeye devam edin.",
    "Soğuduktan sonra üzerine isteğe bağlı olarak kaymak ve dövülmüş ceviz ekleyerek servis edin."
  ],
  "instructionsEn": [
    "Halve the quinces and scoop out the cores.",
    "Arrange the quince halves cut side up in a wide pot.",
    "Add the sugar, water, and cloves, cover, and cook until the quinces soften.",
    "Continue cooking over low heat until the quinces turn a deep reddish color in their own syrup.",
    "Once cooled, serve topped with clotted cream and crushed walnuts if desired."
  ]
},
{
  "name": "Kabak Tatlısı",
  "nameEn": "Candied Pumpkin Dessert",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Kabak",
      "nameEn": "Pumpkin"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Ceviz",
      "nameEn": "Walnut",
      "optional": true
    },
    {
      "name": "Kaymak",
      "nameEn": "Clotted Cream",
      "optional": true
    }
  ],
  "instructions": [
    "Kabağı kalın dilimler halinde kesip kabuğunu soyun.",
    "Dilimleri geniş bir tencereye dizip üzerine bol şeker serpin ve birkaç saat dinlendirin.",
    "Kabak suyunu bırakınca kısık ateşte kendi suyunda yumuşayıp koyu kehribar rengi alana kadar pişirin.",
    "Soğuttuktan sonra üzerine isteğe bağlı olarak ceviz ve kaymak ekleyerek servis edin."
  ],
  "instructionsEn": [
    "Cut the pumpkin into thick slices and peel off the skin.",
    "Arrange the slices in a wide pot, sprinkle generously with sugar, and let sit for a few hours.",
    "Once the pumpkin releases its juices, cook over low heat in its own syrup until soft and deep amber in color.",
    "Let cool and serve topped with walnuts and clotted cream if desired."
  ]
},
{
  "name": "Elmalı Turta",
  "nameEn": "Apple Tart",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Elma",
      "nameEn": "Apple"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Tarçın",
      "nameEn": "Cinnamon"
    },
    {
      "name": "Kabartma Tozu",
      "nameEn": "Baking Powder"
    }
  ],
  "instructions": [
    "Un, tereyağı, şeker ve kabartma tozunu ovarak kırıntı kıvamında bir hamur elde edin.",
    "Hamurun bir kısmını tart kalıbının tabanına ve kenarlarına yayın.",
    "Elmaları ince dilimleyip tarçın ve şekerle karıştırın.",
    "Elma dilimlerini hamurun üzerine düzenli şekilde dizin.",
    "Kalan hamuru üzerine ufalayıp yumurta sarısıyla yüzeyini fırçalayın.",
    "Önceden ısıtılmış fırında üzeri altın rengi alana kadar pişirin."
  ],
  "instructionsEn": [
    "Rub together the flour, butter, sugar, and baking powder until the mixture resembles coarse crumbs.",
    "Press part of the dough into the base and sides of a tart pan.",
    "Thinly slice the apples and toss them with cinnamon and sugar.",
    "Arrange the apple slices neatly over the dough.",
    "Crumble the remaining dough on top and brush the surface with beaten egg yolk.",
    "Bake in a preheated oven until golden brown on top."
  ]
},
{
  "name": "Islak Kek",
  "nameEn": "Chocolate Syrup Cake",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Kakao",
      "nameEn": "Cocoa Powder"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Kabartma Tozu",
      "nameEn": "Baking Powder"
    },
    {
      "name": "Sıvı Yağ",
      "nameEn": "Vegetable Oil"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    }
  ],
  "instructions": [
    "Yumurta ve şekeri köpük kıvamına gelene kadar çırpın.",
    "Sıvı yağ ve sütü ekleyip karıştırmaya devam edin.",
    "Un, kakao ve kabartma tozunu eleyerek karışıma ekleyin ve pürüzsüz bir hamur elde edin.",
    "Hamuru yağlanmış kalıba dökün ve önceden ısıtılmış fırında pişirin.",
    "Şeker, kakao ve suyu kaynatarak çikolatalı bir şurup hazırlayın.",
    "Fırından çıkan sıcak kekin üzerine sıcak şurubu gezdirip soğumaya bırakın."
  ],
  "instructionsEn": [
    "Beat the eggs and sugar together until foamy.",
    "Add the vegetable oil and milk, continuing to mix.",
    "Sift in the flour, cocoa powder, and baking powder, and mix into a smooth batter.",
    "Pour the batter into a greased pan and bake in a preheated oven.",
    "Boil sugar, cocoa powder, and water together to make a chocolate syrup.",
    "Pour the hot syrup over the hot cake as soon as it comes out of the oven, then let it cool."
  ]
},
{
  "name": "Un Kurabiyesi",
  "nameEn": "Turkish Shortbread Cookies",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Pudra Şekeri",
      "nameEn": "Powdered Sugar"
    },
    {
      "name": "Nişasta",
      "nameEn": "Cornstarch"
    },
    {
      "name": "Vanilya",
      "nameEn": "Vanilla"
    },
    {
      "name": "Kabartma Tozu",
      "nameEn": "Baking Powder"
    }
  ],
  "instructions": [
    "Oda sıcaklığındaki tereyağı ve pudra şekerini krema kıvamına gelene kadar çırpın.",
    "Vanilyayı ekleyip karıştırın.",
    "Un, nişasta ve kabartma tozunu eleyerek karışıma katın ve yumuşak bir hamur yoğurun.",
    "Hamurdan küçük parçalar koparıp istediğiniz şekli vererek fırın tepsisine dizin.",
    "Önceden ısıtılmış fırında altı hafif renk alana kadar pişirip üzerine pudra şekeri serperek servis edin."
  ],
  "instructionsEn": [
    "Beat the room-temperature butter and powdered sugar together until creamy.",
    "Mix in the vanilla.",
    "Sift in the flour, cornstarch, and baking powder, then knead into a soft dough.",
    "Pinch off small pieces of dough, shape as desired, and arrange on a baking tray.",
    "Bake in a preheated oven until lightly golden on the bottom, then dust with powdered sugar before serving."
  ]
},
{
  "name": "Cevizli Kek",
  "nameEn": "Walnut Cake",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Ceviz",
      "nameEn": "Walnut"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Sıvı Yağ",
      "nameEn": "Vegetable Oil"
    },
    {
      "name": "Kabartma Tozu",
      "nameEn": "Baking Powder"
    }
  ],
  "instructions": [
    "Yumurta ve şekeri hacmi artana kadar çırpın.",
    "Süt ve sıvı yağı ekleyip karıştırmaya devam edin.",
    "Un ve kabartma tozunu eleyerek karışıma katın ve pürüzsüz bir hamur elde edin.",
    "Kabaca kıyılmış cevizi hamura ekleyip hafifçe karıştırın.",
    "Hamuru yağlanmış kalıba dökün ve önceden ısıtılmış fırında kürdan temiz çıkana kadar pişirin."
  ],
  "instructionsEn": [
    "Whisk the eggs and sugar together until increased in volume.",
    "Add the milk and vegetable oil, continuing to mix.",
    "Sift in the flour and baking powder and mix into a smooth batter.",
    "Fold in the coarsely chopped walnuts.",
    "Pour the batter into a greased pan and bake in a preheated oven until a toothpick comes out clean."
  ]
},
{
  "name": "Brownie",
  "nameEn": "Fudgy Chocolate Brownies",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Çikolata",
      "nameEn": "Chocolate"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Kakao",
      "nameEn": "Cocoa Powder"
    },
    {
      "name": "Ceviz",
      "nameEn": "Walnut",
      "optional": true
    }
  ],
  "instructions": [
    "Çikolata ve tereyağını benmari usulü eritin.",
    "Şekeri ekleyip karıştırdıktan sonra yumurtaları teker teker ilave edin.",
    "Un ve kakaoyu eleyerek karışıma katın ve fazla çırpmadan karıştırın.",
    "İsteğe bağlı olarak kıyılmış cevizi ekleyip hamuru yağlanmış kalıba dökün.",
    "Önceden ısıtılmış fırında içi yumuşak kalacak şekilde pişirip dilimleyerek servis edin."
  ],
  "instructionsEn": [
    "Melt the chocolate and butter together over a double boiler.",
    "Stir in the sugar, then add the eggs one at a time.",
    "Sift in the flour and cocoa powder and fold gently into the mixture.",
    "Fold in chopped walnuts if desired, then pour the batter into a greased pan.",
    "Bake in a preheated oven until the center is still fudgy, then slice and serve."
  ]
},
{
  "name": "Profiterol",
  "nameEn": "Profiteroles",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Krema",
      "nameEn": "Heavy Cream"
    },
    {
      "name": "Çikolata",
      "nameEn": "Chocolate"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    }
  ],
  "instructions": [
    "Su, tereyağı ve şekeri kaynatın.",
    "Kaynayan karışıma unu ekleyip pürüzsüz bir hamur elde edene kadar karıştırın.",
    "Hamur ılıyınca yumurtaları teker teker ekleyerek parlak bir kıvam alana kadar çırpın.",
    "Hamuru sıkma torbasıyla fırın tepsisine küçük toplar halinde sıkıp fırında kabarıp altın rengi alana kadar pişirin.",
    "Kremayı çırpıp soğuyan topların içine doldurun.",
    "Çikolatayı eritip doldurulmuş topların üzerine gezdirerek servis edin."
  ],
  "instructionsEn": [
    "Boil the water, butter, and sugar together.",
    "Add the flour to the boiling mixture and stir until a smooth dough forms.",
    "Once the dough has cooled slightly, beat in the eggs one at a time until glossy.",
    "Pipe small mounds of the dough onto a baking tray and bake until puffed and golden.",
    "Whip the cream and fill the cooled puffs with it.",
    "Melt the chocolate and drizzle it over the filled puffs before serving."
  ]
},
{
  "name": "Tiramisu",
  "nameEn": "Tiramisu",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Mascarpone Peyniri",
      "nameEn": "Mascarpone Cheese"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Kahve",
      "nameEn": "Coffee"
    },
    {
      "name": "Kakao",
      "nameEn": "Cocoa Powder"
    },
    {
      "name": "Kedi Dili Bisküvi",
      "nameEn": "Ladyfinger Biscuits"
    }
  ],
  "instructions": [
    "Yumurta sarılarını şekerle krema kıvamına gelene kadar çırpın.",
    "Mascarpone peynirini ekleyip pürüzsüz bir karışım elde edene kadar karıştırın.",
    "Yumurta aklarını kar kıvamına gelene kadar çırpıp mascarpone karışımına nazikçe katın.",
    "Kedi dili bisküvilerini soğuk kahveye hızlıca batırıp bir kabın tabanına dizin.",
    "Bisküvilerin üzerine mascarpone karışımının yarısını yayın ve işlemi bir kat daha tekrarlayın.",
    "Üzerine kakao eleyip birkaç saat buzdolabında dinlendirdikten sonra servis edin."
  ],
  "instructionsEn": [
    "Beat the egg yolks with the sugar until creamy.",
    "Add the mascarpone cheese and mix until smooth.",
    "Whip the egg whites to stiff peaks and gently fold them into the mascarpone mixture.",
    "Quickly dip the ladyfinger biscuits in cold coffee and arrange them in the bottom of a dish.",
    "Spread half of the mascarpone mixture over the biscuits and repeat with another layer.",
    "Dust the top with cocoa powder, chill in the refrigerator for a few hours, and serve."
  ]
},
{
  "name": "Cheesecake",
  "nameEn": "New York Style Cheesecake",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Krem Peynir",
      "nameEn": "Cream Cheese"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Bisküvi",
      "nameEn": "Biscuits"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Krema",
      "nameEn": "Heavy Cream"
    },
    {
      "name": "Limon",
      "nameEn": "Lemon"
    }
  ],
  "instructions": [
    "Bisküvileri ufalayıp eritilmiş tereyağı ile karıştırın ve kalıbın tabanına bastırarak yayın.",
    "Krem peyniri ve şekeri pürüzsüz olana kadar çırpın.",
    "Yumurtaları teker teker ekleyip her seferinde iyice karıştırın.",
    "Krema ve limon kabuğu rendesini ekleyip karışımı homojen hale getirin.",
    "Karışımı bisküvi tabanının üzerine dökün ve önceden ısıtılmış fırında kenarları sabitlenip ortası hafif hareketli kalacak şekilde pişirin.",
    "Fırından çıkardıktan sonra oda sıcaklığında soğutup birkaç saat buzdolabında dinlendirerek servis edin."
  ],
  "instructionsEn": [
    "Crush the biscuits, mix with melted butter, and press into the base of a springform pan.",
    "Beat the cream cheese and sugar together until smooth.",
    "Add the eggs one at a time, mixing well after each addition.",
    "Stir in the heavy cream and lemon zest until the mixture is smooth.",
    "Pour the mixture over the biscuit base and bake in a preheated oven until the edges are set but the center still jiggles slightly.",
    "Let cool to room temperature, then chill in the refrigerator for a few hours before serving."
  ]
},
{
  "name": "Panna Cotta",
  "nameEn": "Panna Cotta",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Krema",
      "nameEn": "Heavy Cream"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Vanilya",
      "nameEn": "Vanilla"
    },
    {
      "name": "Jelatin",
      "nameEn": "Gelatin"
    }
  ],
  "instructions": [
    "Jelatini soğuk suda bekletip yumuşamasını sağlayın.",
    "Krema, süt ve şekeri bir tencerede kaynamadan ısıtın.",
    "Vanilyayı ekleyip karıştırdıktan sonra ocaktan alın.",
    "Yumuşayan jelatini sıcak karışıma ekleyip tamamen erimesini sağlayacak şekilde karıştırın.",
    "Karışımı kalıplara paylaştırıp buzdolabında birkaç saat soğutarak kıvam almasını bekleyin ve servis edin."
  ],
  "instructionsEn": [
    "Soak the gelatin in cold water until softened.",
    "Heat the cream, milk, and sugar together in a saucepan without letting it boil.",
    "Stir in the vanilla and remove from heat.",
    "Add the softened gelatin to the hot mixture and stir until completely dissolved.",
    "Divide the mixture into molds, chill in the refrigerator for a few hours until set, and serve."
  ]
},
{
  "name": "Çikolatalı Mozaik Pasta",
  "nameEn": "No-Bake Chocolate Biscuit Cake",
  "category": "Dessert",
  "ingredients": [
    {
      "name": "Bisküvi",
      "nameEn": "Biscuits"
    },
    {
      "name": "Çikolata",
      "nameEn": "Chocolate"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Kakao",
      "nameEn": "Cocoa Powder"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Ceviz",
      "nameEn": "Walnut",
      "optional": true
    }
  ],
  "instructions": [
    "Bisküvileri elinizle kabaca kırın.",
    "Çikolata, tereyağı, kakao, şeker ve sütü tencerede karıştırarak eritin ve pürüzsüz bir sos elde edin.",
    "Kırılmış bisküvileri ve isteğe bağlı olarak cevizi sıcak çikolata sosuna ekleyip iyice karıştırın.",
    "Karışımı streç filmle kaplanmış bir kalıba dökerek rulo veya blok şekli verin.",
    "Buzdolabında birkaç saat sertleşmesini bekleyip dilimleyerek servis edin."
  ],
  "instructionsEn": [
    "Break the biscuits into coarse pieces by hand.",
    "Melt the chocolate, butter, cocoa powder, sugar, and milk together in a saucepan, stirring into a smooth sauce.",
    "Add the broken biscuits and walnuts, if using, to the hot chocolate sauce and mix well.",
    "Pour the mixture into a plastic-wrap-lined mold, shaping it into a log or block.",
    "Chill in the refrigerator for a few hours until firm, then slice and serve."
  ]
},
{
  "name": "Su Böreği",
  "nameEn": "Turkish Water Börek",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Yufka",
      "nameEn": "Phyllo Pastry Sheets"
    },
    {
      "name": "Beyaz Peynir",
      "nameEn": "White Cheese"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Büyük bir tencerede bol suyu tuzla kaynatın.",
    "Yufkaları teker teker kaynar suda 1-2 dakika haşlayıp soğuk suya alın.",
    "Haşlanan yufkaları fazla suyunu süzerek yağlanmış fırın tepsisine serin.",
    "Beyaz peyniri maydanozla karıştırıp yufka katları arasına eşit şekilde serpiştirin.",
    "Yumurta ve sütü çırpıp böreğin üzerine dökün.",
    "Eritilmiş tereyağını gezdirip 180 derece fırında üzeri altın rengi olana kadar pişirin."
  ],
  "instructionsEn": [
    "Bring a large pot of salted water to a boil.",
    "Boil the phyllo sheets one at a time for 1-2 minutes, then transfer them to cold water.",
    "Drain the boiled sheets well and layer them in a greased baking pan.",
    "Mix the white cheese with parsley and scatter it evenly between the layers.",
    "Whisk the egg and milk together and pour over the börek.",
    "Drizzle with melted butter and bake at 180°C (350°F) until golden on top."
  ]
},
{
  "name": "Sigara Böreği",
  "nameEn": "Fried Cheese Pastry Rolls",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Yufka",
      "nameEn": "Phyllo Pastry Sheets"
    },
    {
      "name": "Beyaz Peynir",
      "nameEn": "White Cheese"
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Sıvı Yağ",
      "nameEn": "Vegetable Oil"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper",
      "optional": true
    }
  ],
  "instructions": [
    "Beyaz peyniri bir kapta ezin, maydanoz ve isteğe bağlı karabiberle karıştırın.",
    "Yufkaları üçgen şeklinde kesin ve her parçaya bir tatlı kaşığı peynir harcı koyun.",
    "Yufkaları sigara şeklinde sıkıca sarın ve uçlarını yumurta ile yapıştırın.",
    "Geniş bir tavaya sıvı yağı koyup kızdırın.",
    "Sigara böreklerini her iki tarafı altın rengi olana kadar kızartın.",
    "Kağıt havluya alıp fazla yağını süzdükten sonra servis edin."
  ],
  "instructionsEn": [
    "Mash the white cheese in a bowl and mix with parsley and black pepper, if using.",
    "Cut the phyllo sheets into triangles and place a teaspoon of cheese filling on each piece.",
    "Roll each triangle tightly into a cigarette shape and seal the edge with a little beaten egg.",
    "Heat the vegetable oil in a wide pan.",
    "Fry the cigarette börek on both sides until golden brown.",
    "Drain on paper towels to remove excess oil, then serve."
  ]
},
{
  "name": "Kıymalı Pide",
  "nameEn": "Ground Meat Pide (Turkish Meat Boat)",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Kuru Maya",
      "nameEn": "Instant Yeast"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Kıyma",
      "nameEn": "Ground Meat"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Biber Salçası",
      "nameEn": "Pepper Paste"
    },
    {
      "name": "Yeşil Biber",
      "nameEn": "Green Pepper",
      "optional": true
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley",
      "optional": true
    }
  ],
  "instructions": [
    "Ilık suyun içine kuru mayayı ekleyip karıştırın ve köpürmesini bekleyin.",
    "Una tuzu ekleyin, mayalı su ile yoğurarak yumuşak bir hamur elde edin.",
    "Hamurun üzerini örtüp ılık bir yerde 1 saat kadar mayalanmaya bırakın.",
    "Kıymayı ince doğranmış soğan, rendelenmiş domates ve biber salçasıyla karıştırarak iç harcını hazırlayın.",
    "İsterseniz harca doğranmış yeşil biber ve maydanoz ekleyin.",
    "Mayalanan hamuru bezelere ayırıp uzun pide şeklinde açın ve kenarlarını kıvırın.",
    "Ortasına kıymalı harcı yayıp 220 derece önceden ısıtılmış fırında kenarları kızarana kadar pişirin."
  ],
  "instructionsEn": [
    "Stir the instant yeast into the lukewarm water and let it sit until it foams.",
    "Add the salt to the flour and knead with the yeasty water into a soft dough.",
    "Cover the dough and let it rise in a warm spot for about 1 hour.",
    "Mix the ground meat with finely chopped onion, grated tomato, and pepper paste to make the filling.",
    "Stir in chopped green pepper and parsley if you like.",
    "Divide the risen dough into pieces, roll each into a long boat shape, and fold up the edges.",
    "Spread the meat filling down the center and bake in a preheated 220°C (425°F) oven until the edges are golden."
  ]
},
{
  "name": "Peynirli Pide",
  "nameEn": "Cheese Pide",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Kuru Maya",
      "nameEn": "Instant Yeast"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Kaşar Peyniri",
      "nameEn": "Kashar Cheese"
    },
    {
      "name": "Beyaz Peynir",
      "nameEn": "White Cheese"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg",
      "optional": true
    }
  ],
  "instructions": [
    "Ilık suda kuru mayayı eritip 10 dakika bekletin.",
    "Una tuz ve zeytinyağını ekleyin, mayalı suyla yoğurup yumuşak bir hamur elde edin.",
    "Hamuru örtüp 45-60 dakika mayalanmaya bırakın.",
    "Kaşar peyniri ve beyaz peyniri rendeleyip karıştırın.",
    "Mayalanan hamuru açıp uçlarını kıvırarak pide şekli verin, üzerine peynir karışımını yayın.",
    "İsterseniz kenarlarına yumurta sürüp 220 derece fırında peynir kabarana kadar pişirin."
  ],
  "instructionsEn": [
    "Dissolve the instant yeast in lukewarm water and let it sit for 10 minutes.",
    "Add the salt and olive oil to the flour and knead with the yeasty water into a soft dough.",
    "Cover the dough and let it rise for 45-60 minutes.",
    "Grate the kashar cheese and white cheese together and mix well.",
    "Roll out the risen dough, fold up the edges into a boat shape, and spread the cheese mixture over the top.",
    "Brush the edges with egg if desired and bake at 220°C (425°F) until the cheese is bubbling."
  ]
},
{
  "name": "Kaşarlı Poğaça",
  "nameEn": "Cheese-Stuffed Poğaça Rolls",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Kuru Maya",
      "nameEn": "Instant Yeast"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Yoğurt",
      "nameEn": "Yogurt"
    },
    {
      "name": "Sıvı Yağ",
      "nameEn": "Vegetable Oil"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Kaşar Peyniri",
      "nameEn": "Kashar Cheese"
    },
    {
      "name": "Susam",
      "nameEn": "Sesame Seeds",
      "optional": true
    }
  ],
  "instructions": [
    "Ilık süte kuru mayayı ekleyip karıştırın ve köpürmesini bekleyin.",
    "Yoğurt, sıvı yağ, yumurta ve tuzu ekleyip karıştırın.",
    "Unu azar azar ekleyerek elinize yapışmayan yumuşak bir hamur yoğurun.",
    "Hamuru örtüp 1 saat kadar mayalanmaya bırakın.",
    "Küçük parçalar koparıp içine kaşar peyniri koyarak yuvarlayın.",
    "Üzerlerine yumurta sarısı ve isteğe bağlı susam serpip 180 derece fırında altın rengi olana kadar pişirin."
  ],
  "instructionsEn": [
    "Stir the instant yeast into the lukewarm milk and let it sit until it foams.",
    "Mix in the yogurt, oil, egg, and salt.",
    "Gradually add the flour, kneading into a soft dough that doesn't stick to your hands.",
    "Cover the dough and let it rise for about 1 hour.",
    "Pinch off small pieces, tuck a bit of kashar cheese inside each, and shape into rolls.",
    "Brush with egg yolk, sprinkle with sesame seeds if desired, and bake at 180°C (350°F) until golden."
  ]
},
{
  "name": "Açma",
  "nameEn": "Soft Turkish Bread Rolls",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Kuru Maya",
      "nameEn": "Instant Yeast"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Yoğurt",
      "nameEn": "Yogurt"
    },
    {
      "name": "Susam",
      "nameEn": "Sesame Seeds",
      "optional": true
    },
    {
      "name": "Çörek Otu",
      "nameEn": "Nigella Seeds",
      "optional": true
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    }
  ],
  "instructions": [
    "Ilık süte kuru mayayı ve şekeri ekleyip 10 dakika bekletin.",
    "Yoğurt, eritilmiş tereyağı ve tuzu karışıma ekleyin.",
    "Unu azar azar katarak yumuşak, elastiki bir hamur yoğurun.",
    "Hamuru örtüp iki katına çıkana kadar mayalanmaya bırakın.",
    "Hamuru bezelere ayırıp halka veya top şeklinde şekillendirin.",
    "Şekillendirdiğiniz açmaları tepsiye dizip tekrar 20-30 dakika mayalandırın.",
    "Üzerlerine çırpılmış yumurta sürüp isteğe bağlı susam veya çörek otu serperek 180 derece fırında pişirin."
  ],
  "instructionsEn": [
    "Stir the instant yeast and sugar into the lukewarm milk and let it sit for 10 minutes.",
    "Add the yogurt, melted butter, and salt to the mixture.",
    "Gradually add the flour, kneading into a soft, elastic dough.",
    "Cover the dough and let it rise until doubled in size.",
    "Divide the dough into pieces and shape into rings or rounds.",
    "Arrange the shaped açma on a baking tray and let them rise again for 20-30 minutes.",
    "Brush with beaten egg, sprinkle with sesame seeds or nigella seeds if desired, and bake at 180°C (350°F)."
  ]
},
{
  "name": "Simit",
  "nameEn": "Turkish Sesame Bread Rings",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Kuru Maya",
      "nameEn": "Instant Yeast"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Pekmez",
      "nameEn": "Grape Molasses"
    },
    {
      "name": "Susam",
      "nameEn": "Sesame Seeds"
    }
  ],
  "instructions": [
    "Ilık suda kuru mayayı ve şekeri eritip 10 dakika bekletin.",
    "Una tuzu ekleyip mayalı suyla yoğurarak orta sertlikte bir hamur elde edin.",
    "Hamuru örtüp 1 saat kadar mayalanmaya bırakın.",
    "Hamuru parçalara ayırıp ince uzun şeritler haline getirin ve ikişer ikişer bükerek halka şeklinde birleştirin.",
    "Pekmezi bir miktar suyla karıştırıp halkaları bu karışıma batırdıktan sonra susama bulayın.",
    "Fırın tepsisine dizip 200 derece fırında kızarana kadar pişirin."
  ],
  "instructionsEn": [
    "Dissolve the instant yeast and sugar in lukewarm water and let it sit for 10 minutes.",
    "Add the salt to the flour and knead with the yeasty water into a medium-firm dough.",
    "Cover the dough and let it rise for about 1 hour.",
    "Divide the dough into pieces, roll into long thin ropes, twist two together, and join the ends into a ring.",
    "Mix the grape molasses with a little water, dip each ring into it, then coat with sesame seeds.",
    "Arrange on a baking tray and bake at 200°C (400°F) until golden brown."
  ]
},
{
  "name": "Lahmacun",
  "nameEn": "Turkish Spiced Meat Flatbread",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Kuru Maya",
      "nameEn": "Instant Yeast"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Kıyma",
      "nameEn": "Ground Meat"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Domates",
      "nameEn": "Tomato"
    },
    {
      "name": "Yeşil Biber",
      "nameEn": "Green Pepper",
      "optional": true
    },
    {
      "name": "Maydanoz",
      "nameEn": "Parsley"
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes",
      "optional": true
    }
  ],
  "instructions": [
    "Ilık suda kuru mayayı eritip 10 dakika bekletin.",
    "Una tuzu ekleyip mayalı suyla yoğurarak yumuşak bir hamur elde edin, dinlendirin.",
    "Soğan, domates ve isteğe bağlı yeşil biberi rondoda çekip kıyma ile karıştırın.",
    "Karışıma ince kıyılmış maydanoz ve isteğe bağlı pul biber ekleyip harcı hazırlayın.",
    "Hamuru küçük bezelere ayırıp yufka inceliğinde açın.",
    "Açtığınız hamurların üzerine ince bir tabaka halinde kıymalı harcı yayın.",
    "250 derece önceden ısıtılmış fırında kenarları kızarana kadar pişirin."
  ],
  "instructionsEn": [
    "Dissolve the instant yeast in lukewarm water and let it sit for 10 minutes.",
    "Add the salt to the flour and knead with the yeasty water into a soft dough, then let it rest.",
    "Blend the onion, tomato, and green pepper, if using, and mix with the ground meat.",
    "Stir in finely chopped parsley and red pepper flakes, if using, to finish the filling.",
    "Divide the dough into small balls and roll each out as thin as phyllo.",
    "Spread a thin layer of the meat filling evenly over each round.",
    "Bake in a preheated 250°C (480°F) oven until the edges are crisp and golden."
  ]
},
{
  "name": "Etli Katmer",
  "nameEn": "Gaziantep-Style Meat-Filled Flatbread",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Yufka",
      "nameEn": "Phyllo Pastry Sheets"
    },
    {
      "name": "Kıyma",
      "nameEn": "Ground Meat"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    },
    {
      "name": "Pul Biber",
      "nameEn": "Red Pepper Flakes",
      "optional": true
    }
  ],
  "instructions": [
    "Kıymayı ince doğranmış soğan, tuz, karabiber ve isteğe bağlı pul biberle karıştırıp harcı hazırlayın.",
    "Yufkayı geniş bir yüzeye serip yarısına eritilmiş tereyağı sürün.",
    "Hazırladığınız kıymalı harcı yufkanın üzerine ince bir şekilde yayın.",
    "Yufkayı katlayarak dörtgen ya da üçgen şekil verin.",
    "Sıcak bir sac tavada veya 220 derece fırında her iki yüzü de kızarana kadar pişirin."
  ],
  "instructionsEn": [
    "Mix the ground meat with finely chopped onion, salt, black pepper, and red pepper flakes if using, to make the filling.",
    "Lay the pastry sheet on a wide surface and brush half of it with melted butter.",
    "Spread the meat filling thinly over the buttered half.",
    "Fold the sheet over into a square or triangle shape.",
    "Cook on a hot griddle or bake at 220°C (425°F) until both sides are golden brown."
  ]
},
{
  "name": "Zeytinli Çörek",
  "nameEn": "Olive Bread Rolls",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Kuru Maya",
      "nameEn": "Instant Yeast"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Zeytin",
      "nameEn": "Olives"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    }
  ],
  "instructions": [
    "Ilık süte kuru mayayı ve şekeri ekleyip 10 dakika bekletin.",
    "Zeytinyağı ve tuzu ekleyip karıştırın, ardından unu azar azar katarak yumuşak bir hamur yoğurun.",
    "Çekirdeği çıkarılmış zeytinleri iri doğrayıp hamura yedirin.",
    "Hamuru örtüp 1 saat kadar mayalanmaya bırakın.",
    "Hamuru küçük parçalara ayırıp yuvarlak çörekler şeklinde şekillendirin.",
    "Üzerlerine çırpılmış yumurta sürüp 180 derece fırında altın rengi olana kadar pişirin."
  ],
  "instructionsEn": [
    "Stir the instant yeast and sugar into the lukewarm milk and let it sit for 10 minutes.",
    "Mix in the olive oil and salt, then gradually add the flour and knead into a soft dough.",
    "Roughly chop the pitted olives and knead them into the dough.",
    "Cover the dough and let it rise for about 1 hour.",
    "Divide the dough into small pieces and shape into round buns.",
    "Brush with beaten egg and bake at 180°C (350°F) until golden brown."
  ]
},
{
  "name": "Ispanaklı Börek",
  "nameEn": "Spinach Phyllo Pastry",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Yufka",
      "nameEn": "Phyllo Pastry Sheets"
    },
    {
      "name": "Ispanak",
      "nameEn": "Spinach"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Beyaz Peynir",
      "nameEn": "White Cheese"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Sıvı Yağ",
      "nameEn": "Vegetable Oil"
    },
    {
      "name": "Susam",
      "nameEn": "Sesame Seeds",
      "optional": true
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Ispanağı yıkayıp ince kıyın, doğranmış soğanla birlikte hafifçe kavurun.",
    "Kavrulan karışım soğuduktan sonra beyaz peyniri ve tuzu ekleyip harcı hazırlayın.",
    "Bir kapta yumurta ve sıvı yağı çırpın.",
    "Yufkaları bu karışıma hafifçe batırıp tepsiye serin, aralarına ıspanaklı harcı serpiştirin.",
    "Katları üst üste dizip son katmanı da yumurta-yağ karışımıyla nemlendirin.",
    "İsteğe bağlı susam serpip 180 derece fırında üzeri kızarana kadar pişirin."
  ],
  "instructionsEn": [
    "Wash and finely chop the spinach, then sauté it briefly with the chopped onion.",
    "Once cooled, mix in the white cheese and salt to make the filling.",
    "In a bowl, whisk together the egg and vegetable oil.",
    "Lightly dip the phyllo sheets in this mixture, lay them in a baking pan, and scatter the spinach filling between the layers.",
    "Stack the layers and moisten the top sheet with the remaining egg-oil mixture.",
    "Sprinkle with sesame seeds if desired and bake at 180°C (350°F) until golden on top."
  ]
},
{
  "name": "Talaş Böreği",
  "nameEn": "Puff Pastry Meat Parcels",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Milföy Hamuru",
      "nameEn": "Puff Pastry Dough"
    },
    {
      "name": "Kıyma",
      "nameEn": "Ground Meat"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    }
  ],
  "instructions": [
    "Kıymayı ince doğranmış soğanla birlikte kavurun, tuz ve karabiberle tatlandırın.",
    "Harcı soğumaya bırakın.",
    "Milföy hamurunu kareler halinde kesip her birinin ortasına bir kaşık harç koyun.",
    "Kenarlarını üçgen ya da paket şeklinde kapatıp yumurta ile yapıştırın.",
    "Üzerlerine yumurta sürüp 200 derece fırında kabarıp altın rengi olana kadar pişirin."
  ],
  "instructionsEn": [
    "Sauté the ground meat with the chopped onion, then season with salt and black pepper.",
    "Let the filling cool.",
    "Cut the puff pastry into squares and place a spoonful of filling in the center of each.",
    "Fold the edges into a triangle or parcel shape and seal with a bit of beaten egg.",
    "Brush the tops with egg and bake at 200°C (400°F) until puffed and golden."
  ]
},
{
  "name": "Peynirli Çörek",
  "nameEn": "Cheese-Filled Bread Rolls",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Kuru Maya",
      "nameEn": "Instant Yeast"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Kaşar Peyniri",
      "nameEn": "Kashar Cheese"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    }
  ],
  "instructions": [
    "Ilık süte kuru mayayı ve şekeri ekleyip 10 dakika bekletin.",
    "Eritilmiş tereyağı ve tuzu ekleyip karıştırın.",
    "Unu azar azar katarak yumuşak bir hamur yoğurun ve 1 saat mayalanmaya bırakın.",
    "Kaşar peynirini rendeleyin.",
    "Hamuru küçük parçalara ayırıp içine rendelenmiş peyniri koyarak yuvarlayın.",
    "Üzerlerine yumurta sürüp 180 derece fırında altın rengi olana kadar pişirin."
  ],
  "instructionsEn": [
    "Stir the instant yeast and sugar into the lukewarm milk and let it sit for 10 minutes.",
    "Mix in the melted butter and salt.",
    "Gradually add the flour, knead into a soft dough, and let it rise for 1 hour.",
    "Grate the kashar cheese.",
    "Divide the dough into small pieces, fill each with grated cheese, and shape into rolls.",
    "Brush with egg and bake at 180°C (350°F) until golden brown."
  ]
},
{
  "name": "Focaccia",
  "nameEn": "Italian Herb Flatbread",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Kuru Maya",
      "nameEn": "Instant Yeast"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Kaba Tuz",
      "nameEn": "Coarse Salt",
      "optional": true
    },
    {
      "name": "Biberiye",
      "nameEn": "Rosemary",
      "optional": true
    },
    {
      "name": "Zeytin",
      "nameEn": "Olives",
      "optional": true
    }
  ],
  "instructions": [
    "Ilık suda kuru mayayı eritip 10 dakika bekletin.",
    "Una tuz ve zeytinyağının bir kısmını ekleyip mayalı suyla yoğurarak yumuşak, yapışkan bir hamur elde edin.",
    "Hamuru örtüp 1-1,5 saat mayalanmaya bırakın.",
    "Mayalanan hamuru yağlanmış bir tepsiye yayıp parmak uçlarınızla üzerine çukurlar açın.",
    "Kalan zeytinyağını gezdirip isteğe bağlı zeytin ve biberiye ile süsleyin, kaba tuz serpin.",
    "220 derece önceden ısıtılmış fırında kenarları altın rengi olana kadar pişirin."
  ],
  "instructionsEn": [
    "Dissolve the instant yeast in lukewarm water and let it sit for 10 minutes.",
    "Add the salt and some of the olive oil to the flour and knead with the yeasty water into a soft, sticky dough.",
    "Cover the dough and let it rise for 1 to 1.5 hours.",
    "Spread the risen dough into a greased pan and press dimples into the surface with your fingertips.",
    "Drizzle with the remaining olive oil, top with olives and rosemary if desired, and sprinkle with coarse salt.",
    "Bake in a preheated 220°C (425°F) oven until the edges are golden."
  ]
},
{
  "name": "Sucuklu Kaşarlı Kiş",
  "nameEn": "Cheese and Turkish Sausage Quiche",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Krema",
      "nameEn": "Heavy Cream"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Kaşar Peyniri",
      "nameEn": "Kashar Cheese"
    },
    {
      "name": "Sucuk",
      "nameEn": "Turkish Sausage"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    }
  ],
  "instructions": [
    "Unu tuz ve soğuk küp doğranmış tereyağı ile ovarak kırıntı haline getirin.",
    "Bir yumurta ekleyip hızlıca yoğurup top haline getirin ve buzdolabında 30 dakika dinlendirin.",
    "Hamuru açıp yağlanmış bir kiş kalıbına yerleştirin, kenarlarını bastırın.",
    "Sucuğu ve ince doğranmış soğanı hafifçe kavurun.",
    "Kalan yumurtaları, krema ve sütü çırpıp tuz ve karabiberle tatlandırın.",
    "Kalıba kavrulan sucuklu soğanı ve rendelenmiş kaşar peynirini serpip yumurtalı karışımı üzerine dökün.",
    "180 derece fırında karışım pişip üzeri kızarana kadar 35-40 dakika pişirin."
  ],
  "instructionsEn": [
    "Rub the flour with the salt and cold cubed butter until it resembles coarse crumbs.",
    "Add one egg, quickly bring the dough together into a ball, and chill it in the refrigerator for 30 minutes.",
    "Roll out the dough and press it into a greased quiche pan, pressing it up the sides.",
    "Lightly sauté the sucuk and chopped onion.",
    "Whisk the remaining eggs with the cream and milk, then season with salt and black pepper.",
    "Scatter the sautéed sucuk and onion along with the grated kashar cheese into the crust, then pour the egg mixture over the top.",
    "Bake at 180°C (350°F) for 35-40 minutes, until set and golden on top."
  ]
},
{
  "name": "Kıymalı Empanada",
  "nameEn": "Baked Beef Empanadas",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Kıyma",
      "nameEn": "Ground Meat"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Yeşil Biber",
      "nameEn": "Green Pepper",
      "optional": true
    },
    {
      "name": "Zeytin",
      "nameEn": "Olives",
      "optional": true
    },
    {
      "name": "Kimyon",
      "nameEn": "Cumin"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Unu tuz ile karıştırıp soğuk küp tereyağını parmak uçlarınızla ufalayın.",
    "Bir yumurta ve az su ekleyip hızlıca yoğurun, hamuru buzdolabında 30 dakika dinlendirin.",
    "Kıymayı doğranmış soğan ve isteğe bağlı yeşil biberle kavurun, kimyon ve tuz ile tatlandırın.",
    "İsterseniz harca doğranmış zeytin ekleyin ve soğumaya bırakın.",
    "Hamuru açıp bardak yardımıyla daireler kesin.",
    "Her dairenin ortasına bir kaşık harç koyup kenarlarını kapatarak kıvırcık şekilde bastırın.",
    "Üzerlerine yumurta sürüp 200 derece fırında altın rengi olana kadar pişirin."
  ],
  "instructionsEn": [
    "Mix the flour with the salt and rub in the cold cubed butter with your fingertips.",
    "Add one egg and a little water, quickly bring the dough together, and chill it for 30 minutes.",
    "Sauté the ground meat with the chopped onion and green pepper, if using, and season with cumin and salt.",
    "Stir in chopped olives if you like, then let the filling cool.",
    "Roll out the dough and cut out circles using a glass or cutter.",
    "Place a spoonful of filling in the center of each circle, fold over, and crimp the edges shut.",
    "Brush with egg and bake at 200°C (400°F) until golden brown."
  ]
},
{
  "name": "Tereyağlı Kruvasan",
  "nameEn": "Butter Croissants",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Süt",
      "nameEn": "Milk"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Kuru Maya",
      "nameEn": "Instant Yeast"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    }
  ],
  "instructions": [
    "Ilık süte kuru mayayı ve şekeri ekleyip 10 dakika bekletin.",
    "Una tuzu ekleyip mayalı sütle yoğurarak pürüzsüz bir hamur elde edin ve buzdolabında 1 saat dinlendirin.",
    "Soğuk tereyağını iki kağıt arasında dövüp dikdörtgen bir plaka haline getirin.",
    "Hamuru açıp tereyağı plakasını ortasına yerleştirin ve hamuru üzerine kapatın.",
    "Hamuru ince açıp üçe katlayın, bu işlemi 20 dakika aralıklarla üç kez tekrarlayın.",
    "Son katlamadan sonra hamuru üçgenler halinde kesin.",
    "Üçgenleri geniş uçtan dara doğru sararak ay şekli verin ve 30 dakika mayalanmaya bırakın.",
    "Üzerlerine yumurta sürüp 200 derece fırında altın rengi ve katmanlı olana kadar pişirin."
  ],
  "instructionsEn": [
    "Stir the instant yeast and sugar into the lukewarm milk and let it sit for 10 minutes.",
    "Add the salt to the flour and knead with the yeasty milk into a smooth dough, then chill it for 1 hour.",
    "Pound the cold butter between two sheets of parchment into a rectangular slab.",
    "Roll out the dough, place the butter slab in the center, and fold the dough over to enclose it.",
    "Roll the dough out thin and fold it into thirds; repeat this process three times, resting 20 minutes between each fold.",
    "After the final fold, cut the dough into triangles.",
    "Roll each triangle from the wide end to the point into a crescent shape and let rise for 30 minutes.",
    "Brush with egg and bake at 200°C (400°F) until golden brown and flaky."
  ]
},
{
  "name": "Tuzlu Pretzel",
  "nameEn": "Soft Salted Pretzels",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Kuru Maya",
      "nameEn": "Instant Yeast"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Karbonat",
      "nameEn": "Baking Soda"
    },
    {
      "name": "Kaba Tuz",
      "nameEn": "Coarse Salt"
    }
  ],
  "instructions": [
    "Ilık suda kuru mayayı ve şekeri eritip 10 dakika bekletin.",
    "Una tuz ve eritilmiş tereyağını ekleyip mayalı suyla yoğurarak elastiki bir hamur elde edin.",
    "Hamuru örtüp 1 saat kadar mayalanmaya bırakın.",
    "Hamuru parçalara ayırıp ince uzun şeritler haline getirin ve pretzel şeklinde bükün.",
    "Geniş bir tencerede suyu kaynatıp karbonat ekleyin.",
    "Şekillendirilmiş hamurları birer dakika kaynayan karbonatlı suda haşlayıp süzün.",
    "Tepsiye dizip üzerine kaba tuz serperek 220 derece fırında koyu altın rengi olana kadar pişirin."
  ],
  "instructionsEn": [
    "Dissolve the instant yeast and sugar in lukewarm water and let it sit for 10 minutes.",
    "Add the salt and melted butter to the flour and knead with the yeasty water into an elastic dough.",
    "Cover the dough and let it rise for about 1 hour.",
    "Divide the dough into pieces, roll into long ropes, and twist into the classic pretzel shape.",
    "Bring a large pot of water to a boil and stir in the baking soda.",
    "Boil each shaped pretzel for about a minute in the baking soda water, then drain.",
    "Arrange on a baking tray, sprinkle with coarse salt, and bake at 220°C (425°F) until deep golden brown."
  ]
},
{
  "name": "Naan Ekmeği",
  "nameEn": "Indian Naan Bread",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Yoğurt",
      "nameEn": "Yogurt"
    },
    {
      "name": "Kuru Maya",
      "nameEn": "Instant Yeast"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Şeker",
      "nameEn": "Sugar"
    },
    {
      "name": "Tereyağı",
      "nameEn": "Butter"
    },
    {
      "name": "Çörek Otu",
      "nameEn": "Nigella Seeds",
      "optional": true
    }
  ],
  "instructions": [
    "Ilık suda kuru mayayı ve şekeri eritip 10 dakika bekletin.",
    "Yoğurt ve tuzu ekleyip karıştırın.",
    "Unu azar azar katarak yumuşak bir hamur yoğurun ve 1 saat mayalanmaya bırakın.",
    "Hamuru parçalara ayırıp oval veya damla şeklinde ince açın.",
    "İsterseniz üzerine çörek otu serpip çok sıcak bir tavada veya fırında her iki yüzü kabarana kadar pişirin.",
    "Pişen naanların üzerine eritilmiş tereyağı sürüp sıcak servis edin."
  ],
  "instructionsEn": [
    "Dissolve the instant yeast and sugar in lukewarm water and let it sit for 10 minutes.",
    "Stir in the yogurt and salt.",
    "Gradually add the flour, knead into a soft dough, and let it rise for 1 hour.",
    "Divide the dough into pieces and roll each out thin into an oval or teardrop shape.",
    "Sprinkle with nigella seeds if desired and cook in a very hot skillet or oven until puffed and blistered on both sides.",
    "Brush the cooked naan with melted butter and serve hot."
  ]
},
{
  "name": "Pita Ekmeği",
  "nameEn": "Pita Bread",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Kuru Maya",
      "nameEn": "Instant Yeast"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    }
  ],
  "instructions": [
    "Ilık suda kuru mayayı eritip 10 dakika bekletin.",
    "Una tuz ve zeytinyağını ekleyip mayalı suyla yoğurarak yumuşak bir hamur elde edin.",
    "Hamuru örtüp 1 saat kadar mayalanmaya bırakın.",
    "Hamuru eşit parçalara ayırıp yuvarlayın ve 15 dakika dinlendirin.",
    "Her parçayı yaklaşık 1 cm kalınlığında yuvarlak açın.",
    "Çok sıcak fırın taşı veya tepside 250 derecede pitalar kabarana kadar 5-7 dakika pişirin."
  ],
  "instructionsEn": [
    "Dissolve the instant yeast in lukewarm water and let it sit for 10 minutes.",
    "Add the salt and olive oil to the flour and knead with the yeasty water into a soft dough.",
    "Cover the dough and let it rise for about 1 hour.",
    "Divide the dough into equal pieces, shape into balls, and let rest for 15 minutes.",
    "Roll each piece into a round about 1 cm thick.",
    "Bake on a very hot baking stone or tray at 250°C (480°F) for 5-7 minutes, until puffed."
  ]
},
{
  "name": "Bazlama",
  "nameEn": "Turkish Griddle Flatbread",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Yoğurt",
      "nameEn": "Yogurt"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Kuru Maya",
      "nameEn": "Instant Yeast"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Ilık suda kuru mayayı eritip 10 dakika bekletin.",
    "Yoğurt ve tuzu ekleyip karıştırın, ardından unu azar azar katarak yumuşak bir hamur yoğurun.",
    "Hamuru örtüp iki katına çıkana kadar mayalanmaya bırakın.",
    "Hamuru parçalara ayırıp yaklaşık 1,5 cm kalınlığında yuvarlak açın.",
    "Kızgın bir sac veya tavada her iki yüzü de kabarıp benek benek kızarana kadar pişirin."
  ],
  "instructionsEn": [
    "Dissolve the instant yeast in lukewarm water and let it sit for 10 minutes.",
    "Stir in the yogurt and salt, then gradually add the flour and knead into a soft dough.",
    "Cover the dough and let it rise until doubled in size.",
    "Divide the dough into pieces and roll each out into a round about 1.5 cm thick.",
    "Cook on a hot griddle or skillet until both sides are puffed and speckled with golden spots."
  ]
},
{
  "name": "Köy Ekmeği",
  "nameEn": "Rustic Village Bread",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Tam Buğday Unu",
      "nameEn": "Whole Wheat Flour",
      "optional": true
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Kuru Maya",
      "nameEn": "Instant Yeast"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Mısır Unu",
      "nameEn": "Cornmeal",
      "optional": true
    }
  ],
  "instructions": [
    "Ilık suda kuru mayayı eritip 10 dakika bekletin.",
    "Unu, isteğe bağlı tam buğday ununu ve tuzu bir kapta karıştırın.",
    "Mayalı suyu azar azar ekleyerek yoğurun ve elastiki bir hamur elde edin.",
    "Hamuru örtüp 1,5-2 saat mayalanmaya bırakın.",
    "Hamuru yuvarlayıp isteğe bağlı mısır unu serpilmiş bir tepsiye alın, üzerine bıçakla kesikler atın.",
    "240 derece önceden ısıtılmış fırında altın rengi ve içi kabarana kadar 35-40 dakika pişirin."
  ],
  "instructionsEn": [
    "Dissolve the instant yeast in lukewarm water and let it sit for 10 minutes.",
    "In a bowl, combine the flour, whole wheat flour if using, and salt.",
    "Gradually add the yeasty water, kneading into an elastic dough.",
    "Cover the dough and let it rise for 1.5 to 2 hours.",
    "Shape the dough into a round, place it on a tray dusted with cornmeal if desired, and score the top with a knife.",
    "Bake in a preheated 240°C (465°F) oven for 35-40 minutes, until golden and well risen."
  ]
},
{
  "name": "Baget",
  "nameEn": "French Baguette",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Kuru Maya",
      "nameEn": "Instant Yeast"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    }
  ],
  "instructions": [
    "Ilık suda kuru mayayı eritip 10 dakika bekletin.",
    "Una tuzu ekleyip mayalı suyla yoğurarak pürüzsüz bir hamur elde edin.",
    "Hamuru örtüp 1,5 saat kadar mayalanmaya bırakın.",
    "Hamuru üç eşit parçaya ayırıp her birini uzun ince silindir şeklinde şekillendirin.",
    "Şekillendirdiğiniz hamurları un serpilmiş bir bezin üzerine alıp 30 dakika daha mayalanmaya bırakın.",
    "Üzerlerine çapraz kesikler atıp 230 derece fırında buharlı ortamda kabuğu çıtır olana kadar pişirin."
  ],
  "instructionsEn": [
    "Dissolve the instant yeast in lukewarm water and let it sit for 10 minutes.",
    "Add the salt to the flour and knead with the yeasty water into a smooth dough.",
    "Cover the dough and let it rise for about 1.5 hours.",
    "Divide the dough into three equal pieces and shape each into a long thin cylinder.",
    "Place the shaped loaves on a floured cloth and let rise for another 30 minutes.",
    "Score the tops diagonally and bake at 230°C (445°F) in a steamy oven until the crust is crisp."
  ]
},
{
  "name": "Ev Yapımı Pizza",
  "nameEn": "Homemade Pizza",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Un",
      "nameEn": "Flour"
    },
    {
      "name": "Kuru Maya",
      "nameEn": "Instant Yeast"
    },
    {
      "name": "Su",
      "nameEn": "Water"
    },
    {
      "name": "Zeytinyağı",
      "nameEn": "Olive Oil"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Domates Sosu",
      "nameEn": "Tomato Sauce"
    },
    {
      "name": "Kaşar Peyniri",
      "nameEn": "Kashar Cheese"
    },
    {
      "name": "Sucuk",
      "nameEn": "Turkish Sausage",
      "optional": true
    },
    {
      "name": "Mantar",
      "nameEn": "Mushroom",
      "optional": true
    },
    {
      "name": "Yeşil Biber",
      "nameEn": "Green Pepper",
      "optional": true
    }
  ],
  "instructions": [
    "Ilık suda kuru mayayı eritip 10 dakika bekletin.",
    "Una tuz ve zeytinyağını ekleyip mayalı suyla yoğurarak yumuşak bir hamur elde edin.",
    "Hamuru örtüp 1 saat kadar mayalanmaya bırakın.",
    "Hamuru yağlanmış bir tepside veya taşta ince yayın.",
    "Üzerine domates sosunu sürün.",
    "Rendelenmiş kaşar peyniri ve isteğe bağlı sucuk, mantar ve yeşil biberle süsleyin.",
    "240 derece önceden ısıtılmış fırında kenarları kızarıp peynir eriyene kadar pişirin."
  ],
  "instructionsEn": [
    "Dissolve the instant yeast in lukewarm water and let it sit for 10 minutes.",
    "Add the salt and olive oil to the flour and knead with the yeasty water into a soft dough.",
    "Cover the dough and let it rise for about 1 hour.",
    "Roll the dough out thin on a greased pan or baking stone.",
    "Spread the tomato sauce evenly over the top.",
    "Top with grated kashar cheese and sucuk, mushrooms, or green pepper, if desired.",
    "Bake in a preheated 240°C (465°F) oven until the crust is golden and the cheese is melted."
  ]
},
{
  "name": "Samsa",
  "nameEn": "Central Asian Baked Meat Pastries",
  "category": "Baking",
  "ingredients": [
    {
      "name": "Milföy Hamuru",
      "nameEn": "Puff Pastry Dough"
    },
    {
      "name": "Kıyma",
      "nameEn": "Ground Meat"
    },
    {
      "name": "Soğan",
      "nameEn": "Onion"
    },
    {
      "name": "Kimyon",
      "nameEn": "Cumin"
    },
    {
      "name": "Tuz",
      "nameEn": "Salt"
    },
    {
      "name": "Karabiber",
      "nameEn": "Black Pepper"
    },
    {
      "name": "Yumurta",
      "nameEn": "Egg"
    },
    {
      "name": "Çörek Otu",
      "nameEn": "Nigella Seeds",
      "optional": true
    }
  ],
  "instructions": [
    "Kıymayı ince doğranmış soğanla kavurun, kimyon, tuz ve karabiberle tatlandırın.",
    "Harcı soğumaya bırakın.",
    "Milföy hamurunu şeritler halinde kesin.",
    "Her şeridin ucuna bir kaşık harç koyup üçgen şeklinde katlayarak sarın.",
    "Üçgenleri tepsiye dizip üzerlerine çırpılmış yumurta sürün.",
    "İsteğe bağlı çörek otu serpip 200 derece fırında altın rengi ve çıtır olana kadar pişirin."
  ],
  "instructionsEn": [
    "Sauté the ground meat with the chopped onion, then season with cumin, salt, and black pepper.",
    "Let the filling cool.",
    "Cut the puff pastry into long strips.",
    "Place a spoonful of filling at the end of each strip and fold it up into a triangle.",
    "Arrange the triangles on a tray and brush with beaten egg.",
    "Sprinkle with nigella seeds if desired and bake at 200°C (400°F) until golden and crisp."
  ]
},
];
