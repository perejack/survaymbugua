export interface SurveyCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  taskCount: number;
}

export interface SurveyTask {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  questions: number;
  duration: string;
  reward: number;
  isPremium: boolean;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  options: string[];
}

export const categories: SurveyCategory[] = [
  { id: "food", name: "Food & Beverages", icon: "🍽️", color: "primary", taskCount: 8 },
  { id: "tech", name: "Technology", icon: "📱", color: "primary", taskCount: 6 },
  { id: "fashion", name: "Fashion & Style", icon: "👗", color: "primary", taskCount: 5 },
  { id: "finance", name: "Finance & M-Pesa", icon: "💰", color: "primary", taskCount: 7 },
  { id: "transport", name: "Transport", icon: "🚌", color: "primary", taskCount: 4 },
  { id: "entertainment", name: "Entertainment", icon: "🎬", color: "primary", taskCount: 6 },
  { id: "health", name: "Health & Wellness", icon: "💪", color: "primary", taskCount: 5 },
  { id: "shopping", name: "Shopping Habits", icon: "🛒", color: "primary", taskCount: 7 },
];

export const surveyTasks: SurveyTask[] = [
  { id: "t1", categoryId: "food", title: "Beverage Preferences", description: "Share your favorite drink choices", questions: 5, duration: "1 min", reward: 150, isPremium: false },
  { id: "t2", categoryId: "food", title: "Fast Food Habits", description: "Tell us about your dining habits", questions: 6, duration: "2 min", reward: 150, isPremium: false },
  { id: "t3", categoryId: "food", title: "Cooking Preferences", description: "Home cooking vs eating out", questions: 5, duration: "1 min", reward: 170, isPremium: false },
  { id: "t4", categoryId: "tech", title: "Smartphone Usage", description: "How you use your phone daily", questions: 5, duration: "1 min", reward: 150, isPremium: false },
  { id: "t5", categoryId: "tech", title: "App Preferences", description: "Your favorite mobile apps", questions: 6, duration: "2 min", reward: 200, isPremium: false },
  { id: "t6", categoryId: "tech", title: "Internet Habits", description: "How you browse online", questions: 5, duration: "1 min", reward: 300, isPremium: true },
  { id: "t7", categoryId: "fashion", title: "Style Preferences", description: "Your fashion choices", questions: 5, duration: "1 min", reward: 150, isPremium: false },
  { id: "t8", categoryId: "fashion", title: "Brand Awareness", description: "Brands you know and love", questions: 6, duration: "2 min", reward: 400, isPremium: true },
  { id: "t9", categoryId: "finance", title: "M-Pesa Usage", description: "How you use mobile money", questions: 5, duration: "1 min", reward: 190, isPremium: false },
  { id: "t10", categoryId: "finance", title: "Savings Habits", description: "Your saving patterns", questions: 5, duration: "1 min", reward: 220, isPremium: false },
  { id: "t11", categoryId: "transport", title: "Commute Survey", description: "Your daily commute details", questions: 5, duration: "1 min", reward: 180, isPremium: false },
  { id: "t12", categoryId: "entertainment", title: "Music Preferences", description: "Your music taste", questions: 5, duration: "1 min", reward: 160, isPremium: false },
  { id: "t13", categoryId: "entertainment", title: "Streaming Habits", description: "How you watch content", questions: 6, duration: "2 min", reward: 300, isPremium: true },
  { id: "t14", categoryId: "health", title: "Fitness Routine", description: "Your exercise habits", questions: 5, duration: "1 min", reward: 210, isPremium: false },
  { id: "t15", categoryId: "shopping", title: "Online Shopping", description: "E-commerce preferences", questions: 5, duration: "1 min", reward: 150, isPremium: false },
  { id: "t16", categoryId: "shopping", title: "Market Habits", description: "Where you shop locally", questions: 5, duration: "1 min", reward: 140, isPremium: false },
];

export const surveyQuestions: Record<string, SurveyQuestion[]> = {
  t1: [
    { id: "q1", question: "What's your go-to morning beverage?", options: ["Tea (Chai)", "Coffee", "Juice", "Water"] },
    { id: "q2", question: "How often do you buy soft drinks?", options: ["Daily", "2-3 times a week", "Weekly", "Rarely"] },
    { id: "q3", question: "Where do you mostly buy beverages?", options: ["Supermarket", "Kiosk/Duka", "Restaurant", "Online"] },
    { id: "q4", question: "What matters most when choosing a drink?", options: ["Price", "Taste", "Brand", "Health benefits"] },
    { id: "q5", question: "Would you try a new drink brand?", options: ["Definitely yes", "Maybe", "Only if recommended", "Probably not"] },
  ],
  t2: [
    { id: "q1", question: "How often do you eat fast food?", options: ["Daily", "2-3 times a week", "Once a week", "Rarely"] },
    { id: "q2", question: "Favourite fast food?", options: ["Chicken & Chips", "Pizza", "Burger", "Nyama Choma"] },
    { id: "q3", question: "Preferred restaurant chain?", options: ["KFC", "Chicken Inn", "Galitos", "Local Joint"] },
    { id: "q4", question: "Do you order food delivery?", options: ["Yes, often", "Sometimes", "Rarely", "Never"] },
    { id: "q5", question: "Average spend on fast food?", options: ["Under 300 KSH", "300-500 KSH", "500-1000 KSH", "Over 1000 KSH"] },
    { id: "q6", question: "What influences your choice?", options: ["Price", "Quality", "Speed", "Location"] },
  ],
  t4: [
    { id: "q1", question: "What phone brand do you use?", options: ["Samsung", "Tecno/Infinix", "iPhone", "Other"] },
    { id: "q2", question: "Daily screen time?", options: ["Under 2 hours", "2-4 hours", "4-6 hours", "6+ hours"] },
    { id: "q3", question: "Most used app category?", options: ["Social Media", "Finance", "Entertainment", "Productivity"] },
    { id: "q4", question: "How often do you upgrade phones?", options: ["Every year", "Every 2 years", "Every 3+ years", "When it breaks"] },
    { id: "q5", question: "Mobile data provider?", options: ["Safaricom", "Airtel", "Telkom", "Multiple"] },
  ],
  t9: [
    { id: "q1", question: "How often do you use M-Pesa?", options: ["Multiple daily", "Daily", "Few times a week", "Weekly"] },
    { id: "q2", question: "Primary M-Pesa use?", options: ["Sending money", "Paying bills", "Savings (M-Shwari)", "Business"] },
    { id: "q3", question: "Average daily M-Pesa transactions?", options: ["1-2", "3-5", "6-10", "More than 10"] },
    { id: "q4", question: "Do you use Fuliza?", options: ["Yes, regularly", "Sometimes", "Rarely", "Never"] },
    { id: "q5", question: "Preferred payment method?", options: ["M-Pesa", "Cash", "Bank Card", "Mixed"] },
  ],
  t11: [
    { id: "q1", question: "Primary mode of transport?", options: ["Matatu", "Boda Boda", "Personal Car", "Walking"] },
    { id: "q2", question: "Daily commute time?", options: ["Under 30 min", "30-60 min", "1-2 hours", "2+ hours"] },
    { id: "q3", question: "Monthly transport budget?", options: ["Under 3000 KSH", "3-5000 KSH", "5-10000 KSH", "10000+ KSH"] },
    { id: "q4", question: "Would you use a ride-hailing app?", options: ["Already do", "Would try", "Too expensive", "Not interested"] },
    { id: "q5", question: "Biggest commute frustration?", options: ["Traffic", "Cost", "Safety", "Reliability"] },
  ],
  t12: [
    { id: "q1", question: "Favourite music genre?", options: ["Gengetone", "Afrobeats", "Gospel", "Bongo/International"] },
    { id: "q2", question: "Where do you listen to music?", options: ["YouTube", "Spotify", "Boomplay", "Radio"] },
    { id: "q3", question: "How often do you attend concerts?", options: ["Monthly", "Few times a year", "Once a year", "Never"] },
    { id: "q4", question: "Do you pay for music streaming?", options: ["Yes, premium", "Free tier", "Used to", "No"] },
    { id: "q5", question: "Favourite Kenyan artist?", options: ["Sauti Sol", "Nyashinski", "Otile Brown", "Other"] },
  ],
  t14: [
    { id: "q1", question: "How often do you exercise?", options: ["Daily", "3-4 times/week", "Once a week", "Rarely"] },
    { id: "q2", question: "Preferred exercise?", options: ["Running/Jogging", "Gym workout", "Home exercises", "Sports"] },
    { id: "q3", question: "Do you use fitness apps?", options: ["Yes, daily", "Sometimes", "Used to", "No"] },
    { id: "q4", question: "Monthly health/fitness spend?", options: ["Under 1000 KSH", "1-3000 KSH", "3-5000 KSH", "5000+ KSH"] },
    { id: "q5", question: "What motivates you to stay fit?", options: ["Health", "Appearance", "Energy", "Social"] },
  ],
  t15: [
    { id: "q1", question: "How often do you shop online?", options: ["Weekly", "Monthly", "Few times a year", "Never"] },
    { id: "q2", question: "Preferred online store?", options: ["Jumia", "Kilimall", "Instagram shops", "Jiji"] },
    { id: "q3", question: "What do you buy most online?", options: ["Electronics", "Fashion", "Groceries", "Home items"] },
    { id: "q4", question: "Online payment method?", options: ["M-Pesa", "Card", "Cash on delivery", "Mixed"] },
    { id: "q5", question: "Biggest online shopping concern?", options: ["Fake products", "Delivery time", "High prices", "Trust"] },
  ],
};

// Generate default questions for tasks without specific ones
export function getQuestionsForTask(taskId: string): SurveyQuestion[] {
  if (surveyQuestions[taskId]) return surveyQuestions[taskId];
  // Return generic questions
  return [
    { id: "q1", question: "How satisfied are you with this product category?", options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied"] },
    { id: "q2", question: "How often do you engage with this?", options: ["Daily", "Weekly", "Monthly", "Rarely"] },
    { id: "q3", question: "What matters most to you?", options: ["Quality", "Price", "Convenience", "Brand"] },
    { id: "q4", question: "Would you recommend this to others?", options: ["Definitely", "Probably", "Maybe", "No"] },
    { id: "q5", question: "How did you first learn about this?", options: ["Social Media", "Friends/Family", "Advertisement", "Other"] },
  ];
}
