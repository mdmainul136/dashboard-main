import type { BusinessPurpose } from "@/hooks/useMerchantRegion";

// ── Metric Cards ──────────────────────────────────────────────

export const metricsData = [
  { title: "Customers", value: "3,782", change: 11.01, positive: true, icon: "users" },
  { title: "Orders", value: "5,359", change: 9.05, positive: false, icon: "shopping-cart" },
  { title: "Revenue", value: "$45,678", change: 15.3, positive: true, icon: "dollar-sign" },
  { title: "Growth Rate", value: "23.5%", change: 4.2, positive: true, icon: "trending-up" },
];

const websiteMetrics = [
  { title: "Visitors", value: "12,480", change: 18.2, positive: true, icon: "users" },
  { title: "Page Views", value: "38,920", change: 12.5, positive: true, icon: "file-text" },
  { title: "Leads", value: "284", change: 7.3, positive: true, icon: "target" },
  { title: "Bounce Rate", value: "32.4%", change: 3.1, positive: false, icon: "trending-down" },
];

const realEstateMetrics = [
  { title: "Active Listings", value: "147", change: 8.5, positive: true, icon: "building" },
  { title: "Inquiries", value: "892", change: 14.2, positive: true, icon: "message-circle" },
  { title: "Site Visits", value: "6,340", change: 11.0, positive: true, icon: "users" },
  { title: "Avg. Price", value: "$425K", change: 2.8, positive: true, icon: "dollar-sign" },
];

const restaurantMetrics = [
  { title: "Menu Views", value: "8,640", change: 22.1, positive: true, icon: "utensils" },
  { title: "Reservations", value: "312", change: 9.8, positive: true, icon: "calendar" },
  { title: "Online Orders", value: "1,205", change: 15.4, positive: true, icon: "shopping-cart" },
  { title: "Avg. Rating", value: "4.7★", change: 0.3, positive: true, icon: "star" },
];

const healthcareMetrics = [
  { title: "Patients", value: "2,480", change: 12.3, positive: true, icon: "heart" },
  { title: "Appointments", value: "1,856", change: 8.7, positive: true, icon: "calendar" },
  { title: "Revenue", value: "$128K", change: 15.1, positive: true, icon: "dollar-sign" },
  { title: "Satisfaction", value: "4.8★", change: 0.2, positive: true, icon: "star" },
];

const fitnessMetrics = [
  { title: "Members", value: "1,240", change: 14.5, positive: true, icon: "users" },
  { title: "Classes/Week", value: "48", change: 6.2, positive: true, icon: "calendar" },
  { title: "Revenue", value: "$34K", change: 11.8, positive: true, icon: "dollar-sign" },
  { title: "Retention", value: "87%", change: 3.4, positive: true, icon: "trending-up" },
];

const salonMetrics = [
  { title: "Clients", value: "980", change: 9.2, positive: true, icon: "users" },
  { title: "Bookings", value: "1,450", change: 13.6, positive: true, icon: "calendar" },
  { title: "Revenue", value: "$28K", change: 10.4, positive: true, icon: "dollar-sign" },
  { title: "Avg. Rating", value: "4.9★", change: 0.1, positive: true, icon: "star" },
];

const freelancerMetrics = [
  { title: "Projects", value: "32", change: 18.5, positive: true, icon: "briefcase" },
  { title: "Clients", value: "24", change: 12.0, positive: true, icon: "users" },
  { title: "Revenue", value: "$52K", change: 22.3, positive: true, icon: "dollar-sign" },
  { title: "Inquiries", value: "156", change: 8.9, positive: true, icon: "message-circle" },
];

const travelMetrics = [
  { title: "Bookings", value: "847", change: 16.4, positive: true, icon: "calendar" },
  { title: "Travelers", value: "2,340", change: 11.2, positive: true, icon: "users" },
  { title: "Revenue", value: "$195K", change: 19.8, positive: true, icon: "dollar-sign" },
  { title: "Avg. Rating", value: "4.6★", change: 0.3, positive: true, icon: "star" },
];

const automotiveMetrics = [
  { title: "Vehicles", value: "234", change: 7.8, positive: true, icon: "car" },
  { title: "Leads", value: "1,120", change: 14.3, positive: true, icon: "message-circle" },
  { title: "Revenue", value: "$890K", change: 9.5, positive: true, icon: "dollar-sign" },
  { title: "Test Drives", value: "186", change: 12.1, positive: true, icon: "calendar" },
];

const eventMetrics = [
  { title: "Events", value: "78", change: 22.0, positive: true, icon: "calendar" },
  { title: "RSVPs", value: "4,560", change: 18.4, positive: true, icon: "users" },
  { title: "Revenue", value: "$156K", change: 14.7, positive: true, icon: "dollar-sign" },
  { title: "Vendors", value: "120", change: 8.3, positive: true, icon: "building" },
];

const saasMetrics = [
  { title: "Users", value: "5,840", change: 24.6, positive: true, icon: "users" },
  { title: "MRR", value: "$42K", change: 18.2, positive: true, icon: "dollar-sign" },
  { title: "Churn", value: "2.1%", change: 0.5, positive: false, icon: "trending-down" },
  { title: "NPS", value: "72", change: 4.8, positive: true, icon: "trending-up" },
];

const lmsMetrics = [
  { title: "Students", value: "3,240", change: 15.8, positive: true, icon: "users" },
  { title: "Courses", value: "86", change: 10.2, positive: true, icon: "book" },
  { title: "Revenue", value: "$67K", change: 20.4, positive: true, icon: "dollar-sign" },
  { title: "Completion", value: "74%", change: 5.1, positive: true, icon: "trending-up" },
];

const landlordMetrics = [
  { title: "Properties", value: "24", change: 8.3, positive: true, icon: "building" },
  { title: "Occupancy", value: "92%", change: 3.1, positive: true, icon: "trending-up" },
  { title: "Rent Collected", value: "$48K", change: 12.5, positive: true, icon: "dollar-sign" },
  { title: "Maintenance", value: "7", change: 2.0, positive: false, icon: "trending-down" },
];

const educationMetrics = [
  { title: "Students", value: "1,580", change: 16.4, positive: true, icon: "users" },
  { title: "Active Classes", value: "42", change: 8.7, positive: true, icon: "calendar" },
  { title: "Fee Collected", value: "$38K", change: 14.2, positive: true, icon: "dollar-sign" },
  { title: "Attendance", value: "91%", change: 2.3, positive: true, icon: "trending-up" },
];

const iorMetrics = [
  { title: "Active Shipments", value: "342", change: 18.5, positive: true, icon: "truck" },
  { title: "Pending Customs", value: "12", change: 5.2, positive: false, icon: "shield" },
  { title: "Revenue (MTD)", value: "$64K", change: 12.8, positive: true, icon: "dollar-sign" },
  { title: "Compliance Rate", value: "98.5%", change: 1.2, positive: true, icon: "check-circle" },
];

export const getMetricsByPurpose = (purpose: BusinessPurpose | null): typeof metricsData => {
  switch (purpose) {
    case "business-website": return websiteMetrics;
    case "real-estate": return realEstateMetrics;
    case "restaurant": return restaurantMetrics;
    case "healthcare": return healthcareMetrics;
    case "fitness": return fitnessMetrics;
    case "salon": return salonMetrics;
    case "freelancer": return freelancerMetrics;
    case "travel": return travelMetrics;
    case "automotive": return automotiveMetrics;
    case "event": return eventMetrics;
    case "saas": return saasMetrics;
    case "lms": return lmsMetrics;
    case "landlord": return landlordMetrics;
    case "education": return educationMetrics;
    case "cross-border-ior": return iorMetrics;
    default: return metricsData;
  }
};

// ── Monthly Sales Data ──────────────────────────────────────────

export const monthlySalesData = [
  { month: "Jan", sales: 168 }, { month: "Feb", sales: 385 }, { month: "Mar", sales: 201 },
  { month: "Apr", sales: 298 }, { month: "May", sales: 187 }, { month: "Jun", sales: 195 },
  { month: "Jul", sales: 295 }, { month: "Aug", sales: 110 }, { month: "Sep", sales: 215 },
  { month: "Oct", sales: 250 }, { month: "Nov", sales: 380 }, { month: "Dec", sales: 320 },
];

const purposeMonthlySales: Record<string, typeof monthlySalesData> = {
  "business-website": [
    { month: "Jan", sales: 820 }, { month: "Feb", sales: 1250 }, { month: "Mar", sales: 980 },
    { month: "Apr", sales: 1480 }, { month: "May", sales: 1100 }, { month: "Jun", sales: 1320 },
    { month: "Jul", sales: 1580 }, { month: "Aug", sales: 900 }, { month: "Sep", sales: 1200 },
    { month: "Oct", sales: 1450 }, { month: "Nov", sales: 1680 }, { month: "Dec", sales: 1900 },
  ],
  "real-estate": [
    { month: "Jan", sales: 12 }, { month: "Feb", sales: 18 }, { month: "Mar", sales: 15 },
    { month: "Apr", sales: 22 }, { month: "May", sales: 19 }, { month: "Jun", sales: 25 },
    { month: "Jul", sales: 28 }, { month: "Aug", sales: 14 }, { month: "Sep", sales: 20 },
    { month: "Oct", sales: 24 }, { month: "Nov", sales: 30 }, { month: "Dec", sales: 26 },
  ],
  restaurant: [
    { month: "Jan", sales: 420 }, { month: "Feb", sales: 580 }, { month: "Mar", sales: 510 },
    { month: "Apr", sales: 640 }, { month: "May", sales: 720 }, { month: "Jun", sales: 850 },
    { month: "Jul", sales: 920 }, { month: "Aug", sales: 780 }, { month: "Sep", sales: 680 },
    { month: "Oct", sales: 590 }, { month: "Nov", sales: 710 }, { month: "Dec", sales: 960 },
  ],
  healthcare: [
    { month: "Jan", sales: 180 }, { month: "Feb", sales: 220 }, { month: "Mar", sales: 260 },
    { month: "Apr", sales: 310 }, { month: "May", sales: 290 }, { month: "Jun", sales: 340 },
    { month: "Jul", sales: 380 }, { month: "Aug", sales: 250 }, { month: "Sep", sales: 320 },
    { month: "Oct", sales: 360 }, { month: "Nov", sales: 400 }, { month: "Dec", sales: 350 },
  ],
  fitness: [
    { month: "Jan", sales: 320 }, { month: "Feb", sales: 280 }, { month: "Mar", sales: 350 },
    { month: "Apr", sales: 410 }, { month: "May", sales: 480 }, { month: "Jun", sales: 520 },
    { month: "Jul", sales: 490 }, { month: "Aug", sales: 380 }, { month: "Sep", sales: 560 },
    { month: "Oct", sales: 440 }, { month: "Nov", sales: 370 }, { month: "Dec", sales: 290 },
  ],
  salon: [
    { month: "Jan", sales: 140 }, { month: "Feb", sales: 190 }, { month: "Mar", sales: 220 },
    { month: "Apr", sales: 260 }, { month: "May", sales: 310 }, { month: "Jun", sales: 340 },
    { month: "Jul", sales: 290 }, { month: "Aug", sales: 250 }, { month: "Sep", sales: 300 },
    { month: "Oct", sales: 280 }, { month: "Nov", sales: 350 }, { month: "Dec", sales: 380 },
  ],
  freelancer: [
    { month: "Jan", sales: 3200 }, { month: "Feb", sales: 4500 }, { month: "Mar", sales: 2800 },
    { month: "Apr", sales: 5100 }, { month: "May", sales: 3900 }, { month: "Jun", sales: 6200 },
    { month: "Jul", sales: 4800 }, { month: "Aug", sales: 3500 }, { month: "Sep", sales: 5600 },
    { month: "Oct", sales: 4200 }, { month: "Nov", sales: 7100 }, { month: "Dec", sales: 5800 },
  ],
  travel: [
    { month: "Jan", sales: 45 }, { month: "Feb", sales: 38 }, { month: "Mar", sales: 62 },
    { month: "Apr", sales: 85 }, { month: "May", sales: 110 }, { month: "Jun", sales: 145 },
    { month: "Jul", sales: 168 }, { month: "Aug", sales: 155 }, { month: "Sep", sales: 98 },
    { month: "Oct", sales: 72 }, { month: "Nov", sales: 55 }, { month: "Dec", sales: 130 },
  ],
  automotive: [
    { month: "Jan", sales: 18 }, { month: "Feb", sales: 24 }, { month: "Mar", sales: 22 },
    { month: "Apr", sales: 30 }, { month: "May", sales: 28 }, { month: "Jun", sales: 35 },
    { month: "Jul", sales: 32 }, { month: "Aug", sales: 20 }, { month: "Sep", sales: 26 },
    { month: "Oct", sales: 38 }, { month: "Nov", sales: 42 }, { month: "Dec", sales: 36 },
  ],
  event: [
    { month: "Jan", sales: 5 }, { month: "Feb", sales: 8 }, { month: "Mar", sales: 12 },
    { month: "Apr", sales: 15 }, { month: "May", sales: 18 }, { month: "Jun", sales: 22 },
    { month: "Jul", sales: 14 }, { month: "Aug", sales: 10 }, { month: "Sep", sales: 16 },
    { month: "Oct", sales: 20 }, { month: "Nov", sales: 25 }, { month: "Dec", sales: 28 },
  ],
  saas: [
    { month: "Jan", sales: 28 }, { month: "Feb", sales: 31 }, { month: "Mar", sales: 34 },
    { month: "Apr", sales: 36 }, { month: "May", sales: 38 }, { month: "Jun", sales: 40 },
    { month: "Jul", sales: 42 }, { month: "Aug", sales: 41 }, { month: "Sep", sales: 44 },
    { month: "Oct", sales: 46 }, { month: "Nov", sales: 48 }, { month: "Dec", sales: 52 },
  ],
  lms: [
    { month: "Jan", sales: 240 }, { month: "Feb", sales: 310 }, { month: "Mar", sales: 380 },
    { month: "Apr", sales: 420 }, { month: "May", sales: 350 }, { month: "Jun", sales: 280 },
    { month: "Jul", sales: 190 }, { month: "Aug", sales: 260 }, { month: "Sep", sales: 480 },
    { month: "Oct", sales: 520 }, { month: "Nov", sales: 410 }, { month: "Dec", sales: 340 },
  ],
  landlord: [
    { month: "Jan", sales: 42 }, { month: "Feb", sales: 44 }, { month: "Mar", sales: 45 },
    { month: "Apr", sales: 46 }, { month: "May", sales: 47 }, { month: "Jun", sales: 48 },
    { month: "Jul", sales: 48 }, { month: "Aug", sales: 47 }, { month: "Sep", sales: 48 },
    { month: "Oct", sales: 49 }, { month: "Nov", sales: 50 }, { month: "Dec", sales: 52 },
  ],
  "cross-border-ior": [
    { month: "Jan", sales: 120 }, { month: "Feb", sales: 185 }, { month: "Mar", sales: 240 },
    { month: "Apr", sales: 310 }, { month: "May", sales: 280 }, { month: "Jun", sales: 340 },
    { month: "Jul", sales: 420 }, { month: "Aug", sales: 380 }, { month: "Sep", sales: 450 },
    { month: "Oct", sales: 520 }, { month: "Nov", sales: 580 }, { month: "Dec", sales: 640 },
  ],
};

export const getMonthlySalesByPurpose = (purpose: BusinessPurpose | null) =>
  purposeMonthlySales[purpose || ""] || monthlySalesData;

// ── Statistics Data ──────────────────────────────────────────

export const statisticsData = [
  { name: "Mon", received: 200, due: 130 }, { name: "Tue", received: 300, due: 200 },
  { name: "Wed", received: 250, due: 180 }, { name: "Thu", received: 400, due: 280 },
  { name: "Fri", received: 350, due: 250 }, { name: "Sat", received: 320, due: 200 },
  { name: "Sun", received: 380, due: 300 },
];

const purposeStatistics: Record<string, { data: typeof statisticsData; labels: [string, string] }> = {
  "business-website": {
    data: [
      { name: "Mon", received: 1200, due: 340 }, { name: "Tue", received: 1800, due: 520 },
      { name: "Wed", received: 1500, due: 410 }, { name: "Thu", received: 2200, due: 680 },
      { name: "Fri", received: 1900, due: 560 }, { name: "Sat", received: 800, due: 220 },
      { name: "Sun", received: 600, due: 180 },
    ],
    labels: ["Visitors", "Bounces"],
  },
  "real-estate": {
    data: [
      { name: "Mon", received: 45, due: 12 }, { name: "Tue", received: 62, due: 18 },
      { name: "Wed", received: 38, due: 10 }, { name: "Thu", received: 75, due: 22 },
      { name: "Fri", received: 58, due: 15 }, { name: "Sat", received: 90, due: 28 },
      { name: "Sun", received: 72, due: 20 },
    ],
    labels: ["Inquiries", "Pending"],
  },
  restaurant: {
    data: [
      { name: "Mon", received: 85, due: 12 }, { name: "Tue", received: 120, due: 18 },
      { name: "Wed", received: 105, due: 15 }, { name: "Thu", received: 145, due: 22 },
      { name: "Fri", received: 210, due: 30 }, { name: "Sat", received: 280, due: 35 },
      { name: "Sun", received: 240, due: 28 },
    ],
    labels: ["Orders", "Cancellations"],
  },
  healthcare: {
    data: [
      { name: "Mon", received: 42, due: 8 }, { name: "Tue", received: 55, due: 12 },
      { name: "Wed", received: 48, due: 10 }, { name: "Thu", received: 60, due: 14 },
      { name: "Fri", received: 52, due: 11 }, { name: "Sat", received: 30, due: 5 },
      { name: "Sun", received: 15, due: 3 },
    ],
    labels: ["Appointments", "No-shows"],
  },
  fitness: {
    data: [
      { name: "Mon", received: 120, due: 85 }, { name: "Tue", received: 95, due: 70 },
      { name: "Wed", received: 140, due: 100 }, { name: "Thu", received: 110, due: 80 },
      { name: "Fri", received: 130, due: 95 }, { name: "Sat", received: 160, due: 120 },
      { name: "Sun", received: 80, due: 50 },
    ],
    labels: ["Check-ins", "Capacity"],
  },
  salon: {
    data: [
      { name: "Mon", received: 18, due: 4 }, { name: "Tue", received: 25, due: 6 },
      { name: "Wed", received: 22, due: 5 }, { name: "Thu", received: 30, due: 7 },
      { name: "Fri", received: 38, due: 8 }, { name: "Sat", received: 45, due: 10 },
      { name: "Sun", received: 12, due: 2 },
    ],
    labels: ["Bookings", "Cancellations"],
  },
  freelancer: {
    data: [
      { name: "Mon", received: 8, due: 3 }, { name: "Tue", received: 12, due: 5 },
      { name: "Wed", received: 10, due: 4 }, { name: "Thu", received: 15, due: 6 },
      { name: "Fri", received: 11, due: 4 }, { name: "Sat", received: 5, due: 2 },
      { name: "Sun", received: 3, due: 1 },
    ],
    labels: ["Tasks Done", "Overdue"],
  },
  travel: {
    data: [
      { name: "Mon", received: 15, due: 5 }, { name: "Tue", received: 22, due: 8 },
      { name: "Wed", received: 18, due: 6 }, { name: "Thu", received: 28, due: 10 },
      { name: "Fri", received: 35, due: 12 }, { name: "Sat", received: 42, due: 14 },
      { name: "Sun", received: 38, due: 11 },
    ],
    labels: ["Bookings", "Cancellations"],
  },
  automotive: {
    data: [
      { name: "Mon", received: 12, due: 4 }, { name: "Tue", received: 18, due: 6 },
      { name: "Wed", received: 15, due: 5 }, { name: "Thu", received: 22, due: 8 },
      { name: "Fri", received: 20, due: 7 }, { name: "Sat", received: 28, due: 10 },
      { name: "Sun", received: 8, due: 3 },
    ],
    labels: ["Test Drives", "Follow-ups"],
  },
  event: {
    data: [
      { name: "Mon", received: 120, due: 45 }, { name: "Tue", received: 180, due: 60 },
      { name: "Wed", received: 150, due: 52 }, { name: "Thu", received: 220, due: 75 },
      { name: "Fri", received: 280, due: 90 }, { name: "Sat", received: 350, due: 110 },
      { name: "Sun", received: 200, due: 65 },
    ],
    labels: ["Registrations", "Pending"],
  },
  saas: {
    data: [
      { name: "Mon", received: 85, due: 12 }, { name: "Tue", received: 120, due: 18 },
      { name: "Wed", received: 95, due: 14 }, { name: "Thu", received: 140, due: 20 },
      { name: "Fri", received: 110, due: 16 }, { name: "Sat", received: 60, due: 8 },
      { name: "Sun", received: 45, due: 6 },
    ],
    labels: ["Sign-ups", "Churned"],
  },
  lms: {
    data: [
      { name: "Mon", received: 180, due: 45 }, { name: "Tue", received: 220, due: 55 },
      { name: "Wed", received: 200, due: 50 }, { name: "Thu", received: 260, due: 65 },
      { name: "Fri", received: 190, due: 48 }, { name: "Sat", received: 140, due: 35 },
      { name: "Sun", received: 100, due: 25 },
    ],
    labels: ["Enrollments", "Dropouts"],
  },
  landlord: {
    data: [
      { name: "Mon", received: 3, due: 1 }, { name: "Tue", received: 5, due: 2 },
      { name: "Wed", received: 4, due: 1 }, { name: "Thu", received: 6, due: 2 },
      { name: "Fri", received: 5, due: 1 }, { name: "Sat", received: 2, due: 0 },
      { name: "Sun", received: 1, due: 0 },
    ],
    labels: ["Rent Payments", "Overdue"],
  },
  "cross-border-ior": {
    data: [
      { name: "Mon", received: 45, due: 12 }, { name: "Tue", received: 58, due: 15 },
      { name: "Wed", received: 52, due: 14 }, { name: "Thu", received: 65, due: 18 },
      { name: "Fri", received: 72, due: 20 }, { name: "Sat", received: 40, due: 10 },
      { name: "Sun", received: 25, due: 8 },
    ],
    labels: ["Shipments", "Customs Holds"],
  },
};

export const getStatisticsByPurpose = (purpose: BusinessPurpose | null) => {
  const entry = purposeStatistics[purpose || ""];
  return entry || { data: statisticsData, labels: ["Received Amount", "Due Amount"] as [string, string] };
};

// ── Monthly Target Data ──────────────────────────────────────

interface TargetData {
  percentage: number;
  todayEarned: string;
  target: string;
  revenue: string;
  today: string;
  label: string;
}

const defaultTarget: TargetData = {
  percentage: 75.55, todayEarned: "$3,287", target: "$20K", revenue: "$20K", today: "$3.2K", label: "Monthly Target",
};

const purposeTargets: Record<string, TargetData> = {
  "business-website": { percentage: 68.2, todayEarned: "1,240 visits", target: "50K visits", revenue: "34K visits", today: "1.2K", label: "Traffic Target" },
  "real-estate": { percentage: 82.1, todayEarned: "3 deals", target: "30 deals", revenue: "24 deals", today: "3", label: "Closing Target" },
  restaurant: { percentage: 71.3, todayEarned: "$2,840", target: "$25K", revenue: "$17.8K", today: "$2.8K", label: "Revenue Target" },
  healthcare: { percentage: 78.9, todayEarned: "48 patients", target: "800 patients", revenue: "632 patients", today: "48", label: "Patient Target" },
  fitness: { percentage: 85.2, todayEarned: "32 check-ins", target: "1,500 monthly", revenue: "1,278", today: "32", label: "Member Target" },
  salon: { percentage: 69.8, todayEarned: "14 bookings", target: "600 monthly", revenue: "419", today: "14", label: "Booking Target" },
  freelancer: { percentage: 62.4, todayEarned: "$1,850", target: "$8K", revenue: "$5K", today: "$1.8K", label: "Income Target" },
  travel: { percentage: 73.6, todayEarned: "12 bookings", target: "200 monthly", revenue: "147", today: "12", label: "Booking Target" },
  automotive: { percentage: 58.3, todayEarned: "4 leads", target: "120 monthly", revenue: "70", today: "4", label: "Sales Target" },
  event: { percentage: 88.5, todayEarned: "340 RSVPs", target: "5K RSVPs", revenue: "4,425", today: "340", label: "Registration Target" },
  saas: { percentage: 91.2, todayEarned: "$1,420 MRR", target: "$46K MRR", revenue: "$42K", today: "$1.4K", label: "MRR Target" },
  education: { percentage: 74.1, todayEarned: "86 enrollments", target: "4K monthly", revenue: "2,964", today: "86", label: "Enrollment Target" },
  landlord: { percentage: 92.0, todayEarned: "$4,200", target: "$48K", revenue: "$44.2K", today: "$4.2K", label: "Rent Collection Target" },
  "cross-border-ior": { percentage: 84.5, todayEarned: "12 shipments", target: "500 monthly", revenue: "422", today: "12", label: "Operations Target" },
};

export const getTargetByPurpose = (purpose: BusinessPurpose | null): TargetData =>
  purposeTargets[purpose || ""] || defaultTarget;

// ── Monthly Sales Chart Config ──────────────────────────────

interface ChartConfig {
  title: string;
  subtitle: string;
  dataKey: string;
}

const defaultChartConfig: ChartConfig = { title: "Monthly Sales", subtitle: "Revenue overview by month", dataKey: "sales" };

const purposeChartConfigs: Record<string, ChartConfig> = {
  "business-website": { title: "Monthly Traffic", subtitle: "Visitor trends by month", dataKey: "sales" },
  "real-estate": { title: "Monthly Deals", subtitle: "Closings by month", dataKey: "sales" },
  restaurant: { title: "Monthly Orders", subtitle: "Order volume by month", dataKey: "sales" },
  healthcare: { title: "Monthly Appointments", subtitle: "Patient visits by month", dataKey: "sales" },
  fitness: { title: "Monthly Members", subtitle: "Active membership by month", dataKey: "sales" },
  salon: { title: "Monthly Bookings", subtitle: "Appointment trends by month", dataKey: "sales" },
  freelancer: { title: "Monthly Earnings", subtitle: "Income by month ($)", dataKey: "sales" },
  travel: { title: "Monthly Bookings", subtitle: "Tour bookings by month", dataKey: "sales" },
  automotive: { title: "Monthly Sales", subtitle: "Vehicle sales by month", dataKey: "sales" },
  event: { title: "Monthly Events", subtitle: "Events hosted by month", dataKey: "sales" },
  saas: { title: "Monthly MRR", subtitle: "Recurring revenue ($K)", dataKey: "sales" },
  lms: { title: "Monthly Enrollments", subtitle: "Student enrollments by month", dataKey: "sales" },
  landlord: { title: "Monthly Rent", subtitle: "Rent collected ($K)", dataKey: "sales" },
  "cross-border-ior": { title: "Monthly Logistics", subtitle: "Shipment volume by month", dataKey: "sales" },
};

export const getChartConfigByPurpose = (purpose: BusinessPurpose | null): ChartConfig =>
  purposeChartConfigs[purpose || ""] || defaultChartConfig;

// ── Statistics Chart Config ──────────────────────────────────

const defaultStatsTabs = ["Overview", "Sales", "Revenue"];

const purposeStatsTabs: Record<string, string[]> = {
  "business-website": ["Overview", "Traffic", "Conversions"],
  "real-estate": ["Overview", "Inquiries", "Closings"],
  restaurant: ["Overview", "Dine-in", "Delivery"],
  healthcare: ["Overview", "Appointments", "Revenue"],
  fitness: ["Overview", "Attendance", "Revenue"],
  salon: ["Overview", "Services", "Revenue"],
  freelancer: ["Overview", "Projects", "Income"],
  travel: ["Overview", "Bookings", "Revenue"],
  automotive: ["Overview", "Leads", "Sales"],
  event: ["Overview", "Registrations", "Revenue"],
  saas: ["Overview", "Growth", "Churn"],
  lms: ["Overview", "Enrollments", "Completion"],
  landlord: ["Overview", "Rent", "Maintenance"],
  "cross-border-ior": ["Overview", "Shipments", "Compliance"],
};

export const getStatsTabsByPurpose = (purpose: BusinessPurpose | null): string[] =>
  purposeStatsTabs[purpose || ""] || defaultStatsTabs;

// ── Table & Profile (unchanged) ──────────────────────────────

export const tableData = [
  { id: 1, name: "Musharof Chy", email: "musharof@example.com", role: "Admin", status: "Active", avatar: "" },
  { id: 2, name: "Naimur Rahman", email: "naimur@example.com", role: "Manager", status: "Active", avatar: "" },
  { id: 3, name: "Shafiq Hammad", email: "shafiq@example.com", role: "Developer", status: "Inactive", avatar: "" },
  { id: 4, name: "Jhon Abraham", email: "jhon@example.com", role: "Designer", status: "Active", avatar: "" },
  { id: 5, name: "Alex Doe", email: "alex@example.com", role: "Developer", status: "Active", avatar: "" },
  { id: 6, name: "Sarah Smith", email: "sarah@example.com", role: "Manager", status: "Active", avatar: "" },
  { id: 7, name: "David Wilson", email: "david@example.com", role: "Developer", status: "Inactive", avatar: "" },
  { id: 8, name: "Emily Brown", email: "emily@example.com", role: "Designer", status: "Active", avatar: "" },
  { id: 9, name: "Michael Lee", email: "michael@example.com", role: "Admin", status: "Active", avatar: "" },
  { id: 10, name: "Lisa Wang", email: "lisa@example.com", role: "Developer", status: "Active", avatar: "" },
];

export const profileData = {
  name: "Musharof Chowdhury",
  role: "Team Manager",
  location: "Arizona, United States",
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere fermentum urna, eu condimentum mauris tempus ut.",
  email: "musharof@example.com",
  phone: "+09 345 346 46",
  firstName: "Musharof",
  lastName: "Chowdhury",
  country: "United States",
  city: "Arizona",
  postalCode: "85001",
  taxId: "AS45568780",
};
