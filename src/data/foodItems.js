/**
 * targetSlot mapping:
 * Row 3 (Back/North): Rice, Soup, Tteokguk
 * Row 2 (Middle): Meat, Fish, Pancakes (Jeon)
 * Row 1 (Front/South): Fruits (Apple, Pear, Persimmon)
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
  // --- Row 3: The "Main" offerings (Back of table) ---
  { 
    id: 'rice-1', 
    name: '메 (Rice)', 
    targetSlot: 'slot-3-1',
    image: getImageUrl('rice'), // Points to src/assets/images/food/rice.png
    type: 'grain',
    description: 'Place on the left from the ancestor\'s perspective.'
  },
  { 
    id: 'soup-1', 
    name: '갱 (Soup)',
    image: getImageUrl('soup'),
    targetSlot: 'slot-3-2', 
    type: 'soup',
    description: 'Place to the right of the rice.'
  },
  { 
    id: 'tteokguk-1', 
    name: '떡국 (Rice Cake Soup)', 
    image: getImageUrl('rice-cake-soup'),
    targetSlot: 'slot-3-3', 
    type: 'soup' 
  },

  // --- Row 2: Savory dishes (Middle) ---
  { 
    id: 'meat-jeon', 
    name: '육전 (Meat Pancakes)', 
    image: getImageUrl('meat-pancakes'),
    targetSlot: 'slot-2-1', 
    type: 'jeon' 
  },
  { 
    id: 'fish-jeon', 
    name: '어전 (Fish Pancakes)', 
    image: getImageUrl('fish-pancakes'),
    targetSlot: 'slot-2-2', 
    type: 'jeon' 
  },

  // --- Row 1: Fruits & Sweets (Front) ---
  { 
    id: 'apple-1', 
    name: '사과 (Apple)', 
    image: getImageUrl('apples'),
    targetSlot: 'slot-1-1', 
    type: 'fruit' 
  },
  { 
    id: 'pear-1', 
    name: '배 (Pear)', 
    image: getImageUrl('pears'),
    targetSlot: 'slot-1-2', 
    type: 'fruit' 
  },
  { 
    id: 'persimmon-1', 
    name: '곶감 (Dried Persimmon)', 
    image: getImageUrl('persimmons'),
    targetSlot: 'slot-1-3', 
    type: 'fruit' 
  }
];

// Helper to define the physical layout of the table
export const tableSlots = [
  // Row 3 (Back)
  { id: 'slot-3-1', label: 'Back Left' },
  { id: 'slot-3-2', label: 'Back Center' },
  { id: 'slot-3-3', label: 'Back Right' },
  // Row 2 (Middle)
  { id: 'slot-2-1', label: 'Middle Left' },
  { id: 'slot-2-2', label: 'Middle Right' },
  // Row 1 (Front)
  { id: 'slot-1-1', label: 'Front Left' },
  { id: 'slot-1-2', label: 'Front Center' },
  { id: 'slot-1-3', label: 'Front Right' }
];
