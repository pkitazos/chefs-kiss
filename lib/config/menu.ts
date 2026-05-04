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
  accent: VendorAccent;
  icon: VendorIcon;
  menu: MenuSection[];
}

function defineVendor<const Id extends string>(
  v: { id: Id } & Omit<Vendor, "id">,
) {
  return v;
}

export const MENU_VENDORS = [
  defineVendor({
    id: "to-glykatzidiko",
    name: "To Glykatzidiko",
    cuisine: "Desserts",
    accent: "pink",
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
  }),
  defineVendor({
    id: "crepaland",
    name: "Crepaland",
    cuisine: "Crepes",
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
  }),
  defineVendor({
    id: "por-favor",
    name: "Por Favor",
    cuisine: "Mexican",
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
  }),
  defineVendor({
    id: "yozen",
    name: "Yozen",
    cuisine: "Desserts",
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
          { name: "Dubai", price: 9 },
          { name: "Lotus Biscoff", price: 9 },
          { name: "Nutella", price: 9 },
        ],
      },
      {
        section: "Extras",
        items: [{ name: "Extra Toppings / Hot Dips / Nuts", price: 1 }],
      },
    ],
  }),
  defineVendor({
    id: "gems-food-truck",
    name: "Gems Food Truck",
    cuisine: "Street Food",
    accent: "sky",
    icon: "grill",
    menu: [
      {
        section: "Mains",
        items: [
          { name: "Sesame Chicken with Fries & Jack Daniels Sauce", price: 12 },
          {
            name: "Sesame Chicken with Fries & Honey Mustard Sauce",
            price: 12,
          },
          { name: "Beef Smash Burger with Fries", price: 12 },
          { name: "Chicken Burger with Fries", price: 12 },
          { name: "Prawns with Fries", price: 12 },
          { name: "Mozzarella Sticks with Fries", price: 12 },
          { name: "Spring Rolls with Fries", price: 12 },
          { name: "BBQ Wings with Fries", price: 12 },
          { name: "Honey Mustard Wings with Fries", price: 12 },
          { name: "Prawn Burger with Fries", price: 12 },
        ],
      },
      {
        section: "Sides",
        items: [
          { name: "Fries", price: 4 },
          { name: "Sweet Potato Fries", price: 6 },
        ],
      },
    ],
  }),
  defineVendor({
    id: "mays-diner",
    name: "May's Diner",
    cuisine: "Burgers",
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
  }),
  defineVendor({
    id: "pizzella",
    name: "Pizzella",
    cuisine: "Pizza",
    accent: "green",
    icon: "pepper",
    menu: [
      {
        section: "Pizza",
        items: [
          { name: "Rocket & Prosciutto", price: 12 },
          { name: "Mozzarella, Cherry Tomato & Basil", price: 12 },
          { name: "Pepperoni", price: 12 },
        ],
      },
    ],
  }),
  defineVendor({
    id: "to-souvlaki-tou-soukri",
    name: "To Souvlaki tou Soukri",
    cuisine: "Greek Grill",
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
  }),
  defineVendor({
    id: "cacio-e-pepe",
    name: "Cacio e Pepe",
    cuisine: "Italian",
    accent: "green",
    icon: "pepper",
    menu: [
      {
        section: "Pizza",
        items: [
          { name: "Pizza Margherita", price: 5 },
          { name: "Pizza Spianata", price: 5 },
        ],
      },
      {
        section: "Pasta",
        items: [
          {
            name: "Casarecce with Creamy Mushrooms & Truffle Oil",
            price: 5,
          },
        ],
      },
    ],
  }),
  defineVendor({
    id: "hard-rock-cafe",
    name: "Hard Rock Cafe",
    cuisine: "American",
    accent: "amber",
    icon: "grill",
    menu: [
      {
        section: "Mains",
        items: [
          { name: "Pulled Pork Sandwich", price: 9 },
          { name: "Boneless Bodacious Tenders", price: 9 },
        ],
      },
      {
        section: "Meals",
        items: [
          {
            name: "Pulled Pork Sandwich + Fries",
            price: 11,
          },
          {
            name: "Boneless Bodacious Tenders + Fries",
            price: 11,
          },
        ],
      },
      {
        section: "Sides",
        items: [{ name: "Fries", price: 4 }],
      },
    ],
  }),
  defineVendor({
    id: "wild-earth",
    name: "Wild Earth",
    cuisine: "Plant-Based",
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
  }),
  defineVendor({
    id: "mr-wurst",
    name: "Mr. Wurst",
    cuisine: "Hot Dogs",
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
  }),
  defineVendor({
    id: "garden-gourmet",
    name: "Garden Gourmet",
    cuisine: "Plant-Based",
    accent: "green",
    icon: "salad",
    menu: [
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
            price: 4,
            description: "",
            // "Fresh potatoes, oven-baked and hand-cut into rustic pieces, then fried until golden and crispy, finished with our signature seasoning.",
          },
        ],
      },
    ],
  }),
  defineVendor({
    id: "omni-eats",
    name: "Omni Eats",
    cuisine: "Middle Eastern",
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
  }),
  defineVendor({
    id: "nikkei",
    name: "Nikkei",
    cuisine: "Asian Fusion",
    accent: "sky",
    icon: "grill",
    menu: [
      {
        section: "Nikkei Signature",
        items: [
          { name: "Spicy Tuna roll", price: 8, description: "4 pieces" },
          { name: "Salmon roll", price: 8, description: "4 pieces" },
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
  }),
  defineVendor({
    id: "my-cookie-dough",
    name: "My Cookie Dough",
    cuisine: "Desserts",
    accent: "pink",
    icon: "coffee",
    menu: [
      {
        section: "Cookie Dough",
        items: [
          { name: "Cookie Dough Classic", price: 6 },
          { name: "Cookie Dough Special", price: 7 },
          { name: "Cookie Dough Stacks (Double)", price: 9 },
        ],
      },
      {
        section: "Ice Cream",
        items: [
          { name: "Ice Cream Sundaes", price: 5 },
          { name: "Soft Serve Ice Cream", price: 3 },
        ],
      },
      {
        section: "Extras",
        items: [{ name: "Extra Toppings", price: 1 }],
      },
    ],
  }),
  defineVendor({
    id: "kawacom",
    name: "Kawacom",
    cuisine: "Coffee & Drinks",
    accent: "amber",
    icon: "coffee",
    menu: [],
  }),
  defineVendor({
    id: "big-bad-wolf",
    name: "Big Bad Woolf",
    cuisine: "Greek Grill",
    accent: "amber",
    icon: "meat",
    menu: [
      {
        section: "Mains",
        items: [
          {
            name: "Pork Giros Portion",
            price: 10,
            description: "With chips, pitta, and sauce",
          },
        ],
      },
    ],
  }),
  defineVendor({
    id: "tarantula-fried-chicken",
    name: "Tarantula Fried Chicken",
    cuisine: "Fried Chicken",
    accent: "orange",
    icon: "meat",
    menu: [
      {
        section: "Menu",
        items: [
          {
            name: "Bucket",
            price: 14,
            description:
              "Fries, 4 chicken fingers, 2 sliders, 1 mega mac-mac sauce",
          },
          {
            name: "Loaded Fries",
            price: 10,
            description: "Fried chicken, aioli sauce, and parmesan",
          },
        ],
      },
    ],
  }),
  defineVendor({
    id: "german-donner",
    name: "German Donner",
    cuisine: "Kebab",
    accent: "orange",
    icon: "meat",
    menu: [],
  }),
  defineVendor({
    id: "chef-avraam",
    name: "Chef Avraam",
    cuisine: "Asian",
    accent: "orange",
    icon: "pepper",
    menu: [
      {
        section: "Chow Mein",
        items: [
          {
            name: "Vegetable Chow Mein",
            price: 10,
            description: "Choice of rice noodles or egg noodles",
          },
          {
            name: "Chicken Chow Mein",
            price: 10,
            description: "Choice of rice noodles or egg noodles",
          },
          {
            name: "Beef Chow Mein",
            price: 12,
            description: "Choice of rice noodles or egg noodles",
          },
        ],
      },
      {
        section: "Add-ons",
        items: [
          { name: "Extra Chicken", price: 2 },
          { name: "Extra Beef", price: 2 },
          { name: "Extra Vegetables", price: 2 },
          { name: "Fried Egg Topping", price: 2 },
        ],
      },
    ],
  }),
  defineVendor({
    id: "chef-noel",
    name: "Chef Noel",
    cuisine: "Gourmet",
    accent: "pink",
    icon: "meat",
    menu: [],
  }),
  defineVendor({
    id: "karas-fish-tavern",
    name: "Karas Fish Tavern",
    cuisine: "Seafood",
    accent: "sky",
    icon: "grill",
    menu: [
      {
        section: "Mains",
        items: [{ name: "Seafood Paella", price: 9 }],
      },
    ],
  }),
  defineVendor({
    id: "regrub",
    name: "Regrub",
    cuisine: "Burgers",
    accent: "amber",
    icon: "grill",
    menu: [
      {
        section: "Burgers",
        items: [
          { name: "Smash", price: 8 },
          { name: "Double Smash", price: 11 },
        ],
      },
      {
        section: "Add-ons",
        items: [
          { name: "Add Bacon", price: 1 },
          { name: "Add Jalapenos", price: 1 },
          { name: "Add Crispy Onions", price: 1 },
          { name: "Add Patty", price: 3 },
        ],
      },
    ],
  }),
  defineVendor({
    id: "midtown-bistro",
    name: "Midtown Bistro",
    cuisine: "Bistro",
    accent: "green",
    icon: "salad",
    menu: [],
  }),
  defineVendor({
    id: "meraki-tastes",
    name: "Meraki Taste",
    cuisine: "Greek",
    accent: "amber",
    icon: "meat",
    menu: [],
  }),
  defineVendor({
    id: "taste-of-tradition",
    name: "Taste of Tradition",
    cuisine: "Cypriot",
    accent: "amber",
    icon: "meat",
    menu: [],
  }),
  defineVendor({
    id: "little-chefs",
    name: "Little Chef's",
    cuisine: "Family Friendly",
    accent: "pink",
    icon: "pepper",
    menu: [],
  }),
  // defineVendor({
  //   id: "chefs-kiss-sliders",
  //   name: "Chef's Kiss Sliders",
  //   cuisine: "Sliders",
  //   accent: "amber",
  //   icon: "grill",
  //   menu: [],
  // }),
  defineVendor({
    id: "hb-hotdogs",
    name: "HB Hotdogs",
    cuisine: "Hot Dogs",
    accent: "orange",
    icon: "meat",
    menu: [
      {
        section: "Hot Dogs",
        items: [{ name: "Hot Dog", price: 7 }],
      },
    ],
  }),
  defineVendor({
    id: "megastronomy",
    name: "ME Gastronomy",
    cuisine: "Seafood",
    accent: "sky",
    icon: "grill",
    menu: [
      {
        section: "Mains",
        items: [
          {
            name: "Shrimp and Lobster Roll",
            price: 12,
            description:
              "Truffle honey mayo, cheddar cheese, pickled onions, chives",
          },
          {
            name: "Shrimp and Lobster Roll + Plain Fries",
            price: 14,
            description:
              "Truffle honey mayo, cheddar cheese, pickled onions, chives",
          },
          {
            name: "Scallops in Shell",
            price: 12,
            description: "Garlic butter, yuzu, carrot puree, pickled radish",
          },
        ],
      },
      {
        section: "Oysters",
        items: [
          {
            name: "Oyster (1 pc)",
            price: 5,
            description:
              "Soy truffle sriracha, onion vinegar tabasco, fresh lemon, red tabasco",
          },
          {
            name: "Oysters (5 pcs)",
            price: 20,
            description:
              "Soy truffle sriracha, onion vinegar tabasco, fresh lemon, red tabasco",
          },
        ],
      },
      {
        section: "Sides",
        items: [
          { name: "Plain Fries", price: 4 },
          {
            name: "Loaded Fries",
            price: 5,
            description: "Truffle honey mayo, parmesan cheese, chives",
          },
        ],
      },
    ],
  }),
];

export type VendorId = (typeof MENU_VENDORS)[number]["id"];
