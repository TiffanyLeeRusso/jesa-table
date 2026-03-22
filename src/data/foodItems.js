/**
 * targetSlot mapping:
 * Row 1 (back/North): candle1, utensils, rice, tablet, clearsoup, ricecake, candle2
 * Row 2: meat, shrimp, wholefish
 * Row 3: tofu, friedfish, friedpotato, pancake
 * Row 4: beef jerky, laver, namul, beef soup, water kimchi
 * Row 5 (Front/South): jujubes, chestnuts, pears, persimmons, apples, grapes, cantaloupe
 * Row 6: (Drink offering): incense, sticks, bowl
 * Row 7: (Drink offering): cup, drink
 */

const getImageUrl = (name) => {
  try {
    return new URL(`../assets/images/food/${name}.png`, import.meta.url).href;
  } catch (error) {
    return `https://placehold.co/100x100/white/333?text=${name}`;
  }
};

export const foodItems = [
  // --- Row 1 (back/North) ---
  {
    id: "candle1",
    name: "촛불 (Candle 1)",
    targetSlot: "slot-1-1",
    image: getImageUrl("candle1"),
    type: "setting",
    description: "Place the first candle on the right from the ancestor's perspective."
  },
  {
    id: "utensils",
    name: "수저 (Utensils)",
    targetSlot: "slot-1-2",
    image: getImageUrl("utensils"),
    type: "setting",
    description: "Place the utensils to the right from the ancestor's perspective."
  },
  {
    id: "rice",
    name: "메 (Rice)",
    targetSlot: "slot-1-3",
    image: getImageUrl("rice"),
    type: "grain",
    description: "Place the rice to the right from the ancestor's perspective."
  },
  {
    id: "tablet",
    name: "신위 (Ancestor tablet)",
    targetSlot: "slot-1-4",
    image: getImageUrl("tablet"),
    type: "setting",
    description: "Remember the ancestor tablet symbolizes the ancestor."
  },
  {
    id: "clearsoup",
    name: "청국 (Clear soup)",
    targetSlot: "slot-1-5",
    image: getImageUrl("clearsoup"),
    type: "grain",
    description: "Place the clear soup to the right of the rice."
  },
  {
    id: "ricecake",
    name: "떡 (Ricecakes)",
    targetSlot: "slot-1-6",
    image: getImageUrl("ricecake"),
    type: "grain",
    description: "Place the ricecakes on the left from the ancestor's perspective."
  },
  {
    id: "candle2",
    name: "촛불 (Candle 2)",
    targetSlot: "slot-1-7",
    image: getImageUrl("candle2"),
    type: "setting",
    description: "Place the second candle on the left from the ancestor's perspective."
  },

  // --- Row 2 ---
  {
    id: "meat",
    name: "쇠고기 (Meat)",
    targetSlot: "slot-2-1",
    image: getImageUrl("meat"),
    type: "meat",
    description: "Place the meat on the West side."
  },
  {
    id: "shrimp",
    name: "새우전 (Shrimp)",
    targetSlot: "slot-2-2",
    image: getImageUrl("shrimp"),
    type: "meat",
    description: "Place the shrimp on the East side."
  },
  {
    id: "wholefish",
    name: "생선구이 (Fish)",
    targetSlot: "slot-2-3",
    image: getImageUrl("wholefish"),
    type: "meat",
    description: "Remember the fish goes on the East side."
  },

  // --- Row 3 ---
  {
    id: "tofu",
    name: "두부 (Tofu)",
    targetSlot: "slot-3-1",
    image: getImageUrl("tofu"),
    type: "secondary",
    description: "Tofu goes on the left!"
  },
  {
    id: "friedfish",
    name: "생선전 (Fried fish)",
    image: getImageUrl("friedfish"),
    targetSlot: "slot-3-2",
    type: "secondary",
    description: "Fried fish goes to the left of the potatoes."
  },
  {
    id: "friedpotato",
    name: "감자전 (Fried potato)",
    image: getImageUrl("friedpotato"),
    targetSlot: "slot-3-3",
    type: "secondary",
    description: "The fried potatoes go next to the fried fish."
  },
  {
    id: "pancake",
    name: "채소전 (Veggie pancake)",
    image: getImageUrl("pancake"),
    targetSlot: "slot-3-4",
    type: "secondary",
    description: "The veggie pancake goes on the right."
  },

  // --- Row 4 ---
  {
    id: "beefjerky",
    name: "육포 (Beef jerky)",
    image: getImageUrl("beefjerky"),
    targetSlot: "slot-4-1",
    type: "veg",
    description: "Remember the beef jerky and meat go on the West side."
  },
  {
    id: "laver",
    name: "김 (Laver)",
    image: getImageUrl("laver"),
    targetSlot: "slot-4-2",
    type: "veg",
    description: "The seaweed goes next to the beef jerky."
  },
  {
    id: "namul",
    name: "나물 (Namul)",
    image: getImageUrl("namul"),
    targetSlot: "slot-4-3",
    type: "veg",
    description: "The namul goes in the middle."
  },
  {
    id: "beefsoup",
    name: "소고기탕 (Beef soup)",
    image: getImageUrl("beefsoup"),
    targetSlot: "slot-4-4",
    type: "veg",
    description: "The beef soup goes on the right."
  },
  {
    id: "waterkimchi",
    name: "물김치 (Water kimchi)",
    image: getImageUrl("waterkimchi"),
    targetSlot: "slot-4-5",
    type: "veg",
    description: "The kimchi is on the ancestor's left (East)."
  },

  // --- Row 5: Fruits & Sweets (Front) ---
  {
    id: "jujubes",
    name: "대추 (Jujube)",
    image: getImageUrl("jujubes"),
    targetSlot: "slot-5-1",
    type: "fruit",
    description: "Red fruits like jujubes go on the East side!"
  },
  {
    id: "chestnuts",
    name: "밤 (Chestnut)",
    image: getImageUrl("chestnuts"),
    targetSlot: "slot-5-2",
    type: "fruit",
    description: "Chestnuts go next to the jujubes."
  },
  {
    id: "pears",
    name: "배 (Pear)",
    image: getImageUrl("pears"),
    targetSlot: "slot-5-3",
    type: "fruit",
    description: ""
  },
  {
    id: "persimmons",
    name: "감 (Persimmon)",
    image: getImageUrl("persimmons"),
    targetSlot: "slot-5-4",
    type: "fruit",
    description: ""
  },
  {
    id: "apples",
    name: "사과 (Apple)",
    image: getImageUrl("apples"),
    targetSlot: "slot-5-5",
    type: "fruit",
    description: ""
  },
  {
    id: "grapes",
    name: "포도 (Grape)",
    image: getImageUrl("grapes"),
    targetSlot: "slot-5-6",
    type: "fruit",
    description: "Place the grapes on the East side."
  },
  {
    id: "cantaloupe",
    name: "멜론 (Cantaloupe)",
    image: getImageUrl("cantaloupe"),
    targetSlot: "slot-5-7",
    type: "fruit",
    description: "Lighter-colored fruits like cantaloupe go on the East side."
  },

  // --- Row 6 (Drink offering) ---
  {
    id: "incense",
    name: "향 (Incense)",
    image: getImageUrl("incense"),
    targetSlot: "slot-6-1",
    type: "drink",
    description: ""
  },
  {
    id: "sticks",
    name: "향합 (Sticks)",
    image: getImageUrl("sticks"),
    targetSlot: "slot-6-2",
    type: "drink",
    description: ""
  },
  {
    id: "bowl",
    name: "퇴주그릇 (Bowl)",
    image: getImageUrl("bowl"),
    targetSlot: "slot-6-3",
    type: "drink",
    description: ""
  },

  // --- Row 7: drink offering ---
  {
    id: "cup",
    name: "술잔 (Cup)",
    image: getImageUrl("cup"),
    targetSlot: "slot-7-1",
    type: "drink",
    description: ""
  },
  {
    id: "drink",
    name: "주병 (Drink)",
    image: getImageUrl("drink"),
    targetSlot: "slot-7-2",
    type: "drink",
    description: ""
  }
];

// Helper to define the physical layout of the table
export const tableSlots = [
  // Row 1 (Back)
  { id: 'slot-1-1', label: '1-1' },
  { id: 'slot-1-2', label: '1-2' },
  { id: 'slot-1-3', label: '1-3' },
  { id: 'slot-1-4', label: '1-4' },
  { id: 'slot-1-5', label: '1-5' },
  { id: 'slot-1-6', label: '1-6' },
  { id: 'slot-1-7', label: '1-7' },
  // Row 2
  { id: 'slot-2-1', label: '2-1' },
  { id: 'slot-2-2', label: '2-2' },
  { id: 'slot-2-3', label: '2-3' },
  // Row 3
  { id: 'slot-3-1', label: '3-1' },
  { id: 'slot-3-2', label: '3-2' },
  { id: 'slot-3-3', label: '3-3' },
  { id: 'slot-3-4', label: '3-4' },
  // Row 4
  { id: 'slot-4-1', label: '4-1' },
  { id: 'slot-4-2', label: '4-2' },
  { id: 'slot-4-3', label: '4-3' },
  { id: 'slot-4-4', label: '4-4' },
  { id: 'slot-4-5', label: '4-5' },
  // Row 5 (Front)
  { id: 'slot-5-1', label: '5-1' },
  { id: 'slot-5-2', label: '5-2' },
  { id: 'slot-5-3', label: '5-3' },
  { id: 'slot-5-4', label: '5-4' },
  { id: 'slot-5-5', label: '5-5' },
  { id: 'slot-5-6', label: '5-6' },
  { id: 'slot-5-7', label: '5-7' },
  // Row 6 (drink offering)
  { id: 'slot-6-1', label: '6-1' },
  { id: 'slot-6-2', label: '6-2' },
  { id: 'slot-6-3', label: '6-3' },
  // Row 7 (drink offering)
  { id: 'slot-7-1', label: '7-1' },
  { id: 'slot-7-2', label: '7-2' }
];
