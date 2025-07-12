import supabase from "@/config/supabaseClient";
import { Artist } from "@/Types";

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
