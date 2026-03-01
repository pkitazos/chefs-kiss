export interface MenuItem {
  name: string;
  price: number;
  description?: string;
}

export interface MenuSection {
  section: string;
  items: MenuItem[];
}

export interface Vendor {
  id: string;
  name: string;
  cuisine: string;
  menu: MenuSection[];
}

export const vendors: Vendor[] = [
  {
    id: "hard-rock",
    name: "Hard Rock",
    cuisine: "American",
    menu: [
      {
        section: "Burgers",
        items: [
          {
            name: "Classic Burger",
            price: 12,
            description: "Beef patty, lettuce, tomato, pickle",
          },
          {
            name: "Double Stack",
            price: 16,
            description: "Two patties, cheddar, caramelized onions",
          },
          {
            name: "Mushroom Melt",
            price: 14,
            description: "Swiss, sautéed mushrooms, truffle aioli",
          },
        ],
      },
      {
        section: "Sides",
        items: [
          { name: "Fries", price: 5 },
          { name: "Onion Rings", price: 6 },
          { name: "Coleslaw", price: 4 },
        ],
      },
      {
        section: "Drinks",
        items: [
          { name: "Lemonade", price: 4 },
          { name: "Iced Tea", price: 3 },
          { name: "Craft Soda", price: 4 },
        ],
      },
    ],
  },
  {
    id: "soukris",
    name: "Soukris",
    cuisine: "Greek",
    menu: [
      {
        section: "Mains",
        items: [
          {
            name: "Lamb Souvlaki",
            price: 15,
            description: "Marinated lamb skewers, pita, tzatziki",
          },
          {
            name: "Grilled Octopus",
            price: 18,
            description: "Charred octopus, lemon oil, capers",
          },
          {
            name: "Moussaka",
            price: 14,
            description: "Layered eggplant, ground beef, béchamel",
          },
        ],
      },
      {
        section: "Mezze",
        items: [
          { name: "Hummus & Pita", price: 7 },
          {
            name: "Spanakopita",
            price: 8,
            description: "Spinach & feta phyllo pie",
          },
          {
            name: "Dolmades",
            price: 9,
            description: "Stuffed grape leaves, rice, herbs",
          },
        ],
      },
      {
        section: "Desserts",
        items: [
          { name: "Baklava", price: 6 },
          {
            name: "Galaktoboureko",
            price: 7,
            description: "Custard pastry, orange syrup",
          },
        ],
      },
    ],
  },
  {
    id: "loukou",
    name: "Loukou",
    cuisine: "Café & Pastries",
    menu: [
      {
        section: "Pastries",
        items: [
          { name: "Croissant", price: 4 },
          { name: "Pain au Chocolat", price: 5 },
          {
            name: "Almond Tart",
            price: 6,
            description: "Frangipane cream, toasted almonds",
          },
        ],
      },
      {
        section: "Coffee",
        items: [
          { name: "Espresso", price: 3 },
          { name: "Flat White", price: 4 },
          { name: "Iced Latte", price: 5 },
        ],
      },
      {
        section: "Light Bites",
        items: [
          {
            name: "Avocado Toast",
            price: 9,
            description: "Sourdough, poached egg, chilli flakes",
          },
          {
            name: "Croque Monsieur",
            price: 10,
            description: "Ham, Gruyère, Dijon béchamel",
          },
        ],
      },
    ],
  },
  {
    id: "meze-corner",
    name: "Meze Corner",
    cuisine: "Middle Eastern",
    menu: [
      {
        section: "Starters",
        items: [
          {
            name: "Falafel Plate",
            price: 9,
            description: "Six pieces, tahini, pickled turnip",
          },
          {
            name: "Fattoush Salad",
            price: 8,
            description: "Tomato, cucumber, crispy pita, sumac",
          },
          { name: "Baba Ganoush", price: 7 },
        ],
      },
      {
        section: "Mains",
        items: [
          {
            name: "Shawarma Wrap",
            price: 12,
            description: "Chicken, garlic sauce, pickles",
          },
          {
            name: "Kafta Platter",
            price: 14,
            description: "Spiced ground beef, rice, salad",
          },
          { name: "Veggie Bowl", price: 11 },
        ],
      },
    ],
  },
  {
    id: "spice-trail",
    name: "Spice Trail",
    cuisine: "Indian",
    menu: [
      {
        section: "Curries",
        items: [
          {
            name: "Butter Chicken",
            price: 14,
            description: "Creamy tomato sauce, basmati rice",
          },
          {
            name: "Lamb Rogan Josh",
            price: 16,
            description: "Slow-cooked, aromatic spices",
          },
          { name: "Paneer Tikka Masala", price: 13 },
        ],
      },
      {
        section: "Breads & Sides",
        items: [
          { name: "Garlic Naan", price: 4 },
          {
            name: "Samosas (2 pcs)",
            price: 6,
            description: "Potato & pea filling, mint chutney",
          },
          { name: "Raita", price: 3 },
        ],
      },
      {
        section: "Desserts",
        items: [
          { name: "Mango Lassi", price: 5 },
          {
            name: "Gulab Jamun",
            price: 5,
            description: "Rose syrup, cardamom",
          },
        ],
      },
    ],
  },
];
