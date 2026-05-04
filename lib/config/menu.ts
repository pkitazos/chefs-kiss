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

const PLACEHOLDER_PRICE = 10;

function defineVendor<const Id extends string>(
  v: { id: Id } & Omit<Vendor, "id">,
) {
  return v;
}

export const MENU_VENDORS = [
  defineVendor({
    id: "to-glykatzidiko",
    name: "To Glykatzidiko",
    cuisine: "Desserts & Ice Cream",
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
    cuisine: "Frozen Yoghurt & Desserts",
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
  }),
  defineVendor({
    id: "mays-diner",
    name: "May's Diner",
    cuisine: "Burgers & BBQ",
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
            price: PLACEHOLDER_PRICE,
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
    cuisine: "Asian Fusion & Burgers",
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
  }),
  defineVendor({
    id: "my-cookie-dough",
    name: "My Cookie Dough",
    cuisine: "Desserts",
    accent: "pink",
    icon: "coffee",
    menu: [],
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
    cuisine: "Burgers",
    accent: "amber",
    icon: "grill",
    menu: [],
  }),
  defineVendor({
    id: "tarantula-fried-chicken",
    name: "Tarantula Fried Chicken",
    cuisine: "Fried Chicken",
    accent: "orange",
    icon: "meat",
    menu: [],
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
    id: "roomates-streetfood",
    name: "Roomates Streetfood",
    cuisine: "Street Food",
    accent: "sky",
    icon: "pepper",
    menu: [],
  }),
  defineVendor({
    id: "chef-avraam",
    name: "Chef Avraam",
    cuisine: "Gourmet",
    accent: "green",
    icon: "salad",
    menu: [],
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
    icon: "salad",
    menu: [],
  }),
  defineVendor({
    id: "regrub",
    name: "Regrub",
    cuisine: "Burgers",
    accent: "amber",
    icon: "grill",
    menu: [],
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
    name: "Achnagal - Taste of Tradition",
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
  defineVendor({
    id: "chefs-kiss-sliders",
    name: "Chef's Kiss Sliders",
    cuisine: "Sliders",
    accent: "amber",
    icon: "grill",
    menu: [],
  }),
  defineVendor({
    id: "hb-hotdogs",
    name: "HB Hotdogs",
    cuisine: "Hot Dogs",
    accent: "orange",
    icon: "meat",
    menu: [],
  }),
  defineVendor({
    id: "megastronomy",
    name: "ME Gastronomy",
    cuisine: "Street Food",
    accent: "sky",
    icon: "grill",
    menu: [],
  }),
];

export type VendorId = (typeof MENU_VENDORS)[number]["id"];
