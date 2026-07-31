import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Activity {
  id: string;
  title: string;
  time: number;
  type: 'quiz' | 'lab' | 'challenge' | 'achievement';
}

export interface LastLab {
  name: string;
  desc: string;
  url: string;
}

export interface QuickChallengeScore {
  id: string | number;
  name: string;
  score: string;
}

export interface UserProfile {
  name: string;
  quote: string;
  avatarId: string;
}

interface AppState {
  xp: number;
  level: number;
  energy: number;
  theme: 'light' | 'dark';
  
  // AI Chat Global State
  isAIChatOpen: boolean;
  setAIChatOpen: (open: boolean) => void;
  aiPromptBuffer: string | null;
  setAIPrompt: (prompt: string) => void;

  // Gamification
  completedChallenges: string[];
  completeChallenge: (id: string) => void;
  badges: string[];

  addXp: (amount: number) => void;
  setEnergy: (amount: number) => void;
  spendEnergy: (amount: number) => boolean;
  addEnergy: (amount: number) => void;
  buyBadge: (badgeId: string, cost: number) => boolean;
  toggleTheme: () => void;

  // Progress Tracking
  lastLab: LastLab | null;
  setLastLab: (lab: LastLab) => void;
  
  recentActivities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'time'>) => void;
  
  quickChallenges: QuickChallengeScore[];
  updateChallengeScore: (id: string | number, name: string, score: string) => void;

  // Profile
  userProfile: UserProfile;
  setUserProfile: (profile: Partial<UserProfile>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      userProfile: {
        name: "Fisikawan Muda",
        quote: "Teruslah bertanya mengapa.",
        avatarId: "Einstein"
      },
      setUserProfile: (profile) => set((state) => ({
        userProfile: { ...state.userProfile, ...profile }
      })),

      xp: 2450,
      level: 12,
      energy: 100,
      theme: 'light',
      
      isAIChatOpen: false,
      setAIChatOpen: (open) => set({ isAIChatOpen: open }),
      aiPromptBuffer: null,
      setAIPrompt: (prompt) => set({ aiPromptBuffer: prompt, isAIChatOpen: true }),
      
      completedChallenges: [],
      completeChallenge: (id) => 
        set((state) => {
          if (!state.completedChallenges.includes(id)) {
            return {
              completedChallenges: [...state.completedChallenges, id],
              xp: state.xp + 50,
              energy: Math.min(100, state.energy + 25)
            }
          }
          return state;
        }),
        
      badges: [],

      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        const newLevel = Math.floor(newXp / 1000) + 1; 
        return { xp: newXp, level: newLevel };
      }),
      
      setEnergy: (amount) => set({ energy: amount }),
      
      spendEnergy: (amount) => {
        const { energy } = get();
        if (energy >= amount) {
          set({ energy: energy - amount });
          return true;
        }
        return false;
      },
      
      addEnergy: (amount) => set((state) => ({ energy: Math.min(100, state.energy + amount) })),
      
      buyBadge: (badgeId, cost) => {
        const { xp, badges } = get();
        if (xp >= cost && !badges.includes(badgeId)) {
          set({ 
            xp: xp - cost, 
            badges: [...badges, badgeId] 
          });
          return true;
        }
        return false;
      },

      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      lastLab: null,
      setLastLab: (lab) => set({ lastLab: lab }),

      recentActivities: [],
      addActivity: (activity) => set((state) => {
        const newActivity: Activity = {
          ...activity,
          id: Math.random().toString(36).substr(2, 9),
          time: Date.now()
        };
        // Keep only the last 5 activities
        return { recentActivities: [newActivity, ...state.recentActivities].slice(0, 5) };
      }),

      quickChallenges: [],
      updateChallengeScore: (id, name, score) => set((state) => {
        const existingIndex = state.quickChallenges.findIndex(c => c.id === id);
        if (existingIndex >= 0) {
          const updated = [...state.quickChallenges];
          updated[existingIndex] = { id, name, score };
          return { quickChallenges: updated };
        }
        // Keep top 3 challenges
        return { quickChallenges: [{ id, name, score }, ...state.quickChallenges].slice(0, 3) };
      })
    }),
    {
      name: 'physics-lab-storage',
      partialize: (state) => ({
        xp: state.xp,
        level: state.level,
        energy: state.energy,
        theme: state.theme,
        completedChallenges: state.completedChallenges,
        badges: state.badges,
        lastLab: state.lastLab,
        recentActivities: state.recentActivities,
        quickChallenges: state.quickChallenges,
        userProfile: state.userProfile
      })
    }
  )
)
