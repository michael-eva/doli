import supabase from "@/config/supabaseClient";

export async function CheckJodStatus(userId: string) {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", userId)
    .eq("isJod", true);

  if (error) {
    console.error("Error:", error);
    return false;
  }

  return data && data.length > 0;
}

export async function CheckBusinessStatus(userId: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", userId);

  if (error) {
    console.error("Error:", error);
    return false;
  }

  return data && data.length > 0;
}

// Check if a user is following an artist
export async function isFollowingArtist(userId: string, artistId: string) {
  const { data, error } = await supabase
    .from("artist_follows")
    .select("*")
    .eq("user_id", userId)
    .eq("artist_id", artistId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "not found" error
    console.error("Error checking follow status:", error);
    return false;
  }

  return !!data;
}

// Get follow count for an artist
export async function getArtistFollowCount(artistId: string) {
  const { count, error } = await supabase
    .from("artist_follows")
    .select("*", { count: "exact", head: true })
    .eq("artist_id", artistId);

  if (error) {
    console.error("Error getting follow count:", error);
    return 0;
  }

  return count || 0;
}

export async function GetArtists(name?: string) {
  let query = supabase.from("artists").select("*");

  if (name && name.trim() !== "") {
    query = query.ilike("name", `%${name}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error:", error);
    return [];
  }

  return data;
}

export async function GetUserBusiness(userId: string) {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      locations (
        suburb,
        state,
        country,
        postcode,
        streetAddress,
        formatted_address
      )
    `
    )
    .eq("id", userId);

  if (error) {
    console.error("Error:", error);
    return [];
  }

  return data;
}

export async function GetGigs() {
  const { data, error } = await supabase.from("gigs").select(`
            *,
      artists (
        name,
        music_type,
        genre,
        type,
        image_url
      ),
      posts (
        name,
        locations (
          suburb,
          state,
          postcode
        )
      )
    `);

  if (error) {
    console.error("Error:", error);
    return [];
  }

  return data;
}

// Get artists that a user follows
export async function GetFollowedArtists(userId: string, name?: string) {
  let query = supabase
    .from("artist_follows")
    .select(
      `
      artist_id,
      artists (
        id,
        name,
        admin_one_email,
        admin_two_email,
        image_url,
        type,
        music_type,
        genre,
        about,
        is_verified,
        is_rejected,
        created_at,
        updated_at
      )
    `
    )
    .eq("user_id", userId);

  const { data, error } = await query;

  if (error) {
    console.error("Error getting followed artists:", error);
    return [];
  }

  // Extract the artists from the joined data
  const artists = data?.map((follow) => follow.artists).filter(Boolean) || [];

  // Apply name filter if provided
  if (name && name.trim() !== "") {
    return artists.filter((artist: any) =>
      artist.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  return artists;
}
