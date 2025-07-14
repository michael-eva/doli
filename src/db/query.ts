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
