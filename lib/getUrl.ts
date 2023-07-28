import { supabase } from "@/supabase";

const getUrl = async (image: Image) => {
  const { data, error } = await supabase.storage.from('images').createSignedUrl(image.fileId, 120)

  if(error){
    console.error('Error fetching image URL:', error.message);
    return null;
  }
  return data?.signedUrl;
}

export default getUrl;
