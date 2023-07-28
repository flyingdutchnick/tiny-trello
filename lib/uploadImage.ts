import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/supabase";

const uploadImage = async (file: File) => {
  if (!file) return;

  const uniqueId = uuidv4();
  const {data, error } = await supabase.storage
    .from("images")
    .upload(`${uniqueId}-${file.name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading image:", error);
    // throw the error so it can be caught and handled by the calling code, if necessary
    throw error;
  }

  if (!data) throw new Error("No data returned from upload");

  return data;
};
export default uploadImage;
