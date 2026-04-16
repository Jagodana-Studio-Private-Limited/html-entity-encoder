export const siteConfig = {
  // ====== CUSTOMIZE THESE FOR EACH TOOL ======
  name: "HTML Entity Encoder",
  title: "HTML Entity Encoder & Decoder — Convert Special Characters Instantly",
  description:
    "Free browser tool to encode and decode HTML entities. Convert special characters like <, >, &, and \" to safe HTML entities and back. 100% client-side, no data sent to any server.",
  url: "https://html-entity-encoder.tools.jagodana.com",
  ogImage: "/opengraph-image",

  // Header
  headerIcon: "Code2", // lucide-react icon name
  // Brand gradient colors for Tailwind are in globals.css (--brand / --brand-accent)
  // Use text-brand, from-brand, to-brand-accent etc. in components
  brandAccentColor: "#f59e0b", // hex accent for OG image gradient (amber-500)

  // SEO
  keywords: [
    "HTML entity encoder",
    "HTML entity decoder",
    "HTML escape tool",
    "special characters to HTML entities",
    "HTML encoding online",
    "HTML unescape",
    "HTML character encoder",
    "encode HTML entities",
    "decode HTML entities",
    "HTML escape characters",
    "free HTML tool",
    "developer tools",
  ],
  applicationCategory: "DeveloperApplication",

  // Theme
  themeColor: "#f97316", // orange-500

  // Branding
  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  // Social Profiles (for Organization schema sameAs)
  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  // Links
  links: {
    github: "https://github.com/Jagodana-Studio-Private-Limited/html-entity-encoder",
    website: "https://jagodana.com",
  },

  // Footer
  footer: {
    about:
      "HTML Entity Encoder is a free, privacy-first developer tool for encoding and decoding HTML entities instantly in your browser.",
    featuresTitle: "Features",
    features: [
      "Encode to named entities (e.g. &amp;lt;)",
      "Encode to numeric/decimal entities",
      "Encode to hex entities",
      "Decode any HTML entities back to text",
    ],
  },

  // Hero Section
  hero: {
    badge: "Free HTML Encoding Tool",
    titleLine1: "Encode & Decode",
    titleGradient: "HTML Entities Instantly",
    subtitle:
      "Convert special characters like <, >, &, and \" to safe HTML entities — and back. Essential for template developers, email HTML, and CMS content. 100% client-side.",
  },

  // Feature Cards (shown on homepage)
  featureCards: [
    {
      icon: "🔐",
      title: "Encode to Entities",
      description:
        "Convert special characters to named, decimal, or hex HTML entities in one click.",
    },
    {
      icon: "🔓",
      title: "Decode Entities",
      description:
        "Turn &amp;lt;, &#60;, or &#x3C; back into readable, human-friendly text instantly.",
    },
    {
      icon: "🔒",
      title: "100% Private",
      description:
        "All processing happens in your browser. Your data never touches a server.",
    },
  ],

  // Related Tools (cross-linking to sibling Jagodana tools for internal SEO)
  relatedTools: [
    {
      name: "URL Encoder / Decoder",
      url: "https://url-encoder-decoder.tools.jagodana.com",
      icon: "🔗",
      description: "Percent-encode and decode URLs for use in web applications.",
    },
    {
      name: "Encoding Explorer",
      url: "https://encoding-explorer.tools.jagodana.com",
      icon: "🔡",
      description: "Explore Base64, hex, binary and other encoding formats.",
    },
    {
      name: "JWT Decoder",
      url: "https://jwt-decoder.tools.jagodana.com",
      icon: "🪙",
      description: "Decode and inspect JSON Web Tokens client-side.",
    },
    {
      name: "JSON Formatter",
      url: "https://json-formatter.tools.jagodana.com",
      icon: "📋",
      description: "Prettify, minify, and validate any JSON instantly.",
    },
    {
      name: "Regex Playground",
      url: "https://regex-playground.tools.jagodana.com",
      icon: "🧪",
      description: "Build, test and debug regular expressions in real-time.",
    },
    {
      name: "Text Case Converter",
      url: "https://text-case-converter.tools.jagodana.com",
      icon: "🔤",
      description: "Convert text between camelCase, snake_case, PascalCase and more.",
    },
  ],

  // HowTo Steps (drives HowTo JSON-LD schema for rich results)
  howToSteps: [
    {
      name: "Paste or type your text",
      text: "Enter the text containing special characters you want to encode, or paste existing HTML entities you want to decode, into the input box.",
      url: "",
    },
    {
      name: "Choose encode or decode mode",
      text: "Select Encode to convert special characters to HTML entities (named, decimal, or hex format), or Decode to convert entities back to plain text.",
      url: "",
    },
    {
      name: "Copy the result",
      text: "Click the Copy button to copy the encoded or decoded output to your clipboard, ready to paste into your code, template, or CMS.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  // FAQ (drives both the FAQ UI section and FAQPage JSON-LD schema)
  faq: [
    {
      question: "What are HTML entities?",
      answer:
        "HTML entities are special codes used to represent characters that have special meaning in HTML or that are difficult to type directly. For example, the less-than sign (<) must be written as &lt; to prevent the browser from interpreting it as the start of an HTML tag. Entities can be written as named (&amp;), decimal (&#38;), or hexadecimal (&#x26;) references.",
    },
    {
      question: "When should I encode HTML entities?",
      answer:
        "You should encode HTML entities whenever you are inserting user-generated content or dynamic text into an HTML document, email template, or CMS field. This prevents Cross-Site Scripting (XSS) attacks and ensures the browser displays your text correctly rather than trying to interpret special characters as HTML markup.",
    },
    {
      question: "What is the difference between named, decimal, and hex entities?",
      answer:
        "Named entities use a human-readable name (e.g. &lt; for <). Decimal entities use the Unicode code point as a decimal number (e.g. &#60; for <). Hexadecimal entities use the code point in hex with an x prefix (e.g. &#x3C; for <). All three formats produce the same result in the browser — use whichever fits your context or coding style.",
    },
    {
      question: "Is my data private when using this tool?",
      answer:
        "Yes, completely. HTML Entity Encoder runs entirely in your browser using JavaScript. Your text is never sent to any server, logged, or stored anywhere. This makes it safe to use even with sensitive content such as API keys, tokens, or private configuration data.",
    },
    {
      question: "Which characters does this tool encode?",
      answer:
        "The tool encodes all characters that require escaping in HTML, including: < (less-than), > (greater-than), & (ampersand), \" (double quote), ' (single quote / apostrophe), and all other non-ASCII Unicode characters that have corresponding HTML entity codes. The full encode mode also encodes every character with a named or numeric entity equivalent.",
    },
    {
      question: "Can I decode partial HTML mixed with plain text?",
      answer:
        "Yes. The decoder processes any string and converts all HTML entity sequences it finds — whether named (&amp;), decimal (&#60;), or hex (&#x3C;) — back to their corresponding characters, leaving the rest of the text unchanged.",
    },
  ],

  // ====== PAGES (for sitemap + per-page SEO) ======
  pages: {
    "/": {
      title:
        "HTML Entity Encoder & Decoder — Convert Special Characters Instantly",
      description:
        "Free browser tool to encode and decode HTML entities. Convert special characters like <, >, &, and \" to safe HTML entities and back. 100% client-side.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
