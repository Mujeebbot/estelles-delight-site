import relishImg  from '../assets/images/flavour-relish.webp'
import nutsImg    from '../assets/images/flavour-nuts.webp'
import fruityImg  from '../assets/images/flavour-fruity.webp'
import creamyImg  from '../assets/images/flavour-creamy.webp'

export const flavours = [
  {
    key: 'nuts',
    name: 'Nuts & Seeds',
    count: '8 flavours',
    icon: 'nut',
    items: ['Peanut', 'Almond', 'Sesame', 'Pistachios', 'Pecans', 'Macadamia', 'Hazelnut', 'Trail Mix'],
    image: nutsImg,
    alt: 'Nuts & Seeds Chin-Chin packet',
    price: '$10 each',
  },
  {
    key: 'fruity',
    name: 'Fruity',
    count: '9 flavours',
    icon: 'leaf',
    items: ['Orange', 'Sultanas', 'Lemon Zest', 'Strawberry', 'Prunes', 'Apricot', 'Cranberry', 'Coconut', 'Fruit Mix'],
    image: fruityImg,
    alt: 'Fruity Chin-Chin packet',
    price: '$10 each',
  },
  {
    key: 'creamy',
    name: 'Creamy',
    count: '8 flavours',
    icon: 'cookie',
    items: ['Baileys', 'Vanilla', 'Malted Milk', 'Shortbread', 'Buttermilk', 'Butterscotch', 'Chocolate', 'Salted Caramel'],
    image: creamyImg,
    alt: 'Creamy Chin-Chin packet',
    price: '$10 each',
  },
  {
    key: 'relish',
    name: 'Relish Spices',
    count: '6 flavours',
    icon: 'flame',
    items: ['Ginger', 'Nutmeg', 'Cinnamon', 'Chilli Pepper', 'Black Pepper', 'Suya Spice'],
    image: relishImg,
    alt: 'Relish Spices Chin-Chin packet',
    price: '$10 each',
  },
]
