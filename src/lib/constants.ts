export const APP_NAME = "GigPilot";
export const APP_DESCRIPTION =
  "Your AI partner that scans the market 24/7, finds real money-making opportunities, and gives you the easy button to execute them.";

export const NAV_ITEMS = [
  {
    title: "Opportunities",
    href: "/dashboard",
    icon: "Radar",
    description: "Live opportunities found by your bots",
  },
  {
    title: "Templates",
    href: "/dashboard/templates",
    icon: "Zap",
    description: "AI-powered easy buttons",
  },
  {
    title: "Earnings",
    href: "/dashboard/earnings",
    icon: "DollarSign",
    description: "Track your income",
  },
  {
    title: "Bots",
    href: "/dashboard/bots",
    icon: "Bot",
    description: "Your scout bots",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "Settings",
    description: "Account & preferences",
  },
] as const;

export const OPPORTUNITY_CATEGORIES = [
  "Content Writing",
  "Social Media",
  "Email Marketing",
  "Product Descriptions",
  "Resume Writing",
  "Video Scripts",
  "SEO Content",
  "Ad Copy",
  "Chatbot Setup",
  "Digital Products",
  "E-commerce",
  "Translation",
  "Data & Analytics",
  "AI Automation",
  "Design & Branding",
] as const;
