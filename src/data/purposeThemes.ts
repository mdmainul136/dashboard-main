export interface PurposeTheme {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  preview: string; // gradient or image path
  colors: string[];
  features: string[];
  popular?: boolean;
  isNew?: boolean;
  isPremium?: boolean;
}

// eCommerce themes (original)
export const ecommerceThemes: PurposeTheme[] = [
  {
    id: "riyadh-modern", name: "Riyadh Modern", nameAr: "الرياض الحديثة",
    category: "Fashion & Lifestyle",
    preview: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    colors: ["#0f3460", "#e94560", "#533483", "#16213e"],
    features: ["RTL Ready", "Mega Menu", "Quick View", "Wishlist"],
    popular: true,
  },
  {
    id: "jeddah-boutique", name: "Jeddah Boutique", nameAr: "بوتيك جدة",
    category: "Luxury & Premium",
    preview: "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 50%, #0d0d0d 100%)",
    colors: ["#c9a96e", "#2d2d2d", "#f5f0e8", "#1a1a1a"],
    features: ["RTL Ready", "Gold Accents", "Video Hero", "Lookbook"],
    popular: true,
  },
  {
    id: "desert-minimal", name: "Desert Minimal", nameAr: "صحراء مينيمال",
    category: "General Store",
    preview: "linear-gradient(135deg, #f5e6d3 0%, #e8d5b7 50%, #d4a574 100%)",
    colors: ["#d4a574", "#8b6914", "#f5e6d3", "#3d2914"],
    features: ["RTL Ready", "Clean Layout", "Fast Loading", "Mobile First"],
  },
  {
    id: "gulf-tech", name: "Gulf Tech", nameAr: "خليج تك",
    category: "Electronics",
    preview: "linear-gradient(135deg, #0a192f 0%, #112240 50%, #1d3461 100%)",
    colors: ["#64ffda", "#0a192f", "#ccd6f6", "#112240"],
    features: ["RTL Ready", "Spec Tables", "Compare", "360° View"],
    isNew: true,
  },
  {
    id: "souq-fresh", name: "Souq Fresh", nameAr: "سوق فريش",
    category: "Grocery & Food",
    preview: "linear-gradient(135deg, #134e5e 0%, #71b280 50%, #2d9b4e 100%)",
    colors: ["#2d9b4e", "#134e5e", "#f0f9f4", "#1a3c34"],
    features: ["RTL Ready", "Quick Reorder", "Delivery Slots", "Fresh Badge"],
    isNew: true,
  },
  {
    id: "heritage-craft", name: "Heritage Craft", nameAr: "تراث حرفي",
    category: "Handmade & Artisan",
    preview: "linear-gradient(135deg, #4a1942 0%, #6b2d5b 50%, #c84b31 100%)",
    colors: ["#c84b31", "#4a1942", "#fdf0d5", "#2d1b2e"],
    features: ["RTL Ready", "Story Section", "Artisan Profiles", "Gift Wrap"],
  },
  {
    id: "makkah-classic", name: "Makkah Classic", nameAr: "مكة كلاسيك",
    category: "Islamic Products",
    preview: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)",
    colors: ["#40916c", "#1b4332", "#f8f4e8", "#0b2618"],
    features: ["RTL Ready", "Prayer Times", "Islamic Calendar", "Hijri Dates"],
  },
  {
    id: "neon-saudi", name: "Neon Saudi", nameAr: "نيون سعودي",
    category: "Youth & Streetwear",
    preview: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #2d1b69 100%)",
    colors: ["#e040fb", "#00e5ff", "#0f0f0f", "#ffea00"],
    features: ["RTL Ready", "Animated", "Social Feed", "Drop Alerts"],
  },
];

// Real Estate themes
export const realEstateThemes: PurposeTheme[] = [
  {
    id: "skyline-luxe", name: "Skyline Luxe", nameAr: "سكاي لاين فاخر",
    category: "Luxury Properties",
    preview: "linear-gradient(135deg, #0c1b33 0%, #1a365d 50%, #2a4a7f 100%)",
    colors: ["#2a4a7f", "#c9a96e", "#f8f6f0", "#0c1b33"],
    features: ["Virtual Tours", "Map View", "Lead Capture", "Floor Plans"],
    popular: true,
  },
  {
    id: "verde-estate", name: "Verde Estate", nameAr: "فيردي العقارية",
    category: "Residential",
    preview: "linear-gradient(135deg, #1a3c34 0%, #2d6a4f 50%, #52b788 100%)",
    colors: ["#52b788", "#1a3c34", "#f0f9f4", "#081c15"],
    features: ["Property Cards", "Agent Profiles", "Mortgage Calc", "Comparison"],
    popular: true,
  },
  {
    id: "urban-loft", name: "Urban Loft", nameAr: "أوربان لوفت",
    category: "Commercial",
    preview: "linear-gradient(135deg, #2d2d2d 0%, #404040 50%, #595959 100%)",
    colors: ["#ff6b35", "#2d2d2d", "#f5f5f5", "#1a1a1a"],
    features: ["Office Spaces", "3D Gallery", "Lease Terms", "Location Map"],
    isNew: true,
  },
  {
    id: "coastal-realty", name: "Coastal Realty", nameAr: "الساحل العقارية",
    category: "Vacation & Resort",
    preview: "linear-gradient(135deg, #0077b6 0%, #00b4d8 50%, #90e0ef 100%)",
    colors: ["#0077b6", "#00b4d8", "#f0f8ff", "#023e58"],
    features: ["Beach Views", "Drone Photos", "Seasonal Pricing", "Booking"],
  },
  {
    id: "heritage-homes", name: "Heritage Homes", nameAr: "بيوت التراث",
    category: "Traditional",
    preview: "linear-gradient(135deg, #5c3d2e 0%, #8b6914 50%, #d4a574 100%)",
    colors: ["#8b6914", "#5c3d2e", "#fdf5e6", "#3d2914"],
    features: ["RTL Ready", "History Section", "Neighborhood Guide", "Cultural"],
  },
  {
    id: "metro-modern", name: "Metro Modern", nameAr: "مترو موديرن",
    category: "Apartments",
    preview: "linear-gradient(135deg, #1a1a2e 0%, #2d1b69 50%, #6c63ff 100%)",
    colors: ["#6c63ff", "#1a1a2e", "#f8f9fa", "#16213e"],
    features: ["Unit Selector", "Amenities Grid", "Virtual Walk", "Price Range"],
    isNew: true,
  },
];

// Restaurant themes
export const restaurantThemes: PurposeTheme[] = [
  {
    id: "bistro-noir", name: "Bistro Noir", nameAr: "بيسترو نوار",
    category: "Fine Dining",
    preview: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #404040 100%)",
    colors: ["#c9a96e", "#1a1a1a", "#f5f0e8", "#0d0d0d"],
    features: ["Reservation", "Chef's Table", "Wine Pairing", "Prix Fixe"],
    popular: true,
  },
  {
    id: "spice-garden", name: "Spice Garden", nameAr: "حديقة البهارات",
    category: "Asian & Indian",
    preview: "linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%)",
    colors: ["#dc2626", "#fbbf24", "#fef3c7", "#450a0a"],
    features: ["Spice Level", "Dietary Filters", "Family Pack", "Express Order"],
    popular: true,
  },
  {
    id: "cafe-breeze", name: "Cafe Breeze", nameAr: "كافيه بريز",
    category: "Coffee & Bakery",
    preview: "linear-gradient(135deg, #78350f 0%, #92400e 50%, #b45309 100%)",
    colors: ["#92400e", "#d97706", "#fffbeb", "#451a03"],
    features: ["Daily Specials", "Loyalty Card", "Mobile Order", "WiFi Badge"],
  },
  {
    id: "sea-catch", name: "Sea Catch", nameAr: "صيد البحر",
    category: "Seafood",
    preview: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)",
    colors: ["#0369a1", "#0ea5e9", "#f0f9ff", "#082f49"],
    features: ["Fresh Catch", "Seasonal Menu", "Ocean View", "Market Price"],
    isNew: true,
  },
  {
    id: "grill-house", name: "Grill House", nameAr: "دار الشواء",
    category: "BBQ & Grill",
    preview: "linear-gradient(135deg, #431407 0%, #7c2d12 50%, #c2410c 100%)",
    colors: ["#c2410c", "#7c2d12", "#fff7ed", "#431407"],
    features: ["Smoker Timer", "Combo Deals", "Catering Menu", "Group Orders"],
  },
  {
    id: "green-bowl", name: "Green Bowl", nameAr: "الطبق الأخضر",
    category: "Healthy & Vegan",
    preview: "linear-gradient(135deg, #14532d 0%, #166534 50%, #22c55e 100%)",
    colors: ["#22c55e", "#14532d", "#f0fdf4", "#052e16"],
    features: ["Calorie Count", "Allergen Info", "Meal Prep", "Subscription"],
    isNew: true,
  },
];

// Business Website themes
export const businessWebsiteThemes: PurposeTheme[] = [
  {
    id: "corporate-edge", name: "Corporate Edge", nameAr: "كوربوريت إيدج",
    category: "Corporate",
    preview: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    colors: ["#3b82f6", "#0f172a", "#f8fafc", "#1e293b"],
    features: ["Team Section", "Case Studies", "CTA Sections", "Stats Counter"],
    popular: true,
  },
  {
    id: "studio-folio", name: "Studio Folio", nameAr: "ستوديو فوليو",
    category: "Portfolio & Creative",
    preview: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)",
    colors: ["#f59e0b", "#18181b", "#fafafa", "#09090b"],
    features: ["Gallery Grid", "Project Details", "Testimonials", "Contact Form"],
    popular: true,
  },
  {
    id: "consult-pro", name: "Consult Pro", nameAr: "كونسلت برو",
    category: "Consulting & Services",
    preview: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #3b82f6 100%)",
    colors: ["#2563eb", "#1e3a5f", "#eff6ff", "#172554"],
    features: ["Service Cards", "Booking Flow", "FAQ Section", "Client Logos"],
  },
  {
    id: "starter-launch", name: "Starter Launch", nameAr: "ستارتر لانش",
    category: "Startup & SaaS",
    preview: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #8b5cf6 100%)",
    colors: ["#8b5cf6", "#4c1d95", "#f5f3ff", "#2e1065"],
    features: ["Pricing Table", "Feature Grid", "Waitlist", "Integrations"],
    isNew: true,
  },
  {
    id: "law-firm", name: "Law & Order", nameAr: "القانون والنظام",
    category: "Legal & Finance",
    preview: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)",
    colors: ["#a16207", "#1c1917", "#fefce8", "#0c0a09"],
    features: ["Practice Areas", "Attorney Bios", "Case Results", "Blog"],
  },
  {
    id: "health-care", name: "MedCare", nameAr: "ميد كير",
    category: "Healthcare",
    preview: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)",
    colors: ["#10b981", "#064e3b", "#ecfdf5", "#022c22"],
    features: ["Appointments", "Doctor Profiles", "Services", "Patient Portal"],
    isNew: true,
  },
];

export type BusinessPurpose = "ecommerce" | "business-website" | "real-estate" | "restaurant" | "lms" | "healthcare" | "fitness" | "salon" | "freelancer" | "travel" | "automotive" | "event" | "saas" | "landlord" | "education" | "cross-border-ior";

// LMS themes
export const lmsThemes: PurposeTheme[] = [
  {
    id: "edu-modern", name: "Edu Modern", nameAr: "إيدو موديرن",
    category: "Online Academy",
    preview: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #3b82f6 100%)",
    colors: ["#2563eb", "#1e3a5f", "#eff6ff", "#172554"],
    features: ["Course Cards", "Progress Bars", "Video Player", "Quiz Engine"],
    popular: true,
  },
  {
    id: "campus-dark", name: "Campus Dark", nameAr: "كامبس دارك",
    category: "University",
    preview: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    colors: ["#8b5cf6", "#0f172a", "#f8fafc", "#1e293b"],
    features: ["Dashboard", "Calendar", "Gradebook", "Forums"],
    popular: true,
  },
  {
    id: "skill-boost", name: "Skill Boost", nameAr: "سكيل بوست",
    category: "Skill Platform",
    preview: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)",
    colors: ["#10b981", "#064e3b", "#ecfdf5", "#022c22"],
    features: ["Certificates", "Leaderboard", "Mentoring", "Badges"],
    isNew: true,
  },
  {
    id: "creative-learn", name: "Creative Learn", nameAr: "كرييتف ليرن",
    category: "Creative Arts",
    preview: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #8b5cf6 100%)",
    colors: ["#8b5cf6", "#4c1d95", "#f5f3ff", "#2e1065"],
    features: ["Portfolio", "Workshops", "Live Classes", "Community"],
    isNew: true,
  },
];

// Healthcare themes
export const healthcareThemes: PurposeTheme[] = [
  { id: "medic-blue", name: "Medic Blue", nameAr: "ميديك بلو", category: "Hospital & Clinic", preview: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #38bdf8 100%)", colors: ["#0284c7", "#0c4a6e", "#f0f9ff", "#082f49"], features: ["Doctor Profiles", "Appointment Booking", "Patient Portal", "Specialties"], popular: true },
  { id: "wellness-green", name: "Wellness Green", nameAr: "ويلنس جرين", category: "Wellness Center", preview: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #34d399 100%)", colors: ["#047857", "#064e3b", "#ecfdf5", "#022c22"], features: ["Service Cards", "Online Booking", "Health Blog", "Testimonials"], popular: true },
  { id: "dental-bright", name: "Dental Bright", nameAr: "دينتال برايت", category: "Dental Clinic", preview: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #93c5fd 100%)", colors: ["#3b82f6", "#1e40af", "#eff6ff", "#1e3a8a"], features: ["Treatment Plans", "Before/After", "Insurance Info", "Emergency"], isNew: true },
  { id: "pharma-care", name: "Pharma Care", nameAr: "فارما كير", category: "Pharmacy", preview: "linear-gradient(135deg, #166534 0%, #22c55e 50%, #86efac 100%)", colors: ["#22c55e", "#166534", "#f0fdf4", "#052e16"], features: ["Product Catalog", "Prescriptions", "Delivery", "Health Tips"] },
];

// Fitness themes
export const fitnessThemes: PurposeTheme[] = [
  { id: "iron-gym", name: "Iron Gym", nameAr: "أيرون جيم", category: "Gym & CrossFit", preview: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #dc2626 100%)", colors: ["#dc2626", "#0f0f0f", "#fafafa", "#1a1a1a"], features: ["Class Schedule", "Membership Plans", "Trainer Profiles", "Progress Tracker"], popular: true },
  { id: "zen-yoga", name: "Zen Yoga", nameAr: "زين يوغا", category: "Yoga & Pilates", preview: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)", colors: ["#7c3aed", "#4c1d95", "#f5f3ff", "#2e1065"], features: ["Class Booking", "Instructor Bios", "Workshop Calendar", "Meditation"], popular: true },
  { id: "sport-hub", name: "Sport Hub", nameAr: "سبورت هب", category: "Sports Academy", preview: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #f97316 100%)", colors: ["#f97316", "#0c4a6e", "#fff7ed", "#431407"], features: ["Programs", "Schedules", "Rankings", "Events"], isNew: true },
  { id: "fit-studio", name: "Fit Studio", nameAr: "فت ستوديو", category: "Fitness Studio", preview: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #06b6d4 100%)", colors: ["#06b6d4", "#18181b", "#ecfeff", "#083344"], features: ["Booking System", "Video Library", "Nutrition Plans", "Community"] },
];

// Salon themes
export const salonThemes: PurposeTheme[] = [
  { id: "glam-studio", name: "Glam Studio", nameAr: "جلام ستوديو", category: "Beauty Salon", preview: "linear-gradient(135deg, #831843 0%, #be185d 50%, #f472b6 100%)", colors: ["#be185d", "#831843", "#fdf2f8", "#500724"], features: ["Service Menu", "Online Booking", "Gallery", "Gift Cards"], popular: true },
  { id: "barber-king", name: "Barber King", nameAr: "باربر كينغ", category: "Barber Shop", preview: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #78350f 100%)", colors: ["#78350f", "#1c1917", "#fef3c7", "#0c0a09"], features: ["Booking", "Stylist Profiles", "Pricing", "Reviews"], popular: true },
  { id: "spa-serenity", name: "Spa Serenity", nameAr: "سبا سيرينيتي", category: "Spa & Wellness", preview: "linear-gradient(135deg, #134e4a 0%, #0d9488 50%, #5eead4 100%)", colors: ["#0d9488", "#134e4a", "#f0fdfa", "#042f2e"], features: ["Treatment Packages", "Membership", "Gift Vouchers", "Relaxation"], isNew: true },
  { id: "nail-art", name: "Nail Art", nameAr: "نيل آرت", category: "Nail Studio", preview: "linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #fb923c 100%)", colors: ["#ea580c", "#7c2d12", "#fff7ed", "#431407"], features: ["Design Gallery", "Pricing", "Booking", "Artist Profiles"] },
];

// Freelancer themes
export const freelancerThemes: PurposeTheme[] = [
  { id: "dev-folio", name: "Dev Folio", nameAr: "ديف فوليو", category: "Developer / IT", preview: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0ea5e9 100%)", colors: ["#0ea5e9", "#0f172a", "#f0f9ff", "#082f49"], features: ["Project Showcase", "Tech Stack", "Testimonials", "Contact"], popular: true },
  { id: "agency-bold", name: "Agency Bold", nameAr: "إيجنسي بولد", category: "Creative Agency", preview: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #f59e0b 100%)", colors: ["#f59e0b", "#18181b", "#fffbeb", "#09090b"], features: ["Case Studies", "Team", "Services", "Client Logos"], popular: true },
  { id: "consult-edge", name: "Consult Edge", nameAr: "كونسلت إيدج", category: "Consultant", preview: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #60a5fa 100%)", colors: ["#2563eb", "#1e3a5f", "#eff6ff", "#172554"], features: ["Service Cards", "Booking", "Blog", "FAQ"], isNew: true },
  { id: "creative-mind", name: "Creative Mind", nameAr: "كريتف مايند", category: "Designer / Artist", preview: "linear-gradient(135deg, #4c1d95 0%, #8b5cf6 50%, #c4b5fd 100%)", colors: ["#8b5cf6", "#4c1d95", "#f5f3ff", "#2e1065"], features: ["Portfolio Grid", "About", "Process", "Hire Me"] },
];

// Travel themes
export const travelThemes: PurposeTheme[] = [
  { id: "wanderlust", name: "Wanderlust", nameAr: "واندرلست", category: "Travel Agency", preview: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #38bdf8 100%)", colors: ["#0284c7", "#0c4a6e", "#f0f9ff", "#082f49"], features: ["Tour Packages", "Booking System", "Destinations", "Reviews"], popular: true },
  { id: "safari-explorer", name: "Safari Explorer", nameAr: "سفاري إكسبلورر", category: "Adventure Tourism", preview: "linear-gradient(135deg, #3f6212 0%, #65a30d 50%, #a3e635 100%)", colors: ["#65a30d", "#3f6212", "#f7fee7", "#1a2e05"], features: ["Activity Catalog", "Guide Profiles", "Photo Gallery", "Trip Planner"], popular: true },
  { id: "luxury-escape", name: "Luxury Escape", nameAr: "لاكشري إسكيب", category: "Luxury Travel", preview: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #c9a96e 100%)", colors: ["#c9a96e", "#1c1917", "#fefce8", "#0c0a09"], features: ["Villa Rentals", "Concierge", "Exclusive Deals", "VIP Packages"], isNew: true },
  { id: "backpacker", name: "Backpacker", nameAr: "باكباكر", category: "Budget Travel", preview: "linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #5eead4 100%)", colors: ["#14b8a6", "#0f766e", "#f0fdfa", "#042f2e"], features: ["Hostel Listings", "Budget Planner", "Community", "Maps"] },
];

// Automotive themes
export const automotiveThemes: PurposeTheme[] = [
  { id: "auto-showroom", name: "Auto Showroom", nameAr: "أوتو شوروم", category: "Car Dealership", preview: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #b91c1c 100%)", colors: ["#b91c1c", "#0f0f0f", "#fef2f2", "#1a1a1a"], features: ["Vehicle Listings", "360° View", "Test Drive Booking", "Finance Calculator"], popular: true },
  { id: "mech-pro", name: "Mech Pro", nameAr: "ميك برو", category: "Auto Service", preview: "linear-gradient(135deg, #1c1917 0%, #44403c 50%, #f59e0b 100%)", colors: ["#f59e0b", "#1c1917", "#fffbeb", "#0c0a09"], features: ["Service Menu", "Online Booking", "Parts Catalog", "Estimates"], popular: true },
  { id: "rental-drive", name: "Rental Drive", nameAr: "رنتال درايف", category: "Car Rental", preview: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #38bdf8 100%)", colors: ["#0369a1", "#0c4a6e", "#f0f9ff", "#082f49"], features: ["Fleet Gallery", "Booking System", "Pricing Plans", "Insurance"], isNew: true },
  { id: "parts-depot", name: "Parts Depot", nameAr: "بارتس ديبو", category: "Auto Parts", preview: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #ef4444 100%)", colors: ["#ef4444", "#18181b", "#fef2f2", "#09090b"], features: ["Parts Search", "Compatibility", "Catalog", "Wholesale"] },
];

// Event themes
export const eventThemes: PurposeTheme[] = [
  { id: "grand-event", name: "Grand Event", nameAr: "جراند إيفنت", category: "Event Planning", preview: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #c9a96e 100%)", colors: ["#c9a96e", "#4c1d95", "#fefce8", "#2e1065"], features: ["Event Gallery", "Vendor List", "RSVP System", "Timeline"], popular: true },
  { id: "wedding-bliss", name: "Wedding Bliss", nameAr: "ويدينج بليس", category: "Wedding Planner", preview: "linear-gradient(135deg, #831843 0%, #be185d 50%, #fda4af 100%)", colors: ["#be185d", "#831843", "#fff1f2", "#500724"], features: ["Packages", "Gallery", "Checklist", "Vendor Directory"], popular: true },
  { id: "conference-hub", name: "Conference Hub", nameAr: "كونفرنس هب", category: "Conference & Expo", preview: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #3b82f6 100%)", colors: ["#3b82f6", "#0f172a", "#eff6ff", "#1e293b"], features: ["Speaker Profiles", "Agenda", "Ticketing", "Sponsors"], isNew: true },
  { id: "venue-royal", name: "Venue Royal", nameAr: "فينيو رويال", category: "Venue Rental", preview: "linear-gradient(135deg, #1c1917 0%, #44403c 50%, #a16207 100%)", colors: ["#a16207", "#1c1917", "#fefce8", "#0c0a09"], features: ["Venue Tours", "Capacity", "Pricing", "Calendar"] },
];

// SaaS themes
export const saasThemes: PurposeTheme[] = [
  { id: "launch-pad", name: "Launch Pad", nameAr: "لانش باد", category: "SaaS Landing", preview: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #8b5cf6 100%)", colors: ["#8b5cf6", "#4c1d95", "#f5f3ff", "#2e1065"], features: ["Pricing Table", "Feature Grid", "Integrations", "Waitlist"], popular: true },
  { id: "api-dock", name: "API Dock", nameAr: "إيه بي آي دوك", category: "Developer Tools", preview: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #06b6d4 100%)", colors: ["#06b6d4", "#0f172a", "#ecfeff", "#083344"], features: ["API Docs", "Code Examples", "Playground", "Changelog"], popular: true },
  { id: "dash-board", name: "Dash Board", nameAr: "داش بورد", category: "Analytics SaaS", preview: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #22c55e 100%)", colors: ["#0284c7", "#0c4a6e", "#f0f9ff", "#082f49"], features: ["Dashboard Preview", "Metrics", "Integrations", "Demo"], isNew: true },
  { id: "cloud-native", name: "Cloud Native", nameAr: "كلاود نيتف", category: "Cloud Platform", preview: "linear-gradient(135deg, #18181b 0%, #27272a 50%, #f97316 100%)", colors: ["#f97316", "#18181b", "#fff7ed", "#09090b"], features: ["Infrastructure", "Scaling", "Security", "Compliance"] },
];

// Landlord themes
export const landlordThemes: PurposeTheme[] = [
  { id: "estate-manager", name: "Estate Manager", nameAr: "مدير العقارات", category: "Property Management", preview: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #3b82f6 100%)", colors: ["#2563eb", "#1e3a5f", "#eff6ff", "#172554"], features: ["Tenant Portal", "Rent Dashboard", "Lease Tracker", "Maintenance"], popular: true },
  { id: "rent-hub", name: "Rent Hub", nameAr: "رنت هب", category: "Rental Management", preview: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)", colors: ["#10b981", "#064e3b", "#ecfdf5", "#022c22"], features: ["Rent Collection", "Vacancy Board", "Tenant Screening", "Reports"], popular: true },
  { id: "landlord-pro", name: "Landlord Pro", nameAr: "لاندلورد برو", category: "Multi-Property", preview: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)", colors: ["#7c3aed", "#4c1d95", "#f5f3ff", "#2e1065"], features: ["Portfolio View", "ROI Calculator", "Insurance", "Tax Reports"], isNew: true },
  { id: "tenant-connect", name: "Tenant Connect", nameAr: "تينانت كونكت", category: "Tenant Relations", preview: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #38bdf8 100%)", colors: ["#0284c7", "#0c4a6e", "#f0f9ff", "#082f49"], features: ["Communication", "Payment Portal", "Maintenance Requests", "Documents"] },
];

// Education themes
export const educationThemes: PurposeTheme[] = [
  { id: "campus-bright", name: "Campus Bright", nameAr: "كامبس برايت", category: "Coaching Center", preview: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #3b82f6 100%)", colors: ["#2563eb", "#1e3a5f", "#eff6ff", "#172554"], features: ["Class Schedule", "Student Portal", "Fee Dashboard", "Attendance"], popular: true },
  { id: "scholar-green", name: "Scholar Green", nameAr: "سكولر جرين", category: "Tuition Center", preview: "linear-gradient(135deg, #14532d 0%, #166534 50%, #22c55e 100%)", colors: ["#22c55e", "#14532d", "#f0fdf4", "#052e16"], features: ["Batch Management", "Report Cards", "Parent Portal", "Exams"], popular: true },
  { id: "academy-pro", name: "Academy Pro", nameAr: "أكاديمي برو", category: "Language School", preview: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)", colors: ["#7c3aed", "#4c1d95", "#f5f3ff", "#2e1065"], features: ["Course Catalog", "Progress Tracking", "Certificates", "Live Classes"], isNew: true },
  { id: "skill-forge", name: "Skill Forge", nameAr: "سكيل فورج", category: "Skill Academy", preview: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #f97316 100%)", colors: ["#f97316", "#0c4a6e", "#fff7ed", "#431407"], features: ["Workshop Calendar", "Instructor Profiles", "Certifications", "Reviews"] },
];

// IOR themes
export const iorThemes: PurposeTheme[] = [
  { id: "global-sourcing", name: "Global Sourcing", nameAr: "التوريد العالمي", category: "Supply Chain", preview: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)", colors: ["#4338ca", "#1e1b4b", "#f5f3ff", "#1e1b4b"], features: ["Scraper Dashboard", "Duty Calculator", "Wallet Mgmt", "Logistics Hub"], popular: true },
  { id: "logistics-pro", name: "Logistics Pro", nameAr: "لوجستيك برو", category: "Operations", preview: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)", colors: ["#3b82f6", "#0f172a", "#f8fafc", "#1e293b"], features: ["Order Tracking", "HS Code Search", "Warehouse Mgmt", "Customs Docs"], popular: true },
];

export function getThemesForPurpose(purpose: BusinessPurpose): PurposeTheme[] {
  switch (purpose) {
    case "ecommerce": return ecommerceThemes;
    case "real-estate": return realEstateThemes;
    case "restaurant": return restaurantThemes;
    case "business-website": return businessWebsiteThemes;
    case "lms": return lmsThemes;
    case "healthcare": return healthcareThemes;
    case "fitness": return fitnessThemes;
    case "salon": return salonThemes;
    case "freelancer": return freelancerThemes;
    case "travel": return travelThemes;
    case "automotive": return automotiveThemes;
    case "event": return eventThemes;
    case "saas": return saasThemes;
    case "landlord": return landlordThemes;
    case "education": return educationThemes;
    case "cross-border-ior": return iorThemes;
    default: return ecommerceThemes;
  }
}

export const purposeStorefrontConfig: Record<BusinessPurpose, {
  title: string;
  description: string;
  customizerDefaults: {
    brandName: string;
    logo: string;
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    headingFont: string;
    bodyFont: string;
    fontSize: string;
    heroHeading: string;
    heroSubtext: string;
    heroImage: string;
    navStyle: "minimal" | "centered" | "sticky";
    gridColumns: 2 | 3 | 4;
    footerStyle: "simple" | "detailed" | "modern";
  };
}> = {
  ecommerce: {
    title: "Storefront Builder",
    description: "Design your multi-purpose retail store, choose themes, and manage your domain",
    customizerDefaults: {
      brandName: "My Saudi Store",
      logo: "",
      primaryColor: "#0d9488",
      accentColor: "#fbbf24",
      backgroundColor: "#ffffff",
      headingFont: "Inter",
      bodyFont: "Inter",
      fontSize: "16px",
      heroHeading: "Discover Premium Quality",
      heroSubtext: "Shop the latest trends with global shipping and secure payments.",
      heroImage: "/themes/ecommerce-hero.jpg",
      navStyle: "centered",
      gridColumns: 4,
      footerStyle: "modern"
    },
  },
  "real-estate": {
    title: "Property Site Builder",
    description: "Design your property website, choose themes, and manage your domain",
    customizerDefaults: {
      brandName: "Prime Properties",
      logo: "",
      primaryColor: "#1e293b",
      accentColor: "#0ea5e9",
      backgroundColor: "#f8fafc",
      headingFont: "Montserrat",
      bodyFont: "Open Sans",
      fontSize: "16px",
      heroHeading: "Find Your Forever Home",
      heroSubtext: "Explore luxury listings and affordable rentals in your city.",
      heroImage: "/themes/realestate-hero.jpg",
      navStyle: "sticky",
      gridColumns: 3,
      footerStyle: "detailed"
    },
  },
  restaurant: {
    title: "Restaurant Site Builder",
    description: "Design your restaurant website, choose themes, and manage your domain",
    customizerDefaults: {
      brandName: "My Restaurant",
      logo: "",
      primaryColor: "#dc2626",
      accentColor: "#fde047",
      backgroundColor: "#fffbeb",
      headingFont: "Playfair Display",
      bodyFont: "Lato",
      fontSize: "16px",
      heroHeading: "A Taste of Perfection",
      heroSubtext: "Reserve your table or order online",
      heroImage: "/themes/restaurant-hero.jpg",
      navStyle: "minimal",
      gridColumns: 2,
      footerStyle: "simple"
    },
  },
  "business-website": {
    title: "Website Builder",
    description: "Design your business website, choose themes, and manage your domain",
    customizerDefaults: {
      brandName: "My Business",
      logo: "",
      primaryColor: "#2563eb",
      accentColor: "#64748b",
      backgroundColor: "#ffffff",
      headingFont: "Roboto",
      bodyFont: "Roboto",
      fontSize: "16px",
      heroHeading: "Innovating the Future",
      heroSubtext: "Professional services you can trust",
      heroImage: "/themes/business-hero.jpg",
      navStyle: "sticky",
      gridColumns: 3,
      footerStyle: "modern"
    },
  },
  lms: {
    title: "Learning Platform Builder",
    description: "Design your learning platform, choose themes, and manage your domain",
    customizerDefaults: {
      brandName: "My Academy",
      logo: "",
      primaryColor: "#7c3aed",
      accentColor: "#10b981",
      backgroundColor: "#ffffff",
      headingFont: "Outfit",
      bodyFont: "Outfit",
      fontSize: "16px",
      heroHeading: "Learn Without Limits",
      heroSubtext: "Expert-led courses to advance your career",
      heroImage: "/themes/lms-hero.jpg",
      navStyle: "centered",
      gridColumns: 4,
      footerStyle: "detailed"
    },
  },
  healthcare: {
    title: "Healthcare Site Builder",
    description: "Design your clinic or healthcare website with appointment booking",
    customizerDefaults: {
      brandName: "My Clinic",
      logo: "",
      primaryColor: "#0891b2",
      accentColor: "#ec4899",
      backgroundColor: "#f0f9ff",
      headingFont: "Poppins",
      bodyFont: "Inter",
      fontSize: "16px",
      heroHeading: "Your Health, Our Priority",
      heroSubtext: "Book appointments with trusted specialists",
      heroImage: "/themes/healthcare-hero.jpg",
      navStyle: "sticky",
      gridColumns: 3,
      footerStyle: "modern"
    },
  },
  fitness: {
    title: "Fitness Site Builder",
    description: "Design your gym or fitness studio website with class scheduling",
    customizerDefaults: {
      brandName: "My Gym",
      logo: "",
      primaryColor: "#111827",
      accentColor: "#facc15",
      backgroundColor: "#ffffff",
      headingFont: "Bebas Neue",
      bodyFont: "Roboto Condensed",
      fontSize: "16px",
      heroHeading: "Transform your body",
      heroSubtext: "Join classes, track progress, achieve goals",
      heroImage: "/themes/fitness-hero.jpg",
      navStyle: "sticky",
      gridColumns: 3,
      footerStyle: "modern"
    },
  },
  salon: {
    title: "Salon & Spa Builder",
    description: "Design your beauty salon or spa website with online booking",
    customizerDefaults: {
      brandName: "My Salon",
      logo: "",
      primaryColor: "#db2777",
      accentColor: "#f9a8d4",
      backgroundColor: "#fffdfa",
      headingFont: "Cormorant Garamond",
      bodyFont: "Inter",
      fontSize: "16px",
      heroHeading: "Beauty starts here",
      heroSubtext: "Book your next appointment online",
      heroImage: "/themes/salon-hero.jpg",
      navStyle: "minimal",
      gridColumns: 2,
      footerStyle: "simple"
    },
  },
  freelancer: {
    title: "Portfolio Builder",
    description: "Design your freelancer or agency portfolio website",
    customizerDefaults: {
      brandName: "My Agency",
      logo: "",
      primaryColor: "#4f46e5",
      accentColor: "#f472b6",
      backgroundColor: "#0f172a",
      headingFont: "Plus Jakarta Sans",
      bodyFont: "Plus Jakarta Sans",
      fontSize: "16px",
      heroHeading: "Creative solutions that work",
      heroSubtext: "Award-winning design & development studio",
      heroImage: "/themes/freelance-hero.jpg",
      navStyle: "centered",
      gridColumns: 3,
      footerStyle: "modern"
    },
  },
  travel: {
    title: "Travel Site Builder",
    description: "Design your travel agency or tourism website with booking system",
    customizerDefaults: {
      brandName: "My Travel Agency",
      logo: "",
      primaryColor: "#059669",
      accentColor: "#fb923c",
      backgroundColor: "#ffffff",
      headingFont: "Lexend",
      bodyFont: "Inter",
      fontSize: "16px",
      heroHeading: "Explore the world",
      heroSubtext: "Curated trips and unforgettable experiences",
      heroImage: "/themes/travel-hero.jpg",
      navStyle: "sticky",
      gridColumns: 4,
      footerStyle: "detailed"
    },
  },
  automotive: {
    title: "Automotive Site Builder",
    description: "Design your car dealership or auto service website",
    customizerDefaults: {
      brandName: "My Auto",
      logo: "",
      primaryColor: "#b91c1c",
      accentColor: "#334155",
      backgroundColor: "#f1f5f9",
      headingFont: "Oswald",
      bodyFont: "Inter",
      fontSize: "16px",
      heroHeading: "Drive Your Dream Car",
      heroSubtext: "Browse our premium vehicle collection",
      heroImage: "/themes/auto-hero.jpg",
      navStyle: "sticky",
      gridColumns: 3,
      footerStyle: "modern"
    },
  },
  event: {
    title: "Event Site Builder",
    description: "Design your event planning or venue website",
    customizerDefaults: {
      brandName: "My Events",
      logo: "",
      primaryColor: "#2563eb",
      accentColor: "#8b5cf6",
      backgroundColor: "#fafafa",
      headingFont: "Space Grotesk",
      bodyFont: "Space Grotesk",
      fontSize: "16px",
      heroHeading: "Unforgettable moments",
      heroSubtext: "From concept to celebration, we make it happen",
      heroImage: "/themes/event-hero.jpg",
      navStyle: "centered",
      gridColumns: 2,
      footerStyle: "simple"
    },
  },
  saas: {
    title: "SaaS Landing Builder",
    description: "Design your SaaS product or digital platform website",
    customizerDefaults: {
      brandName: "My SaaS",
      logo: "",
      primaryColor: "#4338ca",
      accentColor: "#34d399",
      backgroundColor: "#ffffff",
      headingFont: "General Sans",
      bodyFont: "Inter",
      fontSize: "16px",
      heroHeading: "Supercharge your workflow",
      heroSubtext: "The all-in-one platform for modern teams",
      heroImage: "/themes/saas-hero.jpg",
      navStyle: "sticky",
      gridColumns: 3,
      footerStyle: "modern"
    },
  },
  landlord: {
    title: "Landlord Site Builder",
    description: "Design your property management website for tenants and listings",
    customizerDefaults: {
      brandName: "My Properties",
      logo: "",
      primaryColor: "#0f172a",
      accentColor: "#6366f1",
      backgroundColor: "#ffffff",
      headingFont: "Manrope",
      bodyFont: "Inter",
      fontSize: "16px",
      heroHeading: "Professional property management",
      heroSubtext: "Manage tenants, leases, and maintenance with ease",
      heroImage: "/themes/landlord-hero.jpg",
      navStyle: "sticky",
      gridColumns: 3,
      footerStyle: "modern"
    },
  },
  education: {
    title: "Education Site Builder",
    description: "Design your coaching center or academy website with class scheduling",
    customizerDefaults: {
      brandName: "My Academy",
      logo: "",
      primaryColor: "#1e3a8a",
      accentColor: "#facc15",
      backgroundColor: "#ffffff",
      headingFont: "Playfair Display",
      bodyFont: "Source Sans Pro",
      fontSize: "16px",
      heroHeading: "Shape the future through education",
      heroSubtext: "Enroll in expert-led classes and coaching programs",
      heroImage: "/themes/education-hero.jpg",
      navStyle: "sticky",
      gridColumns: 3,
      footerStyle: "modern"
    },
  },
  "cross-border-ior": {
    title: "IOR Operations Hub",
    description: "Configure your product sourcing tool, logistics management, and IOR compliance platform",
    customizerDefaults: {
      brandName: "IOR Global",
      logo: "",
      primaryColor: "#0f172a",
      accentColor: "#14b8a6",
      backgroundColor: "#020617",
      headingFont: "Plus Jakarta Sans",
      bodyFont: "Inter",
      fontSize: "16px",
      heroHeading: "Simplified Cross-Border Trade",
      heroSubtext: "Efficient sourcing and automated compliance for global commerce",
      heroImage: "/themes/ior-hero.jpg",
      navStyle: "minimal",
      gridColumns: 4,
      footerStyle: "modern"
    },
  },
};
