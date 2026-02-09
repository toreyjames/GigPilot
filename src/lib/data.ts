// Shared sample data so opportunity cards, detail pages, and landing page all stay in sync.
// In production this comes from the database / bot scrapers.

export interface Opportunity {
  id: string;
  title: string;
  category: string;
  description: string;
  avgEarnings: string;
  timeToDeliver: string;
  demandScore: number;
  competition: "low" | "medium" | "high";
  trend: "rising" | "stable" | "falling";
  source: string;
  isHot: boolean;
  foundAt: string;
  /** Longer detail shown on the opportunity page */
  detail: string;
  /** Which template to link to */
  templateId: string;
  /** Tips for executing this opportunity */
  tips: string[];
  /** Estimated $/hr (potential ROI proxy), when available */
  earningsPerHour?: number;
}

export const opportunities: Opportunity[] = [
  {
    id: "email-shopify",
    title: "Email Welcome Sequences for Shopify Stores",
    category: "Email Marketing",
    description:
      "E-commerce brands are desperate for onboarding email flows. 340 jobs posted this week with only 12 avg proposals. Quality gap is wide open.",
    detail:
      "Shopify store owners are spending big on customer retention but most don't know how to write a compelling welcome sequence. The average store loses 70% of new subscribers in the first week because their emails are generic. Upwork shows 340 active job posts this week with budgets of $50-150, and only 12 proposals per job on average. Fiverr sellers in this niche average 4.2 stars — meaning buyers aren't happy with current options. This is a wide-open gap you can fill with AI-generated sequences that actually convert.",
    avgEarnings: "$75",
    timeToDeliver: "~20 min",
    demandScore: 89,
    competition: "low",
    trend: "rising",
    source: "Upwork + Google Trends",
    isHot: true,
    foundAt: "2 hours ago",
    templateId: "email-sequence",
    tips: [
      "Focus on Shopify stores selling physical products — they convert best with welcome sequences",
      "Include a discount code in email 2 or 3 for higher client satisfaction",
      "Offer a 'done in 24 hours' guarantee to stand out from competitors averaging 3-5 day delivery",
      "Upsell a post-purchase follow-up sequence for an extra $50",
    ],
  },
  {
    id: "pet-portraits",
    title: "AI Pet Portrait Illustrations for Etsy",
    category: "Digital Products",
    description:
      "Personalized pet portraits showing 38% demand growth on Etsy. Top sellers have 6-week backlogs. AI can generate these in 5 minutes.",
    detail:
      "Pet portraits are one of Etsy's fastest-growing categories with 38% year-over-year demand growth. The top 20 sellers all have 4-6 week wait times, which means buyers are actively looking for alternatives who can deliver faster. AI image generation tools can produce high-quality stylized pet portraits in under 5 minutes. Average sale price is $35 with near-zero cost of goods. The key differentiator is offering multiple art styles (watercolor, cartoon, minimalist) and fast 24-48 hour delivery.",
    avgEarnings: "$35/sale",
    timeToDeliver: "~10 min",
    demandScore: 82,
    competition: "medium",
    trend: "rising",
    source: "Etsy Trends",
    isHot: true,
    foundAt: "5 hours ago",
    templateId: "digital-product",
    tips: [
      "Offer 3-4 art styles (watercolor, line art, cartoon, pop art) to appeal to different tastes",
      "Use 'same-day delivery' as your main selling point — top sellers take weeks",
      "Bundle: offer 2 pets for $55 or 3 for $75 to increase average order value",
      "Add a 'printed and framed' upsell option using a print-on-demand service",
    ],
  },
  {
    id: "amazon-descriptions",
    title: "Product Descriptions for Amazon FBA Sellers",
    category: "Content Writing",
    description:
      'Amazon sellers using AI-optimized listings see 40% conversion lift. Search for "product description writer" up 66% on Fiverr.',
    detail:
      'Amazon sellers are in a constant battle for conversion rates, and optimized product listings are the #1 lever they can pull. Fiverr searches for "product description writer" are up 66% month-over-month. Amazon\'s own data shows that AI-optimized listings see a 40% lift in conversion rates. Most sellers are small operations (1-10 products) who don\'t have the copywriting skills to write compelling bullet points and descriptions. They\'re willing to pay $25-50 per listing because a single percentage point of conversion improvement can mean thousands in revenue.',
    avgEarnings: "$25-50",
    timeToDeliver: "~15 min",
    demandScore: 76,
    competition: "medium",
    trend: "stable",
    source: "Fiverr + Amazon",
    isHot: false,
    foundAt: "8 hours ago",
    templateId: "product-description",
    tips: [
      "Include backend keyword research in your deliverable — sellers love this as an add-on",
      "Focus on specific niches (supplements, home goods, electronics) to build expertise",
      "Offer A+ Content (enhanced brand content) as a premium upsell for $75-100",
      "Create a portfolio with before/after conversion rate improvements",
    ],
  },
  {
    id: "youtube-finance",
    title: "Faceless YouTube Scripts - Personal Finance Niche",
    category: "Video Scripts",
    description:
      "Personal finance faceless channels earning $10-20 CPM. Script + thumbnail requests up 488% on Fiverr. High-value, repeatable work.",
    detail:
      "The faceless YouTube channel trend is exploding, and personal finance is the highest-CPM niche at $10-20 per 1,000 views. Fiverr requests for YouTube scripts are up 488% year-over-year. Channel operators need a steady pipeline of scripts (2-4 per week) which makes this highly repeatable income. Each script includes a hook, main content structure, and call-to-action, plus a thumbnail concept and video description with SEO keywords. The best part: once you land a channel operator as a client, they become a recurring customer.",
    avgEarnings: "$40-80",
    timeToDeliver: "~25 min",
    demandScore: 91,
    competition: "low",
    trend: "rising",
    source: "Fiverr + YouTube",
    isHot: true,
    foundAt: "1 hour ago",
    templateId: "video-script",
    tips: [
      "Study the top 10 faceless finance channels to understand what hooks and formats work",
      "Offer a 'script + thumbnail concept + description' bundle for higher per-task earnings",
      "Pitch ongoing retainer deals: 8 scripts/month for $500 is a win for both sides",
      "Use trending financial topics (tax season, market events) for timely scripts that get more views",
    ],
  },
  {
    id: "social-restaurants",
    title: "Social Media Content Packs for Local Restaurants",
    category: "Social Media",
    description:
      "Local restaurants posting 3x more on Instagram than last year but struggling with content. 47 Reddit threads this month asking for help.",
    detail:
      "Local restaurants know they need to be on social media but most owners are too busy running the kitchen to create content. Reddit's r/smallbusiness and r/restaurantowners have 47 threads this month alone from owners asking for affordable social media help. The sweet spot is a monthly content pack: 30 posts with captions, hashtags, and image suggestions for $150-200/month. AI can generate a full month of content in 30 minutes. This is recurring revenue — once a restaurant sees results, they stay subscribed.",
    avgEarnings: "$150/mo",
    timeToDeliver: "~30 min",
    demandScore: 68,
    competition: "low",
    trend: "rising",
    source: "Reddit + Google Trends",
    isHot: false,
    foundAt: "12 hours ago",
    templateId: "social-media-pack",
    tips: [
      "Focus on one cuisine type to build a portfolio (Italian, Mexican, Asian fusion)",
      "Include 'food holidays' in your content calendar — National Pizza Day, Taco Tuesday, etc.",
      "Offer a free 1-week sample pack to land the first client, then upsell to monthly",
      "Add a photo/video shot list so the restaurant staff can easily capture matching visuals",
    ],
  },
  {
    id: "resume-tech",
    title: "Resume Rewriting for Tech Layoff Wave",
    category: "Resume Writing",
    description:
      'New round of tech layoffs driving resume demand. "AI resume writer" searches up 200% this month. People paying $30-75 per rewrite.',
    detail:
      "Another wave of tech layoffs is driving a massive spike in resume rewriting demand. Google Trends shows 'AI resume writer' searches up 200% in the last 30 days. People who were happily employed 2 weeks ago suddenly need a polished, ATS-optimized resume fast. They're willing to pay $30-75 for a professional rewrite because the ROI is obvious — one good interview covers the cost 100x over. The key is speed: these people are anxious and want their resume done today, not next week.",
    avgEarnings: "$50",
    timeToDeliver: "~15 min",
    demandScore: 85,
    competition: "medium",
    trend: "rising",
    source: "Google Trends + Fiverr",
    isHot: false,
    foundAt: "6 hours ago",
    templateId: "resume-rewrite",
    tips: [
      "Specialize in tech roles (SWE, PM, Data Science) since that's where layoffs are hitting",
      "Include a matching cover letter as a bundle — charge $75 for resume + cover letter",
      "Offer LinkedIn profile optimization as an upsell for $25-40 extra",
      "Guarantee 'ATS-optimized' — this is the #1 concern for job seekers right now",
    ],
  },
];

export interface Template {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  category: string;
  avgEarnings: string;
  timeToComplete: string;
  difficulty: string;
  popular: boolean;
  fields: TemplateField[];
}

export interface TemplateField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder: string;
  required: boolean;
  options?: string[];
}

export const templates: Template[] = [
  {
    id: "email-sequence",
    title: "Email Welcome Sequence",
    description:
      "Generate a complete onboarding email flow for e-commerce, SaaS, or service businesses.",
    longDescription:
      "Create a 5-7 email welcome sequence that converts new subscribers into paying customers. AI writes compelling subject lines, body copy, and CTAs based on the business type and target audience. Includes personalization tokens, send timing recommendations, and A/B test suggestions.",
    icon: "Mail",
    category: "Email Marketing",
    avgEarnings: "$50-100",
    timeToComplete: "~20 min",
    difficulty: "Easy",
    popular: true,
    fields: [
      {
        id: "businessType",
        label: "Business Type",
        type: "select",
        placeholder: "Select business type",
        required: true,
        options: [
          "E-commerce / Shopify",
          "SaaS / Software",
          "Service Business",
          "Course / Digital Product",
          "Agency / Consulting",
        ],
      },
      {
        id: "businessName",
        label: "Business Name",
        type: "text",
        placeholder: "e.g. Coastal Candle Co.",
        required: true,
      },
      {
        id: "product",
        label: "Main Product or Service",
        type: "text",
        placeholder: "e.g. Hand-poured soy candles",
        required: true,
      },
      {
        id: "audience",
        label: "Target Audience",
        type: "text",
        placeholder: "e.g. Women 25-45 who love home decor",
        required: true,
      },
      {
        id: "tone",
        label: "Brand Tone",
        type: "select",
        placeholder: "Select tone",
        required: true,
        options: [
          "Friendly & Casual",
          "Professional & Polished",
          "Fun & Playful",
          "Luxury & Premium",
          "Bold & Direct",
        ],
      },
      {
        id: "goal",
        label: "Primary Goal",
        type: "select",
        placeholder: "What should the sequence achieve?",
        required: true,
        options: [
          "First purchase conversion",
          "Free trial to paid",
          "Build trust & engagement",
          "Upsell / cross-sell",
        ],
      },
      {
        id: "additionalNotes",
        label: "Additional Notes (optional)",
        type: "textarea",
        placeholder: "Any specific offers, discount codes, brand guidelines...",
        required: false,
      },
    ],
  },
  {
    id: "blog-post",
    title: "SEO Blog Post",
    description:
      "Full-length blog article with SEO optimization, meta descriptions, and structure.",
    longDescription:
      "Generate a 1,500-2,500 word SEO-optimized blog post with proper heading structure, keyword placement, meta description, and internal linking suggestions. Includes an engaging intro hook, scannable subheadings, and a strong conclusion with CTA.",
    icon: "PenTool",
    category: "Content Writing",
    avgEarnings: "$25-75",
    timeToComplete: "~15 min",
    difficulty: "Easy",
    popular: true,
    fields: [
      {
        id: "topic",
        label: "Blog Topic",
        type: "text",
        placeholder: "e.g. 10 Best Email Marketing Tools for Small Business",
        required: true,
      },
      {
        id: "keyword",
        label: "Target Keyword",
        type: "text",
        placeholder: "e.g. email marketing tools",
        required: true,
      },
      {
        id: "wordCount",
        label: "Target Word Count",
        type: "select",
        placeholder: "Select length",
        required: true,
        options: ["1,000 words", "1,500 words", "2,000 words", "2,500+ words"],
      },
      {
        id: "tone",
        label: "Writing Tone",
        type: "select",
        placeholder: "Select tone",
        required: true,
        options: [
          "Conversational & Friendly",
          "Professional & Authoritative",
          "Casual & Fun",
          "Technical & Detailed",
        ],
      },
      {
        id: "audience",
        label: "Target Audience",
        type: "text",
        placeholder: "e.g. Small business owners new to email marketing",
        required: true,
      },
      {
        id: "additionalNotes",
        label: "Additional Notes (optional)",
        type: "textarea",
        placeholder: "Any specific points to cover, competitors to mention, links to include...",
        required: false,
      },
    ],
  },
  {
    id: "product-description",
    title: "Product Description Pack",
    description:
      "Amazon-optimized product titles, bullet points, descriptions, and backend keywords.",
    longDescription:
      "Create a complete Amazon product listing with an optimized title, 5 bullet points, detailed description, and backend keyword list. Follows Amazon's style guidelines and is proven to boost conversion rates by up to 40%.",
    icon: "ShoppingBag",
    category: "E-commerce",
    avgEarnings: "$25-50",
    timeToComplete: "~15 min",
    difficulty: "Easy",
    popular: false,
    fields: [
      {
        id: "productName",
        label: "Product Name",
        type: "text",
        placeholder: "e.g. Bamboo Cutting Board Set",
        required: true,
      },
      {
        id: "features",
        label: "Key Features (one per line)",
        type: "textarea",
        placeholder: "e.g.\nOrganic bamboo\n3 sizes included\nDishwasher safe\nNon-slip grip",
        required: true,
      },
      {
        id: "platform",
        label: "Marketplace",
        type: "select",
        placeholder: "Select platform",
        required: true,
        options: ["Amazon US", "Amazon UK", "Amazon EU", "Shopify", "Etsy"],
      },
      {
        id: "targetCustomer",
        label: "Target Customer",
        type: "text",
        placeholder: "e.g. Home cooks who want eco-friendly kitchen tools",
        required: true,
      },
      {
        id: "priceRange",
        label: "Price Range",
        type: "text",
        placeholder: "e.g. $29.99",
        required: false,
      },
    ],
  },
  {
    id: "social-media-pack",
    title: "30-Day Social Media Pack",
    description:
      "A full month of posts with captions, hashtags, and image prompts.",
    longDescription:
      "Generate 30 days of social media content across multiple platforms. Each post includes a caption, relevant hashtags, posting time suggestion, and an image/visual prompt. Includes a mix of promotional, educational, entertaining, and engagement posts.",
    icon: "Palette",
    category: "Social Media",
    avgEarnings: "$100-200",
    timeToComplete: "~30 min",
    difficulty: "Medium",
    popular: true,
    fields: [
      {
        id: "businessName",
        label: "Business / Brand Name",
        type: "text",
        placeholder: "e.g. Mario's Pizzeria",
        required: true,
      },
      {
        id: "industry",
        label: "Industry / Niche",
        type: "text",
        placeholder: "e.g. Italian restaurant in downtown Austin",
        required: true,
      },
      {
        id: "platforms",
        label: "Primary Platform",
        type: "select",
        placeholder: "Select platform",
        required: true,
        options: ["Instagram", "Facebook", "LinkedIn", "X / Twitter", "TikTok"],
      },
      {
        id: "tone",
        label: "Brand Voice",
        type: "select",
        placeholder: "Select voice",
        required: true,
        options: [
          "Friendly & Warm",
          "Professional",
          "Fun & Quirky",
          "Luxury / Premium",
          "Bold & Edgy",
        ],
      },
      {
        id: "goals",
        label: "Content Goals",
        type: "textarea",
        placeholder: "e.g. Drive foot traffic, promote weekend specials, build community engagement",
        required: true,
      },
    ],
  },
  {
    id: "video-script",
    title: "Faceless YouTube Script",
    description:
      "Complete video script with hook, structure, CTA, plus thumbnail concept.",
    longDescription:
      "Generate a full YouTube video script optimized for retention. Includes a pattern-interrupt hook (first 30 seconds), structured content sections, strategic engagement prompts, a strong CTA, plus a thumbnail concept and SEO-optimized title/description/tags.",
    icon: "Video",
    category: "Video Scripts",
    avgEarnings: "$40-80",
    timeToComplete: "~25 min",
    difficulty: "Medium",
    popular: true,
    fields: [
      {
        id: "topic",
        label: "Video Topic",
        type: "text",
        placeholder: "e.g. 7 Money Habits That Keep You Poor",
        required: true,
      },
      {
        id: "niche",
        label: "Channel Niche",
        type: "select",
        placeholder: "Select niche",
        required: true,
        options: [
          "Personal Finance",
          "Business & Entrepreneurship",
          "Self Improvement",
          "Technology & AI",
          "True Crime / Mystery",
          "Education / Explainer",
          "Health & Wellness",
        ],
      },
      {
        id: "length",
        label: "Target Video Length",
        type: "select",
        placeholder: "Select length",
        required: true,
        options: [
          "Short (5-8 minutes)",
          "Medium (8-12 minutes)",
          "Long (12-20 minutes)",
        ],
      },
      {
        id: "style",
        label: "Narration Style",
        type: "select",
        placeholder: "Select style",
        required: true,
        options: [
          "Story-driven / Narrative",
          "List / Countdown",
          "How-to / Tutorial",
          "Documentary / Investigative",
        ],
      },
      {
        id: "additionalNotes",
        label: "Additional Notes (optional)",
        type: "textarea",
        placeholder: "Any specific angles, data points, or calls-to-action to include...",
        required: false,
      },
    ],
  },
  {
    id: "resume-rewrite",
    title: "Resume Rewrite",
    description:
      "Transform any resume into a polished, ATS-optimized document.",
    longDescription:
      "Take an existing resume and transform it into a polished, ATS-friendly document tailored to a specific target role. Includes optimized bullet points with quantified achievements, a compelling professional summary, skills section aligned with the job description, and a matching cover letter.",
    icon: "FileText",
    category: "Resume Writing",
    avgEarnings: "$30-75",
    timeToComplete: "~15 min",
    difficulty: "Easy",
    popular: false,
    fields: [
      {
        id: "currentResume",
        label: "Current Resume (paste text)",
        type: "textarea",
        placeholder: "Paste the current resume content here...",
        required: true,
      },
      {
        id: "targetRole",
        label: "Target Job Title",
        type: "text",
        placeholder: "e.g. Senior Product Manager",
        required: true,
      },
      {
        id: "targetCompany",
        label: "Target Company (optional)",
        type: "text",
        placeholder: "e.g. Stripe",
        required: false,
      },
      {
        id: "jobDescription",
        label: "Job Description (paste if available)",
        type: "textarea",
        placeholder: "Paste the job description to tailor the resume...",
        required: false,
      },
      {
        id: "includecover",
        label: "Include Cover Letter?",
        type: "select",
        placeholder: "Select",
        required: true,
        options: ["Yes - include cover letter", "No - resume only"],
      },
    ],
  },
];

export function getOpportunityById(id: string) {
  return opportunities.find((o) => o.id === id);
}

export function getTemplateById(id: string) {
  return templates.find((t) => t.id === id);
}
