import supabase from "@/config/supabaseClient";
import { Artist } from "@/Types";
import { User } from "@supabase/supabase-js";

export const createArtist = async (artist: Artist) => {
  const { data, error } = await supabase
    .from("artists")
    .insert(artist)
    .select();
  return { data, error };
};

export const uploadImage = async (
  userId: string,
  filename: string,
  webpBlob: Blob,
  bucket: string
) => {
  const { data: imageData, error: imageError } = await supabase.storage
    .from(bucket)
    .upload(userId + "/" + filename, webpBlob, {
      contentType: "image/webp",
      upsert: false,
    });
  return { imageData, imageError };
};
export async function CreateGig(
  gigData: {
    businessName: string;
    suburb: string;
    type: number;
    artist: {
      name: string;
      image_url: string;
      type: string;
      music_type: string;
      genre: string;
      about: string;
    };
    date: Date;
    time: string;
    ticketType: "free" | "paid";
    businessPostId?: string;
    description: string;
  },
  user: User
) {
  // First, get the artist ID from the artists table
  const { data: artistData, error: artistError } = await supabase
    .from("artists")
    .select("id")
    .eq("name", gigData.artist.name)
    .single();

  if (artistError) {
    console.error("Error finding artist:", artistError);
    throw new Error("Artist not found");
  }

  // Get the business post ID if not provided
  let businessPostId = gigData.businessPostId;
  if (!businessPostId) {
    const { data: businessData, error: businessError } = await supabase
      .from("posts")
      .select("postId")
      .eq("name", gigData.businessName)
      .eq("id", user.id)
      .single();

    if (businessError) {
      console.error("Error finding business:", businessError);
      throw new Error("Business not found");
    }
    businessPostId = businessData.postId;
  }

  // Insert the gig with foreign key references
  const { data, error } = await supabase
    .from("gigs")
    .insert({
      business_post_id: businessPostId,
      artist_id: artistData.id,
      event_date: gigData.date.toISOString().split("T")[0],
      event_time: gigData.time,
      ticket_type: gigData.ticketType,
      created_by: user.id,
      admin_email: user.email,
      description: gigData.description,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating gig:", error);
    throw error;
  }

  return data;
}
