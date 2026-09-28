import { SOCIAL_PLATFORM_LABELS } from "@upcom/supabase";
import { COMPANY } from "@/content/company";
import type { SiteInfo } from "@/types/domain";
import { query } from "./client";

export const DEFAULT_SITE_INFO: SiteInfo = {
  companyName: COMPANY.name,
  tagline: COMPANY.tagline,
  description: COMPANY.description,
  address: COMPANY.address,
  phones: [...COMPANY.phones],
  email: null,
  whatsapp: null,
  openingHours: null,
  mapUrl: null,
  socials: [],
};

/** Paramètres globaux (`site_settings`, singleton) et réseaux sociaux actifs. */
export async function getSiteInfo(): Promise<SiteInfo> {
  const [settings, socials] = await Promise.all([
    query("Chargement des paramètres", null, (db) =>
      db
        .from("site_settings")
        .select(
          "company_name, tagline, description, address, phone_primary, phone_secondary, email, whatsapp_number, opening_hours, map_url",
        )
        .eq("id", 1)
        .maybeSingle(),
    ),
    query("Chargement des réseaux sociaux", [], (db) =>
      db.from("social_links").select("id, platform, label, url").eq("is_active", true).order("display_order"),
    ),
  ]);

  const phones = [settings?.phone_primary, settings?.phone_secondary].filter(
    (phone): phone is string => Boolean(phone?.trim()),
  );

  return {
    companyName: settings?.company_name || DEFAULT_SITE_INFO.companyName,
    tagline: settings?.tagline || DEFAULT_SITE_INFO.tagline,
    description: settings?.description || DEFAULT_SITE_INFO.description,
    address: settings?.address || DEFAULT_SITE_INFO.address,
    phones: phones.length > 0 ? phones : DEFAULT_SITE_INFO.phones,
    email: settings?.email || null,
    whatsapp: settings?.whatsapp_number || null,
    openingHours: settings?.opening_hours || null,
    mapUrl: settings?.map_url || null,
    socials: socials.map((social) => ({
      id: social.id,
      platform: social.platform,
      label: social.label || SOCIAL_PLATFORM_LABELS[social.platform],
      url: social.url,
    })),
  };
}
