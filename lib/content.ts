/**
 * Single source of truth for every string and link on the site.
 *
 * Provenance:
 *   copy      -> docs/LOBSTER LAB Assets/Lobster Lab website structure.docx (client, authoritative)
 *   locations -> the same docx (it carries hours, which data/locations.json lacks)
 *   links     -> data/external_services.json (captured 2026-07-28)
 *   reviews   -> the docx, verbatim with attribution
 *
 * Where the docx and the SpotHopper archive disagree, the docx wins — it
 * describes the NEW site; the archive is the July 2026 capture of the old one.
 */

export const site = {
  name: "Lobster Lab",
  operator: "Tiger Hospitality Group",
  url: "https://lobsterlab.us",
  tagline: "Seafood. Lobster Rolls. Fresh Ingredients. Everyday. Catch the Vibe.",
  description:
    "Bold coastal flavors in San Diego — buttery lobster rolls, seafood favorites, bisques, salads and melts. Catch the vibe at Lobster Lab.",
  email: "info@lobsterlab.us",
  instagram: "https://www.instagram.com/lobsterlab.us",
} as const;

export const nav = [
  { label: "About us", href: "#about" },
  { label: "Our Menu", href: "#menu" },
  { label: "Locations", href: "#locations" },
  { label: "Catering", href: "#catering" },
  { label: "Contact", href: "#contact" },
] as const;

/* -------------------------------------------------------------------------- */
/* Ordering                                                                    */
/* -------------------------------------------------------------------------- */

export const ordering = {
  // Toast — live, survives the SpotHopper migration (lost_on_migration: false)
  pickup: {
    provider: "Toast",
    logo: "/order/toast.webp",
    url: "https://www.toasttab.com/local/order/lobster-lab-windmill-food-hall-890-palomar-airport-road/r-e7ff1c2b-5c9c-47de-9b94-d10ae264a959",
  },
  // The client docx lists DoorDash + Grubhub but leaves the URLs as "Link".
  // Set these two env vars (or edit here) once the client supplies the storefronts.
  // Until then the delivery tile renders a disabled state rather than a dead link.
  delivery: [
    {
      provider: "DoorDash",
      logo: "/order/doordash.webp",
      url: process.env.NEXT_PUBLIC_DOORDASH_URL ?? "",
    },
    {
      provider: "Grubhub",
      logo: "/order/grubhub.webp",
      url: process.env.NEXT_PUBLIC_GRUBHUB_URL ?? "",
    },
  ],
  // EZCater — live, survives the migration (lost_on_migration: false)
  catering: {
    provider: "ezCater",
    url: "https://www.ezcater.com/catering/pvt/lobster-lab-3?fcv=1",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Sections                                                                    */
/* -------------------------------------------------------------------------- */

export const intro = {
  headline: ["Great food,", "good vibes,"],
  headlineAccent: "and unforgettable bites",
  body: [
    "At Lobster Lab, we bring bold coastal flavors to San Diego with a fresh and modern twist. From buttery lobster rolls and seafood favorites to comforting soups, salads, melts, and more, every dish is crafted with quality ingredients, attention to detail, and flavors worth craving.",
    "Whether you're stopping by after the beach or gathering with friends and family, Lobster Lab is all about great food, good vibes, and unforgettable bites.",
  ],
} as const;

export const values = [
  { icon: "citrus", label: "Freshness First" },
  { icon: "season", label: "Flavor in Every Detail" },
  { icon: "seal", label: "Consistency & Quality" },
] as const;

export const menu = {
  body: "Discover a menu full of coastal comfort and bold flavor. From our signature lobster, crab, and shrimp rolls to seafood sandwiches, creamy bisques, fresh salads, melts, and more. Every item is crafted to satisfy cravings and elevate classic favorites.",
  // Two PDFs, split by location group — see CLAUDE.md
  pdfs: [
    {
      label: "Miramar | Windmill | Global Fork",
      href: "/menus/lobster-lab-menu-food-halls.pdf",
    },
    {
      label: "Sky Deck at Del Mar Highlands Town Center",
      href: "/menus/lobster-lab-menu-sky-deck.pdf",
    },
  ],
  photos: [
    { src: "/photos/menu-lobster-roll.webp", alt: "Lobster roll with drawn butter and lemon" },
    { src: "/photos/menu-bisque.webp", alt: "Lobster bisque topped with lobster claw meat and chives" },
    { src: "/photos/menu-shrimp-roll.webp", alt: "Shrimp roll finished with microgreens" },
    { src: "/photos/menu-grilled-cheese.webp", alt: "Grilled cheese cut in half on a steel tray" },
  ],
} as const;

export const catering = {
  body: "Bring the flavors of Lobster Lab to your next gathering. Whether it's a corporate lunch, celebration, family event, or beachside get-together, our catering menu offers fresh seafood favorites and crowd-pleasing bites made to share.",
} as const;

/* -------------------------------------------------------------------------- */
/* Locations — grouped as the client docx groups them                          */
/* Hours come from the docx; addresses cross-checked against data/locations.json */
/* -------------------------------------------------------------------------- */

export type Location = {
  area: string;
  name: string;
  address: string;
  hours: string;
  mapsQuery: string;
};

export const locations: Location[] = [
  {
    area: "Carlsbad",
    name: "Windmill Food Hall",
    address: "890 Palomar Airport Rd, Carlsbad, CA 92011",
    hours: "11:00 AM – 9:00 PM",
    mapsQuery: "Lobster Lab, 890 Palomar Airport Rd, Carlsbad, CA 92011",
  },
  {
    area: "Del Mar",
    name: "Sky Deck at Del Mar Highlands Town Center",
    address: "12841 El Camino Real Ste 206, San Diego, CA 92130",
    hours: "11:00 AM – 10:00 PM",
    mapsQuery: "Lobster Lab, Sky Deck, 12841 El Camino Real, San Diego, CA 92130",
  },
  {
    area: "San Clemente",
    name: "Miramar Food Hall",
    address: "1720 North El Camino Real, San Clemente, CA 92672",
    hours: "11:00 AM – 9:00 PM",
    mapsQuery: "Lobster Lab, 1720 N El Camino Real, San Clemente, CA 92672",
  },
  {
    area: "Little Italy",
    name: "Global Fork Food Hall",
    address: "550 W Date St Suite B, San Diego, CA 92101",
    hours: "11:00 AM – 9:00 PM",
    mapsQuery: "Lobster Lab, 550 W Date St, San Diego, CA 92101",
  },
  {
    area: "UCSD Campus",
    name: "Station 8 Public Market",
    address: "9165 Theatre District Drive, La Jolla, CA 92037",
    hours: "11:00 AM – 9:00 PM",
    mapsQuery: "Lobster Lab, 9165 Theatre District Dr, La Jolla, CA 92037",
  },
];

/* -------------------------------------------------------------------------- */
/* Reviews — verbatim from the client docx                                     */
/* -------------------------------------------------------------------------- */

export type Review = { quote: string; author: string; source: "Google" | "Yelp" };

export const reviews: Review[] = [
  {
    quote:
      "The warm lobster roll with garlic butter is the best I've had on the west coast. Being from the northeast, I've had plenty a Maine lobster roll and this roll was generously filled with fresh, large chunks of lobster & claw meat and NOT overcooked or rubbery. The bread was also really high quality, dense, just sweet enough, and perfectly toasted.",
    author: "Joe Neyes",
    source: "Google",
  },
  {
    quote:
      "I've gotten lobster rolls up and down the West coast. Vancouver BC to Seattle to LA to San Diego. The lobster roll at Carlsbad Lobster Lab is The Best I've ever had. The Best! The lobster is sweet, not salty. The roll is wonderfully warm and soft and buttery. Perfection!",
    author: "Tom",
    source: "Google",
  },
  {
    quote:
      "The Lobster Roll and Cali Roll were so gorgeous and exceeded our expectations! So remarkable and impressive! The lobster meat was super succulent and fresh! Perfection in EVERY BITE!! I loved the clam chowder and the lobster bisque!! Great for dunking!! Amazing flavor!!",
    author: "Michele Leocadio",
    source: "Google",
  },
  {
    quote:
      "Food and Service was amazing. The best Lobster roll since I lived in New England. Can't wait for San Clemente location opens!! Crab roll was also exceptional!",
    author: "Trayce T.",
    source: "Yelp",
  },
  {
    quote:
      "We got the Connecticut Style XL Lobster Roll, The Cali Crab Roll, The Classic Tuna Melt, and the Lobster Bisque. It was all fantastic. Juicy tender lobster on the upmost perfect buttery toasted roll seasoned but not over seasoned. I have never seen a crab roll with big pieces of king crab. Absolutely delicious.",
    author: "Rex S.",
    source: "Yelp",
  },
  {
    quote:
      "Lobster lab is amazing! We had the Connecticut lobster roll and the lobster grilled cheese with the lobster bisque, both were plentiful and delicious.",
    author: "Summer",
    source: "Yelp",
  },
];

/* -------------------------------------------------------------------------- */
/* Catering inquiry form — field spec straight from the client docx            */
/* -------------------------------------------------------------------------- */

export const occasions = [
  "Corporate Lunch",
  "Celebration",
  "Family Event",
  "Wedding",
  "Beachside Get-Together",
  "Other",
] as const;

export const serviceTypes = ["Pickup", "Delivery"] as const;
