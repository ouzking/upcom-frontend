import { storageUrl } from "@/lib/storage";
import type { TeamMember, Testimonial } from "@/types/domain";
import { query } from "./client";

/**
 * Membres publiés. Les coordonnées personnelles (e-mail, téléphone) ne sont
 * volontairement pas chargées par le site public.
 */
export async function listTeamMembers(): Promise<TeamMember[]> {
  const rows = await query("Chargement de l'équipe", [], (db) =>
    db
      .from("team_members")
      .select("id, name, position, biography, photo_path, linkedin_url")
      .eq("status", "published")
      .order("display_order"),
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    position: row.position,
    biography: row.biography,
    photoUrl: storageUrl("team", row.photo_path),
    linkedinUrl: row.linkedin_url,
  }));
}

export async function listTestimonials(): Promise<Testimonial[]> {
  const rows = await query("Chargement des témoignages", [], (db) =>
    db
      .from("testimonials")
      .select("id, name, company, role, content, photo_path")
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("display_order"),
  );
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    company: row.company,
    role: row.role,
    content: row.content,
    photoUrl: storageUrl("testimonials", row.photo_path),
  }));
}
