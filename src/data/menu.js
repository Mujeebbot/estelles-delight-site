// Single source of truth for prices, sizes and minimum order quantities.
// Taken from the Estelle's Delight menu posters. Edit here and every section updates.

export const WHATSAPP = '61426921991'
export const EMAIL = 'estelledelight@gmail.com'

export const CHINCHIN_SIZES = [
  { key: '100g',  label: '100g pack',   price: 10,  min: 5, note: 'Minimum 5 packs per flavour' },
  { key: '800g',  label: '800g',        price: 60,  min: 1 },
  { key: '2L',    label: '2L jar',      price: 70,  min: 1 },
  { key: '3.5L',  label: '3.5L bucket', price: 135, min: 1 },
  { key: '5.1L',  label: '5.1L bucket', price: 185, min: 1 },
]

export const CHINCHIN_CATEGORIES = [
  { key: 'nuts',   name: 'Nuts & Seeds',   items: ['Trail Mix', 'Peanut', 'Pecans', 'Sesame', 'Almond', 'Hazelnut', 'Pistachios', 'Macadamia'] },
  { key: 'fruity', name: 'Fruity',         items: ['Prunes', 'Apricot', 'Orange', 'Coconut', 'Sultanas', 'Cranberry', 'Strawberry', 'Lemon Zest', 'Fruit Mix'] },
  { key: 'creamy', name: 'Creamy',         items: ['Vanilla', 'Baileys', 'Chocolate', 'Buttermilk', 'Shortbread', 'Malted Milk', 'Butterscotch', 'Salted Caramel'] },
  { key: 'relish', name: 'Relish Spices',  items: ['Ginger', 'Nutmeg', 'Cinnamon', 'Suya Spice', 'Chilli Pepper', 'Black Pepper'] },
]

// Each group: items share a minimum order quantity (min) and a quantity step after the minimum.
export const CATALOGUE = [
  {
    key: 'smallchops', title: 'Small Chops & Grills', icon: 'box',
    blurb: 'Pack your own box. Delivery or pickup, fee applies.',
    groups: [
      { title: 'Small chops', photo: 'bites', items: [
        { id: 'sc-springroll', name: 'Spring rolls',               price: 3,  min: 10, step: 5 },
        { id: 'sc-samosa',     name: 'Samosa',                     price: 3,  min: 10, step: 5 },
        { id: 'sc-meatpie',    name: 'Medium meat pies',           price: 5,  min: 12, step: 6 },
        { id: 'sc-gizzard',    name: '2 gizzards on a skewer',     price: 5,  min: 12, step: 6 },
      ]},
      { title: 'Grills', photo: 'grills', items: [
        { id: 'sc-drumstick',  name: 'Grilled pepper drumstick',   price: 5,  min: 10, step: 5 },
        { id: 'sc-wings',      name: 'Grilled pepper wings',       price: 5,  min: 10, step: 5 },
        { id: 'sc-turkey',     name: 'Grilled pepper turkey',      price: 10, min: 6,  step: 2 },
      ]},
    ],
  },
  {
    key: 'pies', title: 'Meat Pies', icon: 'pie',
    blurb: 'Flaky, juicy and baked fresh. Beef, fish or chicken.',
    groups: [
      { title: 'Mini pies (minimum 15)', photo: 'p1', items: [
        { id: 'pie-mini-beef',    name: 'Mini beef pie',     price: 4, min: 15, step: 5 },
        { id: 'pie-mini-fish',    name: 'Mini fish pie',     price: 5, min: 15, step: 5 },
        { id: 'pie-mini-chicken', name: 'Mini chicken pie',  price: 6, min: 15, step: 5 },
      ]},
      { title: 'Medium pies (minimum 12)', photo: 'p2', items: [
        { id: 'pie-med-beef',    name: 'Medium beef pie',    price: 5, min: 12, step: 6 },
        { id: 'pie-med-fish',    name: 'Medium fish pie',    price: 6, min: 12, step: 6 },
        { id: 'pie-med-chicken', name: 'Medium chicken pie', price: 7, min: 12, step: 6 },
      ]},
      { title: 'Large pies (minimum 12)', photo: 'p3', items: [
        { id: 'pie-lg-beef',    name: 'Large beef pie',      price: 8,  min: 12, step: 6 },
        { id: 'pie-lg-fish',    name: 'Large fish pie',      price: 9,  min: 12, step: 6 },
        { id: 'pie-lg-chicken', name: 'Large chicken pie',   price: 10, min: 12, step: 6 },
      ]},
    ],
  },
  {
    key: 'puffpuff', title: 'Puff-Puff', icon: 'ball',
    blurb: 'Fluffy, golden and fried to order. Minimum 30 pieces.',
    groups: [
      { title: 'Classic, $1 each', photo: 'classic', items: [
        { id: 'pp-nutmeg',   name: 'Nutmeg (original)', price: 1, min: 30, step: 10 },
        { id: 'pp-chilly',   name: 'Chilly',            price: 1, min: 30, step: 10 },
        { id: 'pp-ginger',   name: 'Ginger',            price: 1, min: 30, step: 10 },
        { id: 'pp-coconut',  name: 'Coconut',           price: 1, min: 30, step: 10 },
        { id: 'pp-cinnamon', name: 'Cinnamon',          price: 1, min: 30, step: 10 },
      ]},
      { title: 'Sweet, $1.50 each', photo: 'sweet', items: [
        { id: 'pp-banana',   name: 'Banana',         price: 1.5, min: 30, step: 10 },
        { id: 'pp-choc',     name: 'Chocolate',      price: 1.5, min: 30, step: 10 },
        { id: 'pp-chocchip', name: 'Chocolate chip', price: 1.5, min: 30, step: 10 },
      ]},
    ],
    footnote: 'Glaze toppings (chocolate, strawberry, caramel, banana, lotus, Oreo, Biscoff, sprinkles) are an extra $10 per 30 pieces. Add it in your notes.',
  },
  {
    key: 'drinks', title: 'Mocktails & Zobo', icon: 'cup',
    blurb: 'Made fresh and alcohol-free. Minimum 6 cans.',
    groups: [{
      title: 'Canned drinks', photo: 'cans',
      items: [
        { id: 'dr-mocktail', name: 'Mocktail, 350ml can',         price: 10, min: 6, step: 6 },
        { id: 'dr-zobo',     name: 'Tropical Citrus Zobo, 500ml', price: 10, min: 6, step: 6 },
      ],
    }],
    footnote: 'Tell us your mocktail flavours in the notes: Mojitos, Blue Lagoon, Citrus Breeze, Strawberry Crush, Chapman Classic and more.',
  },
]

export const OCCASIONS = [
  { key: 'wedding',    label: 'Wedding',      icon: 'rings' },
  { key: 'birthday',   label: 'Birthday',     icon: 'cake' },
  { key: 'corporate',  label: 'Corporate',    icon: 'building' },
  { key: 'babyshower', label: 'Baby Shower',  icon: 'baby' },
  { key: 'engagement', label: 'Engagement',   icon: 'gem' },
  { key: 'justbecause', label: 'Just Because', icon: 'sparkle' },
]

export const money = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`
