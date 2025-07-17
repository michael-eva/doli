export type Artist = {
  id?: string;
  name: string;
  admin_one_email: string;
  admin_two_email: string | null;
  image_url: string;
  type: "music" | "comedy" | "other";
  music_type?: "cover" | "original";
  genre?:
    | "alt"
    | "classical"
    | "country"
    | "electronic"
    | "folk"
    | "heavy metal"
    | "hip-hop"
    | "jazz"
    | "latin"
    | "punk"
    | "reggae"
    | "r&b"
    | "rock";
  about: string;
  is_verified?: boolean;
  is_rejected?: boolean;
  created_at?: string;
  updated_at?: string;
};
