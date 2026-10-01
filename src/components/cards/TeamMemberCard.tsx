import { SocialIcon } from "@/components/media/SocialIcon";
import { SmartImage } from "@/components/media/SmartImage";
import { cn } from "@/lib/cn";
import type { TeamMember } from "@/types/domain";

const initials = (name: string): string =>
  name
    .replace(/\[[^\]]*\]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

/** Portrait éditorial : noir et blanc, couleur au survol (initiales si aucune photo). */
export function TeamMemberCard({ member, showBio = false, className }: { member: TeamMember; showBio?: boolean; className?: string }) {
  return (
    <article className={cn("group", className)}>
      <div className="relative">
        <SmartImage
          src={member.photoUrl}
          alt={`Portrait de ${member.name}`}
          seed={member.id}
          fallbackText={initials(member.name)}
          className="aspect-[4/5] rounded-[1.5rem]"
          imgClassName="grayscale transition duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
        {member.linkedinUrl ? (
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 flex size-11 items-center justify-center rounded-full bg-white text-brand shadow-md transition hover:bg-brand hover:text-white"
            aria-label={`Profil LinkedIn de ${member.name} (nouvelle fenêtre)`}
          >
            <SocialIcon platform="linkedin" className="size-[18px]" />
          </a>
        ) : null}
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink">{member.name}</h3>
      <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-accent-ink">{member.position}</p>
      {showBio && member.biography ? <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{member.biography}</p> : null}
    </article>
  );
}
