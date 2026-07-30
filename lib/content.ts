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

/**
 * The canonical production host. Staging deploys (lobster.k13projects.com,
 * Vercel preview URLs) set NEXT_PUBLIC_SITE_URL to their own origin, which
 * flips `isProduction` false and makes robots.ts noindex them — otherwise a
 * staging copy competes with the real site for the same search results.
 */
export const PRODUCTION_URL = "https://lobsterlab.us";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL;
export const isProduction = SITE_URL === PRODUCTION_URL;

export const site = {
  name: "Lobster Lab",
  operator: "Tiger Hospitality Group",
  operatorUrl: "https://tigerhospitalitygroup.com",
  url: SITE_URL,
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

/**
 * ===========================================================================
 * ORDERING — the one place to wire every storefront (plan P1)
 * ===========================================================================
 * Each location owns its own links. To connect a location, paste its URL into
 * the matching `ordering` block in `locations` below. Nothing else needs to
 * change: the ORDER ONLINE modal reads this and renders whatever exists.
 *
 * An empty string is not a bug — it renders an honest "coming soon" state
 * instead of a dead link. That is deliberate, so a half-wired site never
 * sends a customer to a broken storefront.
 *
 * Provenance: Carlsbad Toast URL is from data/external_services.json
 * (captured 2026-07-28, lost_on_migration: false — it survives SpotHopper).
 * The rest are pending from the client; see tasks/todo.md P1.
 */

export const orderChannels = {
  toast: { label: "Pickup", provider: "Toast", logo: "/order/toast.webp" },
  doordash: { label: "Delivery", provider: "DoorDash", logo: "/order/doordash.webp" },
  grubhub: { label: "Delivery", provider: "Grubhub", logo: "/order/grubhub.webp" },
} as const;

export type OrderChannel = keyof typeof orderChannels;
export type OrderLinks = Partial<Record<OrderChannel, string>>;

export const ordering = {
  // ezCater — live, survives the migration (lost_on_migration: false)
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
  /** Storefronts for THIS location. Empty string = not connected yet. */
  ordering: OrderLinks;
};

export const locations: Location[] = [
  {
    area: "Carlsbad",
    name: "Windmill Food Hall",
    address: "890 Palomar Airport Rd, Carlsbad, CA 92011",
    hours: "11:00 AM – 9:00 PM",
    mapsQuery: "Lobster Lab, 890 Palomar Airport Rd, Carlsbad, CA 92011",
    ordering: {
      toast:
        "https://www.toasttab.com/local/order/lobster-lab-windmill-food-hall-890-palomar-airport-road/r-e7ff1c2b-5c9c-47de-9b94-d10ae264a959",
      doordash: "", // TODO(client, P1): DoorDash storefront URL
      grubhub: "", // TODO(client, P1): Grubhub storefront URL
    },
  },
  {
    area: "Del Mar",
    name: "Sky Deck at Del Mar Highlands Town Center",
    address: "12841 El Camino Real Ste 206, San Diego, CA 92130",
    hours: "11:00 AM – 10:00 PM",
    mapsQuery: "Lobster Lab, Sky Deck, 12841 El Camino Real, San Diego, CA 92130",
    ordering: {
      toast: "", // TODO(client, P1): Toast storefront URL
      doordash: "", // TODO(client, P1)
      grubhub: "", // TODO(client, P1)
    },
  },
  {
    area: "San Clemente",
    name: "Miramar Food Hall",
    address: "1720 North El Camino Real, San Clemente, CA 92672",
    hours: "11:00 AM – 9:00 PM",
    mapsQuery: "Lobster Lab, 1720 N El Camino Real, San Clemente, CA 92672",
    ordering: {
      toast: "", // TODO(client, P1)
      doordash: "", // TODO(client, P1)
      grubhub: "", // TODO(client, P1)
    },
  },
  {
    area: "Little Italy",
    name: "Global Fork Food Hall",
    address: "550 W Date St Suite B, San Diego, CA 92101",
    hours: "11:00 AM – 9:00 PM",
    mapsQuery: "Lobster Lab, 550 W Date St, San Diego, CA 92101",
    ordering: {
      toast: "", // TODO(client, P1)
      doordash: "", // TODO(client, P1)
      grubhub: "", // TODO(client, P1)
    },
  },
  {
    area: "UCSD Campus",
    name: "Station 8 Public Market",
    address: "9165 Theatre District Drive, La Jolla, CA 92037",
    hours: "11:00 AM – 9:00 PM",
    mapsQuery: "Lobster Lab, 9165 Theatre District Dr, La Jolla, CA 92037",
    ordering: {
      toast: "", // TODO(client, P1)
      doordash: "", // TODO(client, P1)
      grubhub: "", // TODO(client, P1)
    },
  },
];

/** True once any location has at least one live storefront. */
export const hasAnyOrdering = locations.some((l) =>
  Object.values(l.ordering).some((url) => Boolean(url)),
);

/* -------------------------------------------------------------------------- */
/* Reviews — verbatim quotes from the client docx                              */
/*                                                                             */
/* ATTRIBUTION IS DELIBERATELY NON-IDENTIFYING. The client's brief supplied     */
/* these with full reviewer names. Publishing a named individual's words as     */
/* advertising without their consent creates exposure under California Civil    */
/* Code s.3344 (statutory floor $750 per violation) on top of the Yelp/Google   */
/* platform terms. `author` therefore carries a city/label, not a person.       */
/*                                                                             */
/* The real names are preserved in the client docx and in git history if        */
/* consent is later obtained. Proper fix (plan P3): switch to the official      */
/* Yelp/Google embed widgets, which are licensed for exactly this, or get       */
/* written consent from each reviewer. Do not re-add names before then.         */
/* -------------------------------------------------------------------------- */

export type Review = { quote: string; author: string; source: "Google" | "Yelp" };

export const reviews: Review[] = [
  {
    quote:
      "The warm lobster roll with garlic butter is the best I've had on the west coast. Being from the northeast, I've had plenty a Maine lobster roll and this roll was generously filled with fresh, large chunks of lobster & claw meat and NOT overcooked or rubbery. The bread was also really high quality, dense, just sweet enough, and perfectly toasted.",
    author: "Google reviewer, Carlsbad",
    source: "Google",
  },
  {
    quote:
      "I've gotten lobster rolls up and down the West coast. Vancouver BC to Seattle to LA to San Diego. The lobster roll at Carlsbad Lobster Lab is The Best I've ever had. The Best! The lobster is sweet, not salty. The roll is wonderfully warm and soft and buttery. Perfection!",
    author: "Google reviewer, Carlsbad",
    source: "Google",
  },
  {
    quote:
      "The Lobster Roll and Cali Roll were so gorgeous and exceeded our expectations! So remarkable and impressive! The lobster meat was super succulent and fresh! Perfection in EVERY BITE!! I loved the clam chowder and the lobster bisque!! Great for dunking!! Amazing flavor!!",
    author: "Google reviewer, San Diego",
    source: "Google",
  },
  {
    quote:
      "Food and Service was amazing. The best Lobster roll since I lived in New England. Can't wait for San Clemente location opens!! Crab roll was also exceptional!",
    author: "Yelp reviewer, San Diego",
    source: "Yelp",
  },
  {
    quote:
      "We got the Connecticut Style XL Lobster Roll, The Cali Crab Roll, The Classic Tuna Melt, and the Lobster Bisque. It was all fantastic. Juicy tender lobster on the upmost perfect buttery toasted roll seasoned but not over seasoned. I have never seen a crab roll with big pieces of king crab. Absolutely delicious.",
    author: "Yelp reviewer, San Diego",
    source: "Yelp",
  },
  {
    quote:
      "Lobster lab is amazing! We had the Connecticut lobster roll and the lobster grilled cheese with the lobster bisque, both were plentiful and delicious.",
    author: "Yelp reviewer, Carlsbad",
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
