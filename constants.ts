import { Book, Order } from './types';

export const CATALOG: Book[] = [
  {
    id: "b1",
    title: "The Whispering Banyan",
    author: "K. Arivazhagan",
    genre: "Historical Fiction",
    category: "Fiction",
    price: 450,
    description: "A gripping tale set in 19th century Madurai, exploring the secrets hidden within an ancient family lineage and a mystical banyan tree.",
    coverUrl: "https://picsum.photos/300/450?random=1",
    pages: 320,
    language: "Tamil",
    isbn: "978-81-93456-01-2",
    stock: 45,
    sold: 120
  },
  {
    id: "b2",
    title: "Echoes of the Cauvery",
    author: "Sarah Thomas",
    genre: "Contemporary Fiction",
    category: "Fiction",
    price: 350,
    description: "A moving story about a young woman returning to her ancestral village along the Cauvery river to find herself amidst fading traditions.",
    coverUrl: "https://picsum.photos/300/450?random=2",
    pages: 280,
    language: "English",
    isbn: "978-0-143-42567-8",
    stock: 12,
    sold: 85
  },
  {
    id: "b3",
    title: "Modern Tamil Poetry: An Anthology",
    author: "Various (Ed. Dr. R. Selvam)",
    genre: "Poetry",
    category: "Poetry",
    price: 200,
    description: "A carefully curated collection of modern Tamil poetry reflecting the angst, joy, and resilience of the contemporary Tamil psyche.",
    coverUrl: "https://picsum.photos/300/450?random=3",
    pages: 150,
    language: "Tamil",
    isbn: "978-81-234-5678-9",
    stock: 3, // Low stock
    sold: 210
  },
  {
    id: "b4",
    title: "Digital Dravidian",
    author: "S. Karthik",
    genre: "Technology / Sociology",
    category: "Non-Fiction",
    price: 550,
    description: "An analysis of how the digital revolution has transformed the cultural landscape of South India.",
    coverUrl: "https://picsum.photos/300/450?random=4",
    pages: 410,
    language: "English",
    isbn: "978-1-567-89012-3",
    stock: 25,
    sold: 45
  },
  {
    id: "b5",
    title: "Flavors of Kongu",
    author: "Meenakshi Ammal",
    genre: "Cookbook",
    category: "Non-Fiction",
    price: 800,
    description: "A visual journey through the culinary heritage of the Kongu region, featuring 100+ authentic recipes.",
    coverUrl: "https://picsum.photos/300/450?random=5",
    pages: 220,
    language: "English",
    isbn: "978-0-553-21311-9",
    stock: 8,
    sold: 300
  },
  {
    id: "b6",
    title: "Vanathu Nila",
    author: "J. Jayalalitha",
    genre: "Romance",
    category: "Fiction",
    price: 299,
    description: "A heartwarming romance novel about star-crossed lovers separated by distance but united by the moon.",
    coverUrl: "https://picsum.photos/300/450?random=6",
    pages: 240,
    language: "Tamil",
    isbn: "978-81-701-2345-6",
    stock: 50,
    sold: 15
  }
];

export const MOCK_ORDERS: Order[] = [
    {
        id: "ORD-001",
        customerName: "Ramesh Kumar",
        customerEmail: "ramesh@example.com",
        items: [{ book: CATALOG[0], quantity: 1 }, { book: CATALOG[2], quantity: 2 }],
        totalAmount: 850,
        status: "Delivered",
        paymentMethod: "UPI",
        date: "2024-05-10T14:30:00Z"
    },
    {
        id: "ORD-002",
        customerName: "Priya S.",
        customerEmail: "priya@test.com",
        items: [{ book: CATALOG[4], quantity: 1 }],
        totalAmount: 800,
        status: "Shipped",
        paymentMethod: "Credit Card",
        date: "2024-05-12T09:15:00Z"
    },
    {
        id: "ORD-003",
        customerName: "David Raj",
        customerEmail: "david@mail.com",
        items: [{ book: CATALOG[1], quantity: 1 }],
        totalAmount: 350,
        status: "Pending",
        paymentMethod: "Net Banking",
        date: "2024-05-14T11:20:00Z"
    }
];

export const POLICIES = `
SHIPPING POLICY:
- We ship worldwide.
- Domestic shipping (India) takes 3-5 business days. Free for orders above ₹500.
- International shipping takes 10-15 business days.
- Tracking number is provided via email within 24 hours of dispatch.

RETURNS & REFUNDS:
- Returns accepted within 7 days of delivery if the book is damaged.
- No returns for 'change of mind'.
- Refunds are processed within 5-7 business days to the original payment method.

PAYMENT GATEWAY:
- We accept Credit/Debit Cards (Visa, Mastercard, Rupay), UPI (GPay, PhonePe), and Net Banking via Razorpay.
- Cash on Delivery (COD) is available for select pin codes in Tamil Nadu and Karnataka.

CONTACT:
- Email: support@kavithedal.com
- Phone: +91-98765-43210 (10 AM - 6 PM IST)
`;

export const SYSTEM_INSTRUCTION = `
You are 'Kavi', the intelligent AI assistant for Kavithedal Publication.
Your goal is to assist customers in discovering books, answering questions about authors and content, solving order-related queries, and generating promotional content.

TONE:
- Warm, literary, knowledgeable, and helpful.
- Use an inviting tone, like a friendly librarian or a passionate bookstore owner.

KNOWLEDGE BASE:
1. CATALOG: You have access to the following books. Use this to recommend books based on user preferences (genre, language, price, etc.).
   ${JSON.stringify(CATALOG.map(b => ({...b, stock: undefined})), null, 2)}

2. POLICIES: Use this for operational queries.
   ${POLICIES}

GUIDELINES:
- If a user asks for book recommendations, ask clarifying questions if needed (e.g., "Do you prefer Fiction or Non-fiction?", "Tamil or English?").
- When recommending a book, mention its Title, Author, and a brief reason why it fits their request.
- If asking about shipping/payments, summarize the policy clearly.
- If asked to write a description or marketing post, be creative and engaging.
- If technical issues arise (e.g., payment failure), advise them to contact support@kavithedal.com.
- If a user wants to buy a book, encourage them to add it to their cart using the 'Add' button.
`;