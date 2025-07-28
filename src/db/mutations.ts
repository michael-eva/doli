import supabase from "@/config/supabaseClient";
import { Artist } from "@/Types";
import { User } from "@supabase/supabase-js";

export const createArtist = async (artist: Artist) => {
  const { data, error } = await supabase
    .from("artists")
    .insert({
      ...artist,
      is_verified: false,
      is_rejected: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select();
  return { data, error };
};

const determineArtistVerificationStatus = (updatedArtist: Artist & { id: string }, currentArtist?: Artist) => {
  if (!currentArtist || currentArtist.is_verified === false) {
    return false;
  }
  
  const isNameChanged = updatedArtist.name !== currentArtist.name;
  const isAboutChanged = updatedArtist.about !== currentArtist.about;
  const isImageChanged = updatedArtist.image_url !== currentArtist.image_url;
  
  return isNameChanged || isAboutChanged || isImageChanged ? false : true;
};

export const updateArtist = async (artist: Artist & { id: string }, currentArtist?: Artist) => {
  const shouldSetVerifiedTrue = determineArtistVerificationStatus(artist, currentArtist);
  
  const { data, error } = await supabase
    .from("artists")
    .update({
      name: artist.name,
      admin_one_email: artist.admin_one_email,
      admin_two_email: artist.admin_two_email,
      image_url: artist.image_url,
      type: artist.type,
      music_type: artist.music_type,
      genre: artist.genre,
      about: artist.about,
      is_verified: shouldSetVerifiedTrue,
      is_rejected: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", artist.id)
    .select();
  return { data, error };
};

// Follow an artist
export const followArtist = async (userId: string, artistId: string) => {
  const { data, error } = await supabase
    .from("artist_follows")
    .insert({
      user_id: userId,
      artist_id: artistId,
      created_at: new Date().toISOString(),
    })
    .select();
  return { data, error };
};

// Unfollow an artist
export const unfollowArtist = async (userId: string, artistId: string) => {
  const { data, error } = await supabase
    .from("artist_follows")
    .delete()
    .eq("user_id", userId)
    .eq("artist_id", artistId)
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

export const updateGig = async (gigData: {
  id: string;
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
  description: string;
}) => {
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

  // Get the business post ID
  const { data: businessData, error: businessError } = await supabase
    .from("posts")
    .select("postId")
    .eq("name", gigData.businessName)
    .single();

  if (businessError) {
    console.error("Error finding business:", businessError);
    throw new Error("Business not found");
  }

  // Update the gig
  const { data, error } = await supabase
    .from("gigs")
    .update({
      business_post_id: businessData.postId,
      artist_id: artistData.id,
      event_date: gigData.date.toISOString().split("T")[0],
      event_time: gigData.time,
      ticket_type: gigData.ticketType,
      description: gigData.description,
      updated_at: new Date().toISOString(),
    })
    .eq("id", gigData.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating gig:", error);
    throw error;
  }

  return data;
};
