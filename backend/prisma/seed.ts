import { auth } from "../src/lib/auth.js";
import { prisma } from "../src/lib/prisma.js";

const shiftMonth = (baseDate: Date, monthsBack: number) =>
  new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() - monthsBack,
    8 + monthsBack,
  );

const categories = [
  {
    name: "Literary Fiction",
    slug: "literary-fiction",
    description:
      "Character-rich fiction with elegant prose, emotional depth, and strong atmosphere.",
    heroImage:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Business & Strategy",
    slug: "business-strategy",
    description:
      "Practical books on leadership, product thinking, and durable modern operations.",
    heroImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Design & Creativity",
    slug: "design-creativity",
    description:
      "Books for designers, makers, and creative teams building thoughtful products.",
    heroImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Technology",
    slug: "technology",
    description:
      "Clear, modern writing for readers working with software, systems, and emerging tools.",
    heroImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Self-Development",
    slug: "self-development",
    description:
      "Grounded guidance on habits, focus, energy, and sustainable personal growth.",
    heroImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Travel & Culture",
    slug: "travel-culture",
    description:
      "Stories and essays rooted in place, memory, language, and movement.",
    heroImage:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
  },
];

const books = [
  {
    slug: "the-quiet-map-of-lisbon",
    title: "The Quiet Map of Lisbon",
    author: "Mara Esteves",
    publisher: "Harbor Lantern Press",
    synopsis:
      "A former urban historian returns to Lisbon to settle her father's estate and discovers a set of annotated city maps that reveal the hidden grief, friendships, and vanished neighborhoods that shaped her family. The novel moves through tram lines, river light, and old bookshops while asking what we inherit when memory itself becomes fragile.",
    shortDescription:
      "A luminous literary novel about memory, inheritance, and the emotional geography of a city.",
    price: 24,
    compareAtPrice: 29,
    inventory: 18,
    pages: 352,
    format: "Hardcover",
    language: "English",
    isbn: "9781734001101",
    coverImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80",
    ],
    publishedAt: "2025-01-15T00:00:00.000Z",
    releaseLabel: "New arrival",
    location: "Lisbon, Portugal",
    featured: true,
    spotlight: true,
    aiSummary:
      "Ideal for readers who love atmospheric fiction, city stories, and multigenerational emotional arcs.",
    aiTags: ["atmospheric", "multigenerational", "city novel", "book club"],
    categorySlugs: ["literary-fiction", "travel-culture"],
    rating: 4.8,
  },
  {
    slug: "product-thinking-for-small-teams",
    title: "Product Thinking for Small Teams",
    author: "Jonah Mercer",
    publisher: "Northline Books",
    synopsis:
      "Built for founders, designers, and product managers, this book offers a practical framework for discovering user needs, shipping smaller bets, and making roadmap decisions with confidence. Each chapter ends with workshop-ready exercises that small teams can use immediately.",
    shortDescription:
      "A tactical guide to discovery, prioritization, and shipping healthier product decisions.",
    price: 32,
    compareAtPrice: 38,
    inventory: 25,
    pages: 288,
    format: "Paperback",
    language: "English",
    isbn: "9781734001102",
    coverImage:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=900&q=80",
    ],
    publishedAt: "2024-09-05T00:00:00.000Z",
    releaseLabel: "Bestseller",
    location: "Remote-first teams",
    featured: true,
    spotlight: true,
    aiSummary:
      "Strong fit for startup operators who need structure without heavyweight process.",
    aiTags: ["product", "strategy", "startups", "workshop"],
    categorySlugs: ["business-strategy", "technology"],
    rating: 4.7,
  },
  {
    slug: "systems-for-deep-work",
    title: "Systems for Deep Work",
    author: "Elena Rhodes",
    publisher: "Signal House",
    synopsis:
      "Instead of promising impossible routines, Elena Rhodes teaches readers how to build protective systems around their energy, attention, and calendar. The book blends behavioral science, workplace realities, and concrete weekly rituals to make focus sustainable.",
    shortDescription:
      "A realistic playbook for protecting attention and building repeatable focus habits.",
    price: 21,
    compareAtPrice: 27,
    inventory: 12,
    pages: 240,
    format: "Paperback",
    language: "English",
    isbn: "9781734001103",
    coverImage:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80",
    ],
    publishedAt: "2024-06-12T00:00:00.000Z",
    releaseLabel: "Editor pick",
    location: "Global",
    featured: true,
    spotlight: false,
    aiSummary:
      "Great for professionals balancing creative work, meetings, and asynchronous collaboration.",
    aiTags: ["focus", "habits", "productivity", "self-management"],
    categorySlugs: ["self-development", "business-strategy"],
    rating: 4.6,
  },
  {
    slug: "the-studio-brief",
    title: "The Studio Brief",
    author: "Nadia Park",
    publisher: "Current Practice",
    synopsis:
      "Part field guide and part visual diary, this book explores how high-performing design teams critique work, handle ambiguity, and create language around quality. It is full of examples from brand systems, digital products, and editorial environments.",
    shortDescription:
      "A design leadership handbook about critique, clarity, and creative team culture.",
    price: 34,
    compareAtPrice: 40,
    inventory: 14,
    pages: 304,
    format: "Hardcover",
    language: "English",
    isbn: "9781734001104",
    coverImage:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    ],
    publishedAt: "2024-11-20T00:00:00.000Z",
    releaseLabel: "Popular with designers",
    location: "New York, USA",
    featured: true,
    spotlight: false,
    aiSummary:
      "A sharp resource for design leads, art directors, and product designers scaling team rituals.",
    aiTags: ["design", "leadership", "critique", "creative ops"],
    categorySlugs: ["design-creativity", "business-strategy"],
    rating: 4.9,
  },
  {
    slug: "paper-lantern-economics",
    title: "Paper Lantern Economics",
    author: "Haruto Nishimura",
    publisher: "River Terrace",
    synopsis:
      "Through portraits of neighborhood merchants, artisans, and family-run workshops, Haruto Nishimura tells a larger story about trust, resilience, and the human texture of local economies. It is an elegant hybrid of reportage and cultural history.",
    shortDescription:
      "A warm, deeply reported look at small businesses, community trust, and everyday resilience.",
    price: 26,
    compareAtPrice: 31,
    inventory: 10,
    pages: 320,
    format: "Hardcover",
    language: "English",
    isbn: "9781734001105",
    coverImage:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1516972810927-80185027ca84?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    ],
    publishedAt: "2023-08-17T00:00:00.000Z",
    releaseLabel: "Critics' favorite",
    location: "Kyoto, Japan",
    featured: false,
    spotlight: false,
    aiSummary:
      "Recommended for readers who enjoy narrative nonfiction with strong social observation.",
    aiTags: ["nonfiction", "culture", "economics", "community"],
    categorySlugs: ["business-strategy", "travel-culture"],
    rating: 4.5,
  },
  {
    slug: "the-cartographers-garden",
    title: "The Cartographer's Garden",
    author: "Imani Vale",
    publisher: "Cinder House",
    synopsis:
      "A botanist and a mapmaker inherit the same crumbling estate and disagree on what should be preserved. Their uneasy partnership turns into a meditation on archives, ecological repair, and what it means to belong to a place.",
    shortDescription:
      "A graceful novel about ecology, inheritance, and the slow work of repair.",
    price: 23,
    compareAtPrice: 28,
    inventory: 16,
    pages: 336,
    format: "Paperback",
    language: "English",
    isbn: "9781734001106",
    coverImage:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80",
    ],
    publishedAt: "2025-03-10T00:00:00.000Z",
    releaseLabel: "Staff favorite",
    location: "Cornwall, UK",
    featured: true,
    spotlight: true,
    aiSummary:
      "Perfect for readers who want immersive fiction with nature writing and emotional precision.",
    aiTags: ["nature", "literary fiction", "slow burn", "atmospheric"],
    categorySlugs: ["literary-fiction", "travel-culture"],
    rating: 4.8,
  },
  {
    slug: "small-batch-leadership",
    title: "Small-Batch Leadership",
    author: "Rafael Ortiz",
    publisher: "Northline Books",
    synopsis:
      "Rafael Ortiz argues that healthy leadership looks more like craft than charisma. Through stories from distributed teams, independent businesses, and nonprofits, he shows how to design feedback, accountability, and decision-making at a human scale.",
    shortDescription:
      "A grounded leadership book for teams that want clarity without bureaucracy.",
    price: 29,
    compareAtPrice: 35,
    inventory: 30,
    pages: 272,
    format: "Paperback",
    language: "English",
    isbn: "9781734001107",
    coverImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    ],
    publishedAt: "2024-02-06T00:00:00.000Z",
    releaseLabel: "Team lead essential",
    location: "Austin, USA",
    featured: false,
    spotlight: false,
    aiSummary:
      "Best for managers who want practical rituals for communication, delegation, and trust.",
    aiTags: ["leadership", "management", "teams", "communication"],
    categorySlugs: ["business-strategy", "self-development"],
    rating: 4.4,
  },
  {
    slug: "signal-and-craft",
    title: "Signal and Craft",
    author: "Priya Nandan",
    publisher: "Signal House",
    synopsis:
      "This practical technology book teaches engineers how to make technical work legible to the rest of the business. It covers architectural storytelling, tradeoff writing, incident communication, and how to build trust through documentation.",
    shortDescription:
      "A practical communication guide for engineers working across product, design, and leadership.",
    price: 31,
    compareAtPrice: 37,
    inventory: 20,
    pages: 296,
    format: "Hardcover",
    language: "English",
    isbn: "9781734001108",
    coverImage:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    ],
    publishedAt: "2025-02-04T00:00:00.000Z",
    releaseLabel: "Fresh release",
    location: "Bengaluru, India",
    featured: true,
    spotlight: false,
    aiSummary:
      "Helpful for senior engineers, tech leads, and architects who influence beyond code.",
    aiTags: ["engineering", "communication", "architecture", "documentation"],
    categorySlugs: ["technology", "business-strategy"],
    rating: 4.7,
  },
  {
    slug: "between-stations",
    title: "Between Stations",
    author: "Lena D'Souza",
    publisher: "Harbor Lantern Press",
    synopsis:
      "Set across long-distance train routes in South Asia, this novel follows three travelers whose lives intersect through chance conversations, borrowed books, and unmailed letters. It is intimate, mobile, and rich with place.",
    shortDescription:
      "A moving travel novel about chance encounters, migration, and the stories we carry forward.",
    price: 22,
    compareAtPrice: 27,
    inventory: 22,
    pages: 310,
    format: "Paperback",
    language: "English",
    isbn: "9781734001109",
    coverImage:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1516972810927-80185027ca84?auto=format&fit=crop&w=900&q=80",
    ],
    publishedAt: "2023-11-14T00:00:00.000Z",
    releaseLabel: "Reader favorite",
    location: "South Asia",
    featured: false,
    spotlight: false,
    aiSummary:
      "A strong pick for readers who love movement, tenderness, and cross-cultural storytelling.",
    aiTags: ["travel", "literary fiction", "migration", "character-driven"],
    categorySlugs: ["literary-fiction", "travel-culture"],
    rating: 4.6,
  },
  {
    slug: "the-makers-weekly",
    title: "The Maker's Weekly",
    author: "Clara Hsu",
    publisher: "Current Practice",
    synopsis:
      "Clara Hsu distills years of creative operations experience into a refreshingly practical system for weekly planning, studio cadence, and recovering from stalled work. It is especially useful for independent creators and small teams.",
    shortDescription:
      "A weekly operating system for creative people who want momentum without burnout.",
    price: 19,
    compareAtPrice: 24,
    inventory: 28,
    pages: 216,
    format: "Paperback",
    language: "English",
    isbn: "9781734001110",
    coverImage:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80",
    ],
    publishedAt: "2024-04-01T00:00:00.000Z",
    releaseLabel: "Creative favorite",
    location: "Taipei, Taiwan",
    featured: false,
    spotlight: false,
    aiSummary:
      "Useful for freelancers, art directors, and creators balancing shipping with reflection.",
    aiTags: ["creativity", "planning", "habits", "independent work"],
    categorySlugs: ["design-creativity", "self-development"],
    rating: 4.3,
  },
  {
    slug: "interfaces-of-trust",
    title: "Interfaces of Trust",
    author: "Amina Solberg",
    publisher: "Signal House",
    synopsis:
      "Amina Solberg explores how checkout flows, onboarding journeys, and customer support touchpoints shape trust in digital products. Instead of abstract principles, the book focuses on concrete product decisions and the psychology behind them.",
    shortDescription:
      "A sharp product design book on trust, clarity, and customer-facing digital experiences.",
    price: 33,
    compareAtPrice: 39,
    inventory: 9,
    pages: 300,
    format: "Hardcover",
    language: "English",
    isbn: "9781734001111",
    coverImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    ],
    publishedAt: "2025-04-22T00:00:00.000Z",
    releaseLabel: "Trending now",
    location: "Copenhagen, Denmark",
    featured: true,
    spotlight: true,
    aiSummary:
      "Especially relevant for ecommerce, fintech, and SaaS teams refining user trust signals.",
    aiTags: ["ux", "trust", "product design", "customer journey"],
    categorySlugs: ["design-creativity", "technology"],
    rating: 4.9,
  },
  {
    slug: "letters-from-the-coast-road",
    title: "Letters from the Coast Road",
    author: "Sofia Mendel",
    publisher: "River Terrace",
    synopsis:
      "Written as a sequence of letters, this reflective novel follows a documentary translator driving the Atlantic coast while deciding whether to return home for good. It is intimate, observant, and quietly romantic without losing its emotional rigor.",
    shortDescription:
      "An epistolary road novel filled with atmosphere, restraint, and emotional clarity.",
    price: 25,
    compareAtPrice: 30,
    inventory: 11,
    pages: 284,
    format: "Hardcover",
    language: "English",
    isbn: "9781734001112",
    coverImage:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80",
    ],
    publishedAt: "2024-12-03T00:00:00.000Z",
    releaseLabel: "New in fiction",
    location: "Atlantic coast",
    featured: true,
    spotlight: false,
    aiSummary:
      "A strong recommendation for readers who value voice, place, and emotional restraint.",
    aiTags: ["epistolary", "travel", "literary fiction", "romantic tension"],
    categorySlugs: ["literary-fiction", "travel-culture"],
    rating: 4.7,
  },
];

const blogPosts = [
  {
    slug: "how-we-curate-books-for-modern-teams",
    title: "How We Curate Books for Modern Teams",
    excerpt:
      "A behind-the-scenes look at how BookShore selects books that help product, design, and engineering teams work better together.",
    content:
      "At BookShore, curation is not about stocking everything. We look for books that change how teams think, communicate, and build. Our business and technology shelves are chosen to support actual modern work: distributed collaboration, product discovery, design critique, and sustainable leadership. We pair those practical titles with literary fiction and travel writing because the best readers do not split craft from imagination.",
    category: "Curatorial Notes",
    coverImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    readTime: 5,
    authorName: "BookShore Editorial",
    authorRole: "Store Journal",
    publishedAt: new Date("2026-03-15T00:00:00.000Z"),
    featured: true,
  },
  {
    slug: "building-a-reading-stack-for-product-leaders",
    title: "Building a Reading Stack for Product Leaders",
    excerpt:
      "A practical reading path for product leaders balancing delivery, discovery, and cross-functional trust.",
    content:
      "Product leaders need books that expand judgment, not just frameworks. We recommend combining one strategy title, one communication title, one design-oriented book, and one piece of literary fiction that sharpens observation. That mix creates better product instincts than reading only in one lane.",
    category: "Reading Guides",
    coverImage:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    readTime: 4,
    authorName: "Rima Calder",
    authorRole: "Editorial Lead",
    publishedAt: new Date("2026-02-20T00:00:00.000Z"),
    featured: true,
  },
  {
    slug: "why-physical-books-still-shape-digital-work",
    title: "Why Physical Books Still Shape Digital Work",
    excerpt:
      "Notes on pace, annotation, and why printed books still matter to people building digital products.",
    content:
      "Physical books slow us down just enough to notice structure, tone, and argument. In digital work, where context switches are constant, that kind of sustained attention is not nostalgic. It is strategic. Many of our customers use print as a way to recover depth in an otherwise fragmented week.",
    category: "Work & Reading",
    coverImage:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
    readTime: 3,
    authorName: "BookShore Editorial",
    authorRole: "Store Journal",
    publishedAt: new Date("2026-01-08T00:00:00.000Z"),
    featured: false,
  },
  {
    slug: "a-short-guide-to-gifting-books-thoughtfully",
    title: "A Short Guide to Gifting Books Thoughtfully",
    excerpt:
      "How to choose books that feel personal, useful, and genuinely memorable.",
    content:
      "The best book gifts are specific. Think about the season someone is in, not just their broad interests. Are they leading a team for the first time? Moving cities? Returning to creative work? The right book meets that exact moment and gives it language.",
    category: "Gift Guides",
    coverImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    readTime: 4,
    authorName: "Mila Byrne",
    authorRole: "Community Editor",
    publishedAt: new Date("2025-12-11T00:00:00.000Z"),
    featured: false,
  },
];

const reviews = [
  {
    slug: "the-quiet-map-of-lisbon",
    userName: "Talia Morgan",
    userTitle: "Book club host",
    rating: 5,
    title: "A city novel with emotional precision",
    body: "The setting is beautiful, but what stayed with me was the tenderness in how memory and grief were handled. It became our easiest book-club recommendation this year.",
  },
  {
    slug: "product-thinking-for-small-teams",
    userName: "Nafis Ahmed",
    userTitle: "Product manager",
    rating: 5,
    title: "Useful the very next day",
    body: "It translates discovery and prioritization into habits that are realistic for small teams. I flagged half the book for future workshops.",
  },
  {
    slug: "interfaces-of-trust",
    userName: "Olivia Reed",
    userTitle: "Senior product designer",
    rating: 5,
    title: "Sharp, current, and easy to apply",
    body: "This is one of the few product design books that connects interface decisions to customer trust in a way that feels concrete rather than abstract.",
  },
  {
    slug: "systems-for-deep-work",
    userName: "Marcus Lee",
    userTitle: "Engineering lead",
    rating: 4,
    title: "Practical without pretending life is simple",
    body: "I appreciated how honest it was about meetings, context switching, and responsibilities outside work. The systems are realistic.",
  },
  {
    slug: "the-cartographers-garden",
    userName: "Sara Hossain",
    userTitle: "Lifelong fiction reader",
    rating: 5,
    title: "Quietly unforgettable",
    body: "It has patience, atmosphere, and an emotional payoff that feels fully earned. I finished it wanting to reread the opening chapters immediately.",
  },
];

const createDemoUser = async (input: {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN" | "MANAGER";
  image: string;
}) => {
  const response = await (auth.api.signUpEmail as any)({
    body: {
      name: input.name,
      email: input.email,
      password: input.password,
      image: input.image,
    },
  });

  await prisma.user.update({
    where: { email: input.email },
    data: {
      role: input.role,
    },
  });

  return response.user;
};

const main = async () => {
  await prisma.aIMessage.deleteMany();
  await prisma.aIConversation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.userPreference.deleteMany();
  await prisma.bookCategory.deleteMany();
  await prisma.book.deleteMany();
  await prisma.category.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  for (const category of categories) {
    await prisma.category.create({ data: category });
  }

  const categoryMap = Object.fromEntries(
    (await prisma.category.findMany()).map((category) => [
      category.slug,
      category.id,
    ]),
  );

  for (const book of books) {
    const createdBook = await prisma.book.create({
      data: {
        slug: book.slug,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        synopsis: book.synopsis,
        shortDescription: book.shortDescription,
        price: book.price,
        compareAtPrice: book.compareAtPrice,
        rating: book.rating,
        reviewCount: 0,
        inventory: book.inventory,
        pages: book.pages,
        format: book.format,
        language: book.language,
        isbn: book.isbn,
        coverImage: book.coverImage,
        gallery: book.gallery,
        publishedAt: new Date(book.publishedAt),
        releaseLabel: book.releaseLabel,
        location: book.location,
        featured: book.featured,
        spotlight: book.spotlight,
        aiSummary: book.aiSummary,
        aiTags: book.aiTags,
      },
    });

    await prisma.bookCategory.createMany({
      data: book.categorySlugs.map((slug) => ({
        bookId: createdBook.id,
        categoryId: categoryMap[slug],
      })),
    });
  }

  await prisma.blogPost.createMany({
    data: blogPosts,
  });

  const adminUser = await createDemoUser({
    name: "Ava Bennett",
    email: "admin@bookshore.dev",
    password: "Admin123!",
    role: "ADMIN",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  });

  const managerUser = await createDemoUser({
    name: "Daniel Harper",
    email: "manager@bookshore.dev",
    password: "Manager123!",
    role: "MANAGER",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  });

  const customerUser = await createDemoUser({
    name: "Layla Hasan",
    email: "reader@bookshore.dev",
    password: "Reader123!",
    role: "USER",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
  });

  await prisma.userPreference.createMany({
    data: [
      {
        userId: managerUser.id,
        favoriteGenres: ["design-creativity", "technology"],
        favoriteFormats: ["Hardcover"],
        monthlyBudget: 120,
        readingGoal: 18,
      },
      {
        userId: customerUser.id,
        favoriteGenres: ["literary-fiction", "travel-culture"],
        favoriteFormats: ["Paperback", "Hardcover"],
        monthlyBudget: 90,
        readingGoal: 24,
      },
    ],
  });

  const bookMap = Object.fromEntries(
    (await prisma.book.findMany()).map((book) => [book.slug, book]),
  );

  await prisma.review.createMany({
    data: reviews.map((review, index) => ({
      bookId: bookMap[review.slug].id,
      userId: index % 2 === 0 ? customerUser.id : managerUser.id,
      userName: review.userName,
      userTitle: review.userTitle,
      rating: review.rating,
      title: review.title,
      body: review.body,
      verifiedPurchase: true,
    })),
  });

  for (const book of books) {
    const currentReviews = await prisma.review.findMany({
      where: {
        bookId: bookMap[book.slug].id,
      },
    });

    if (currentReviews.length > 0) {
      const averageRating =
        currentReviews.reduce((sum, review) => sum + review.rating, 0) /
        currentReviews.length;

      await prisma.book.update({
        where: { id: bookMap[book.slug].id },
        data: {
          rating: Number(averageRating.toFixed(2)),
          reviewCount: currentReviews.length,
        },
      });
    }
  }

  await prisma.cartItem.createMany({
    data: [
      {
        userId: customerUser.id,
        bookId: bookMap["the-cartographers-garden"].id,
        quantity: 1,
      },
      {
        userId: customerUser.id,
        bookId: bookMap["interfaces-of-trust"].id,
        quantity: 1,
      },
    ],
  });

  const orderBlueprints = [
    {
      userId: customerUser.id,
      monthsBack: 0,
      status: "DELIVERED",
      paymentStatus: "PAID",
      books: [
        { slug: "the-quiet-map-of-lisbon", quantity: 1 },
        { slug: "systems-for-deep-work", quantity: 1 },
      ],
    },
    {
      userId: customerUser.id,
      monthsBack: 1,
      status: "DELIVERED",
      paymentStatus: "PAID",
      books: [{ slug: "product-thinking-for-small-teams", quantity: 1 }],
    },
    {
      userId: managerUser.id,
      monthsBack: 1,
      status: "PROCESSING",
      paymentStatus: "PAID",
      books: [{ slug: "signal-and-craft", quantity: 1 }],
    },
    {
      userId: customerUser.id,
      monthsBack: 2,
      status: "DELIVERED",
      paymentStatus: "PAID",
      books: [{ slug: "letters-from-the-coast-road", quantity: 1 }],
    },
    {
      userId: adminUser.id,
      monthsBack: 3,
      status: "DELIVERED",
      paymentStatus: "PAID",
      books: [
        { slug: "small-batch-leadership", quantity: 1 },
        { slug: "the-studio-brief", quantity: 1 },
      ],
    },
    {
      userId: managerUser.id,
      monthsBack: 4,
      status: "DELIVERED",
      paymentStatus: "PAID",
      books: [{ slug: "interfaces-of-trust", quantity: 1 }],
    },
    {
      userId: customerUser.id,
      monthsBack: 5,
      status: "DELIVERED",
      paymentStatus: "PAID",
      books: [{ slug: "between-stations", quantity: 1 }],
    },
  ] as const;

  for (const [index, blueprint] of orderBlueprints.entries()) {
    const items = blueprint.books.map((item) => {
      const book = bookMap[item.slug];
      return {
        bookId: book.id,
        quantity: item.quantity,
        unitPrice: Number(book.price),
        lineTotal: Number(book.price) * item.quantity,
      };
    });

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const shippingFee = subtotal > 100 ? 0 : 9.5;

    await prisma.order.create({
      data: {
        userId: blueprint.userId,
        orderNumber: `BS-2026-${1000 + index}`,
        status: blueprint.status,
        paymentStatus: blueprint.paymentStatus,
        subtotal,
        shippingFee,
        total: subtotal + shippingFee,
        shippingAddress: {
          fullName:
            blueprint.userId === customerUser.id
              ? customerUser.name
              : managerUser.name,
          email:
            blueprint.userId === customerUser.id
              ? customerUser.email
              : managerUser.email,
          phone: "+1-202-555-0110",
          country: "United States",
          city: "Seattle",
          addressLine1: "19 Harbor Street",
          postalCode: "98101",
        },
        createdAt: shiftMonth(new Date(), blueprint.monthsBack),
        updatedAt: shiftMonth(new Date(), blueprint.monthsBack),
        items: {
          create: items,
        },
      },
    });
  }

  await prisma.notification.createMany({
    data: [
      {
        userId: customerUser.id,
        type: "ORDER",
        title: "Your latest order is on the way",
        message:
          "We packed your latest BookShore order and handed it to the carrier this morning.",
      },
      {
        userId: customerUser.id,
        type: "AI",
        title: "Fresh recommendations are ready",
        message:
          "Our recommendation engine found new literary fiction picks based on your recent reading preferences.",
      },
      {
        userId: managerUser.id,
        type: "SYSTEM",
        title: "Inventory review scheduled",
        message:
          "Five low-stock titles now need a replenishment check before the weekend.",
      },
    ],
  });

  console.log("Seed completed.");
  console.log("Admin:", "admin@bookshore.dev / Admin123!");
  console.log("Manager:", "manager@bookshore.dev / Manager123!");
  console.log("Reader:", "reader@bookshore.dev / Reader123!");
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
