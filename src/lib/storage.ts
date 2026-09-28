import { getPublicStorageUrl, type StorageBucket } from "@upcom/supabase";
import { env } from "@/config/env";

/** URL publique d'une image Storage à partir du chemin enregistré en base (`*_path`). */
export function storageUrl(bucket: StorageBucket, path: string | null | undefined): string | null {
  return getPublicStorageUrl(env.supabaseUrl, bucket, path);
}
