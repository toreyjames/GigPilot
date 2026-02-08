// Simple client-side user state for the MVP.
// In production this is replaced by Clerk auth + database.
// Uses localStorage so it persists across page refreshes.

export type UserTrack = "track_a" | "track_b" | null;
export type DashboardMode = "uber" | "browse" | "schedule";

export interface UserState {
  name: string;
  email: string;
  earningsGoal: number;
  availableHours: number;
  skills: string[];
  onboardingDone: boolean;
  isLoggedIn: boolean;
  track: UserTrack;
  dashboardMode: DashboardMode;
  idea: string;
  ideaCategory: string;
  completedTasks: number;
  totalEarnings: number;
  specialization: string;
}

const DEFAULT_USER: UserState = {
  name: "",
  email: "",
  earningsGoal: 2000,
  availableHours: 10,
  skills: [],
  onboardingDone: false,
  isLoggedIn: false,
  track: null,
  dashboardMode: "uber",
  idea: "",
  ideaCategory: "",
  completedTasks: 0,
  totalEarnings: 0,
  specialization: "",
};

const STORAGE_KEY = "gigpilot_user";

export function getUser(): UserState {
  if (typeof window === "undefined") return DEFAULT_USER;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_USER, ...JSON.parse(stored) };
  } catch {
    // ignore
  }
  return DEFAULT_USER;
}

export function saveUser(user: Partial<UserState>) {
  if (typeof window === "undefined") return;
  const current = getUser();
  const updated = { ...current, ...user };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function clearUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
