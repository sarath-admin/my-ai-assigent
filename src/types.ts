export type Screen = 'onboarding' | 'home' | 'chat' | 'history' | 'profile' | 'settings';

export interface UserProfile {
  name: string;
  avatar: string;
}

export interface Activity {
  id: string;
  date: string;
  time: string;
  target: string;
  expense: number;
}

export interface Expense {
  id: string;
  date: string;
  time: string;
  amount: number;
  description: string;
}

export interface Investment {
  id: string;
  date: string;
  time: string;
  type: string;
  amount: number;
}

export interface Purchase {
  id: string;
  date: string;
  time: string;
  items: string;
  amount: number;
}

export interface Income {
  id: string;
  date: string;
  time: string;
  source: string;
  amount: number;
}

export interface Bill {
  id: string;
  date: string;
  time: string;
  name: string;
  amount: number;
}

export interface Reminder {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  notified?: boolean;
}

export interface Note {
  id: string;
  date: string;
  time: string;
  content: string;
}

export interface AppState {
  profile: UserProfile;
  theme: 'light' | 'dark' | 'blue';
  onboardingVideo: string;
  onboardingImage: string;
  activities: Activity[];
  expenses: Expense[];
  investments: Investment[];
  purchases: Purchase[];
  incomes: Income[];
  bills: Bill[];
  reminders: Reminder[];
  notes: Note[];
}
