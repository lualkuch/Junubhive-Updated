export interface Profile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  location: string;
  distance?: number;
  interests: string[];
  occupation?: string;
  education?: string;
  height?: number;
  verified: boolean;
  online_status: "online" | "recently" | "offline";
  last_seen?: string;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  matched_at: string;
  last_message?: Message;
  unread_count: number;
  profile: Profile;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  type: "text" | "image" | "gif" | "reaction";
  read: boolean;
  created_at: string;
}

export interface SwipeAction {
  profile_id: string;
  action: "like" | "pass" | "super_like";
  created_at: string;
}

export interface UserPreferences {
  age_min: number;
  age_max: number;
  distance_max: number;
  gender_preference: string[];
  show_me: boolean;
}

export type SwipeDirection = "left" | "right" | "up" | null;
