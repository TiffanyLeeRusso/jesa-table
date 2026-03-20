/**
 * targetSlot mapping:
 * Row 5 (back/North): candle1, utensils, rice, tablet, clearsoup, ricecake, candle2
 * Row 4: meat, shrimp, wholefish
 * Row 3: tofu, friedfish, friedpotato, pancake
 * Row 2: beef jerky, laver, namul, beef soup, water kimchi
 * Row 1 (Front/South): jujubes, chestnuts, pears, persimmons, apples, grapes, cantaloupe
 */

const getImageUrl = (name) => {
  // Assumes images are in src/assets/images/food/
  try {
    return new URL(`../assets/images/food/${name}.png`, import.meta.url).href;
  } catch (error) {
    return `https://placehold.co/100x100/white/333?text=${name}`;
  }
};

export const foodItems = [
    // --- Row 5 (back/North) ---
  {
    id: "candle1",
    name: " (Candle1)",
    targetSlot: "slot-5-1",
    image: getImageUrl("candle1"),
    type: "setting",
    description: "Place the first candle on the right from the ancestor's perspective."
  },
  {
    id: "utensils",
    name: " (Utensils)",
    targetSlot: "slot-5-2",
    image: getImageUrl("utensils"),
    type: "setting",
    description: "Place the utensils to the right from the ancestor's perspective."
  },
  {
    id: "rice",
    name: "메 (Rice)",
    targetSlot: "slot-5-3",
    image: getImageUrl("rice"),  // Points to src/assets/images/food/rice.png
    type: "grain",
    description: "Place the rice to the right from the ancestor's perspective."
  },
  {
    id: "tablet",
    name: " (Ancestor tablet)",
    targetSlot: "slot-5-4",
    image: getImageUrl("rice"),
    type: "setting",
    description: "Remember the ancestor tablet symbolizes the ancestor."
  },
  {
    id: "clearsoup",
    name: "청국 (Clear soup)",
    targetSlot: "slot-5-5",
    image: getImageUrl("rice"),
    type: "grain",
    description: "Place the clear soup to the right of the rice."
  },
  {
    id: "ricecake",
    name: "떡 (Ricecakes)",
    targetSlot: "slot-5-6",
    image: getImageUrl("ricecake"),
    type: "grain",
    description: "Place the ricecakes on the left from the ancestor's perspective."
  },
  {
    id: "candle2",
    name: " (Candle 2)",
    targetSlot: "slot-5-7",
    image: getImageUrl("candle2"),
    type: "setting",
    description: "Place the second candle on the left from the ancestor's perspective."
  },

  // --- Row 4 ---
  {
    id: "meat",
    name: "쇠고기 (Meat)",
    targetSlot: "slot-4-1",
    image: getImageUrl("meat"),
    type: "meat",
    description: "Place the meat on the West side."
  },
  {
    id: "shrimp",
    name: "새우전 (Shrimp)",
    targetSlot: "slot-4-2",
    image: getImageUrl("shrimp"),
    type: "meat",
    description: "Place the shrimp on the East side."
  },
  {
    id: "wholefish",
    name: "생선구이 (Fish)",
    targetSlot: "slot-4-3",
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

  // --- Row 2 ---
  {
    id: "beefjerky",
    name: "육포 (Beef jerky)",
    image: getImageUrl("beefjerky"),
    targetSlot: "slot-2-1",
    type: "veg",
    description: "Remember the beef jerky and meat go on the West side."
  },
  {
    id: "laver",
    name: "김 (Laver)",
    image: getImageUrl("laver"),
    targetSlot: "slot-2-2",
    type: "veg",
    description: "The seaweed goes next to the beef jerky."
  },
  {
    id: "namul",
    name: "나물 (Namul)",
    image: getImageUrl("namul"),
    targetSlot: "slot-2-3",
    type: "veg",
    description: "The namul goes in the middle."
  },
  {
    id: "beefsoup",
    name: "소고기탕 (Beef soup)",
    image: getImageUrl("beefsoup"),
    targetSlot: "slot-2-4",
    type: "veg",
    description: "The beef soup goes on the right."
  },
  {
    id: "waterkimchi",
    name: "물김치 (Water kimchi)",
    image: getImageUrl("waterkimchi"),
    targetSlot: "slot-2-5",
    type: "veg",
    description: "The kimchi is on the ancestor's left (East)."
  },

  // --- Row 1: Fruits & Sweets (Front) ---
  {
    id: "jujubes",
    name: "대추 (Jujube)",
    image: getImageUrl("jujubes"),
    targetSlot: "slot-1-1",
    type: "fruit",
    description: "Red fruits like jujubes go on the East side!"
  },
  {
    id: "chestnuts",
    name: "밤 (Chestnut)",
    image: getImageUrl("chestnuts"),
    targetSlot: "slot-1-2",
    type: "fruit",
    description: "Chestnuts go next to the jujubes."
  },
  {
    id: "pears",
    name: "배 (Pear)",
    image: getImageUrl("pears"),
    targetSlot: "slot-1-3",
    type: "fruit",
    description: ""
  },
  {
    id: "persimmons",
    name: "감 (Persimmon)",
    image: getImageUrl("persimmons"),
    targetSlot: "slot-1-4",
    type: "fruit",
    description: ""
  },
  {
    id: "apples",
    name: "사과 (Apple)",
    image: getImageUrl("apples"),
    targetSlot: "slot-1-5",
    type: "fruit",
    description: ""
  },
  {
    id: "grapes",
    name: "포도 (Grape)",
    image: getImageUrl("grapes"),
    targetSlot: "slot-1-6",
    type: "fruit",
    description: "Place the grapes on the East side."
  },
  {
    id: "cantaloupe",
    name: "멜론 (Cantaloupe)",
    image: getImageUrl("cantaloupe"),
    targetSlot: "slot-1-7",
    type: "fruit",
    description: "Lighter-colored fruits like cantaloupe go on the East side."
  }
];

// Helper to define the physical layout of the table
export const tableSlots = [
  // Row 5 (Back)
  { id: 'slot-5-1', label: '5-1' },
  { id: 'slot-5-2', label: '5-2' },
  { id: 'slot-5-3', label: '5-3' },
  { id: 'slot-5-4', label: '5-4' },
  { id: 'slot-5-5', label: '5-5' },
  { id: 'slot-5-6', label: '5-6' },
  { id: 'slot-5-7', label: '5-7' },
  // Row 4
  { id: 'slot-4-1', label: '4-1' },
  { id: 'slot-4-2', label: '4-2' },
  { id: 'slot-4-3', label: '4-3' },
  // Row 3
  { id: 'slot-3-1', label: '3-1' },
  { id: 'slot-3-2', label: '3-2' },
  { id: 'slot-3-3', label: '3-3' },
  { id: 'slot-3-4', label: '3-4' },
  // Row 2
  { id: 'slot-2-1', label: '2-1' },
  { id: 'slot-2-2', label: '2-2' },
  { id: 'slot-2-3', label: '2-3' },
  { id: 'slot-2-4', label: '2-4' },
  { id: 'slot-2-5', label: '2-5' },
  // Row 1 (Front)
  { id: 'slot-1-1', label: '1-1' },
  { id: 'slot-1-2', label: '1-2' },
  { id: 'slot-1-3', label: '1-3' },
  { id: 'slot-1-4', label: '1-4' },
  { id: 'slot-1-5', label: '1-5' },
  { id: 'slot-1-6', label: '1-6' },
  { id: 'slot-1-7', label: '1-7' }
];
