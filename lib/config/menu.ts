export interface MenuItem {
  name: string;
  price: number;
  description?: string;
}

export interface MenuSection {
  section: string;
  items: MenuItem[];
}

export type VendorAccent = "amber" | "pink" | "sky" | "orange" | "green";
export type VendorIcon = "grill" | "meat" | "coffee" | "salad" | "pepper";

export interface Vendor {
  id: string;
  name: string;
  cuisine: string;
  image: string;
  accent: VendorAccent;
  icon: VendorIcon;
  menu: MenuSection[];
}

const PLACEHOLDER_PRICE = 10;

export const MENU_VENDORS: Vendor[] = [
  {
    id: "yozen",
    name: "Yozen",
    cuisine: "Frozen Yoghurt & Desserts",
    image: "/vendors/yozen.jpg",
    accent: "pink",
    icon: "coffee",
    menu: [
      {
        section: "Frozen Yoghurt",
        items: [
          { name: "Yozen Skinny", price: 4 },
          { name: "Yozen Midi", price: 5 },
          { name: "Yozen Parfait", price: 8 },
          { name: "Yozen Cone", price: 3 },
        ],
      },
      {
        section: "Strawberry Delights",
        items: [
          { name: "Dubai Strawberry Delight", price: 9 },
          { name: "Lotus Biscoff Strawberry Delight", price: 9 },
          { name: "Nutella Strawberry Delight", price: 9 },
        ],
      },
      {
        section: "Extras",
        items: [{ name: "Extra Toppings / Hot Dips / Nuts", price: 1 }],
      },
    ],
  },
  {
    id: "to-glykatzidiko",
    name: "To Glykatzidiko",
    cuisine: "Desserts & Ice Cream",
    image: "/vendors/to-glykatzidiko.jpg",
    accent: "green",
    icon: "coffee",
    menu: [
      {
        section: "Ice Cream",
        items: [
          { name: "1 Scoop", price: 3 },
          { name: "2 Scoops", price: 5 },
        ],
      },
      {
        section: "Loukoumades",
        items: [
          { name: "Loukoumades (Traditional)", price: 5 },
          { name: "Loukoumades with Spread", price: 6 },
        ],
      },
    ],
  },
  {
    id: "crepaland",
    name: "Crepaland",
    cuisine: "Crepes",
    image: "/vendors/crepaland.jpg",
    accent: "amber",
    icon: "coffee",
    menu: [
      {
        section: "Crepes",
        items: [
          { name: "Sweet", price: 6 },
          { name: "Savoury", price: 7 },
        ],
      },
    ],
  },
  {
    id: "por-favor",
    name: "Por Favor",
    cuisine: "Mexican",
    image: "/vendors/por-favor.jpg",
    accent: "orange",
    icon: "pepper",
    menu: [
      {
        section: "Tacos",
        items: [
          { name: "Crispy Chicken Tacos", price: 12 },
          { name: "Barbacoa Tacos", price: 12 },
        ],
      },
      {
        section: "Burgers",
        items: [
          { name: "Crispy Chicken Burger", price: 12 },
          { name: "Barbacoa Burger", price: 12 },
        ],
      },
    ],
  },
  {
    id: "gems-food-truck",
    name: "Gems Food Truck",
    cuisine: "Street Food",
    image: "/vendors/gems-food-truck.jpg",
    accent: "sky",
    icon: "grill",
    menu: [
      {
        section: "Mains",
        items: [
          { name: "Κοτόπουλο με Σισάμι", price: 12 },
          { name: "Γαρίδες και Κοτόπουλο σε Ψωμάκι", price: 12 },
        ],
      },
      {
        section: "Sides",
        items: [
          { name: "Πατάτες", price: 4 },
          { name: "Γλυκοπατάτες", price: 6 },
        ],
      },
    ],
  },
  {
    id: "mays-diner",
    name: "May's Diner",
    cuisine: "Burgers & BBQ",
    image: "/vendors/mays-diner.jpg",
    accent: "amber",
    icon: "grill",
    menu: [
      {
        section: "Burgers",
        items: [
          {
            name: "Smash Cheeseburger",
            price: 12,
            description: "Burger sauce, lettuce, tomato, onion, gherkins",
          },
          {
            name: "Smoked Pulled Pork Burger",
            price: 10,
            description: "Smoked pork with BBQ glaze in a bun",
          },
          {
            name: "Smoked Brisket Burger",
            price: 12,
            description: "Smoked beef brisket with BBQ honey glaze in a bun",
          },
        ],
      },
      {
        section: "Sides",
        items: [
          {
            name: "Double-Fried Fries",
            price: 4,
          },
        ],
      },
    ],
  },
  {
    id: "pizzella",
    name: "Pizzella",
    cuisine: "Pizza",
    image: "/vendors/pizzella.jpg",
    accent: "green",
    icon: "pepper",
    menu: [
      {
        section: "Pizza",
        items: [
          {
            name: "Margherita",
            price: 6,
            description: "Cheese Only",
          },
          {
            name: "Salame Piccante",
            price: 8,
            description: "Cheese & Pepperoni",
          },
          {
            name: "Prosciutto",
            price: 8,
            description: "Cheese & Ham",
          },
          {
            name: "Venture",
            price: 8,
            description: "Cheese & Vegetables",
          },
        ],
      },
    ],
  },
  {
    id: "to-souvlaki-tou-soukri",
    name: "To Souvlaki tou Soukri",
    cuisine: "Greek Grill",
    image: "/vendors/to-souvlaki-tou-soukri.jpg",
    accent: "amber",
    icon: "meat",
    menu: [
      {
        section: "From the Grill",
        items: [
          { name: "Pork Souvlaki", price: 3 },
          { name: "Chicken Souvlaki", price: 3 },
          { name: "Pork Belly", price: 3 },
          { name: "Pork Sausage", price: 3 },
        ],
      },
    ],
  },
  {
    id: "cacio-e-pepe",
    name: "Cacio e Pepe",
    cuisine: "Italian",
    image: "/vendors/cacio-e-pepe.jpg",
    accent: "sky",
    icon: "pepper",
    menu: [
      {
        section: "Pizza",
        items: [
          { name: "Pizza Margherita", price: PLACEHOLDER_PRICE },
          { name: "Pizza Spianata", price: PLACEHOLDER_PRICE },
        ],
      },
      {
        section: "Pasta",
        items: [
          {
            name: "Casarecce with Creamy Mushrooms & Truffle Oil",
            price: PLACEHOLDER_PRICE,
          },
        ],
      },
    ],
  },
  {
    id: "hard-rock-cafe",
    name: "Hard Rock Cafe",
    cuisine: "American",
    image: "/vendors/hard-rock-cafe.jpg",
    accent: "amber",
    icon: "grill",
    menu: [
      {
        section: "Mains",
        items: [
          { name: "Boneless Bodacious Tenders", price: 8 },
          {
            name: "BBQ Pulled Pork Sandwich",
            price: PLACEHOLDER_PRICE,
          },
        ],
      },
      {
        section: "Sides",
        items: [{ name: "Fries", price: 4 }],
      },
    ],
  },
  {
    id: "zam-food-canteen",
    name: "Zam Food Canteen",
    cuisine: "Street Food",
    image: "",
    accent: "orange",
    icon: "pepper",
    menu: [
      {
        section: "Jacket Potatoes",
        items: [
          { name: "Dirty Diana", price: 12 },
          { name: "Hot AF", price: 10 },
          { name: "Simple but Juicy", price: 9 },
          { name: "Veggie Vibez", price: 8 },
          { name: "Call-Slaw Me Baby", price: 10 },
        ],
      },
      {
        section: "Nachos",
        items: [
          { name: "Boring", price: 7 },
          { name: "Nuevayol", price: 9 },
          { name: "The Explosion", price: 11 },
        ],
      },
    ],
  },
  {
    id: "wild-earth",
    name: "Wild Earth",
    cuisine: "Plant-Based",
    image: "/vendors/wild-earth.jpg",
    accent: "green",
    icon: "salad",
    menu: [
      {
        section: "Menu",
        items: [
          {
            name: "Smoky Arancini (VE)",
            price: 6,
            description: "3 pieces",
          },
          {
            name: "Truffle Pasta (VE)",
            price: 10,
          },
          {
            name: "Charlotte Black Trumpet",
            price: 5,
          },
        ],
      },
    ],
  },
  {
    id: "mr-wurst",
    name: "Mr. Wurst",
    cuisine: "Hot Dogs",
    image: "/vendors/mr-wurst.jpg",
    accent: "amber",
    icon: "meat",
    menu: [
      {
        section: "Hot Dogs",
        items: [
          { name: "The Wurst", price: 8 },
          { name: "Italian Wurst", price: 8 },
          { name: "Classic Wurst", price: 7 },
          { name: "Mexican Wurst", price: 8 },
        ],
      },
    ],
  },
  {
    id: "garden-gourmet",
    name: "Garden Gourmet",
    cuisine: "Plant-Based",
    image: "/vendors/garden-gourmet.jpg",
    accent: "green",
    icon: "salad",
    menu: [
      // todo: shorten descriptions
      {
        section: "Burgers",
        items: [
          {
            name: "Garden Gourmet Burger",
            price: 10,
            description: "",
            // "Signature plant-based patty on a house-made plant-based brioche bun, with caramelised onions, melted plant-based cheese, sliced tomatoes, cucumber pickles, crisp iceberg lettuce, and red onion. Finished with smoky BBQ mayo. All made from scratch.",
          },
        ],
      },
      {
        section: "Noodles",
        items: [
          {
            name: "Umami Noodles",
            price: 9,
            description: "",
            // "Wok-tossed noodles with fresh vegetables in our house-made teriyaki & black pepper sauce, finished with toasted sesame seeds, spring onions, and fresh coriander.",
          },
        ],
      },
      {
        section: "Sides",
        items: [
          {
            name: "Country-Style Fried Potatoes",
            price: PLACEHOLDER_PRICE,
            description: "",
            // "Fresh potatoes, oven-baked and hand-cut into rustic pieces, then fried until golden and crispy, finished with our signature seasoning.",
          },
        ],
      },
    ],
  },
  {
    id: "omni-eats",
    name: "Omni Eats",
    cuisine: "Middle Eastern",
    image: "/vendors/omni-eats.jpg",
    accent: "green",
    icon: "salad",
    menu: [
      {
        section: "Wraps & Bowls",
        items: [
          { name: "Falafel Pitta Wrap / Bowl", price: 9 },
          { name: "Chicken Shawarma Pitta Wrap / Bowl", price: 9 },
        ],
      },
      {
        section: "Sides",
        items: [
          { name: "Halloumi Bites", price: 6 },
          {
            name: "Fries",
            price: 3.5,
            description: "Upgrade to Loaded Chicken Shawarma fries for +€3.50",
          },
        ],
      },
    ],
  },
  {
    id: "nikkei",
    name: "Nikkei",
    cuisine: "Asian Fusion & Burgers",
    image: "/vendors/nikkei-peruvian-senses.jpg",
    accent: "pink",
    icon: "grill",
    menu: [
      {
        section: "Nikkei Signature",
        items: [
          {
            name: "Spicy Tuna roll",
            price: 8,
            description: "4 pieces",
          },
          {
            name: "Salmon roll",
            price: 8,
            description: "4 pieces",
          },
          { name: "Duck bao bun", price: 7 },
        ],
      },
      {
        section: "Nikkei Smash",
        items: [
          { name: "Street signature", price: 12 },
          { name: "1976", price: 12 },
          { name: "The classic", price: 12 },
        ],
      },
      {
        section: "Sides",
        items: [{ name: "French Fries", price: 4 }],
      },
    ],
  },
];
