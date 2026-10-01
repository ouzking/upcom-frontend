import { TeamMemberCard } from "@/components/cards/TeamMemberCard";
import { Stagger, StaggerItem } from "@/components/motion/primitives";
import { Slashes } from "@/components/ui/Brand";
import { TextLink } from "@/components/ui/Button";
import { SkeletonGrid } from "@/components/ui/Feedback";
import { Accent, SectionHeading } from "@/components/ui/Section";
import { ROUTES } from "@/config/site";
import { TEAM_ROLES } from "@/content/agency";
import { useTeam } from "@/hooks/queries";

/** Organisation de l'équipe (postes du cahier des charges), sans données personnelles. */
export function TeamRoles() {
  return (
    <Stagger className="flex flex-wrap items-center gap-x-6 gap-y-4" stagger={0.05}>
      {TEAM_ROLES.map((role, index) => (
        <StaggerItem key={role} className="flex items-center gap-6">
          <span className="font-display text-[clamp(1.35rem,2.6vw,2.25rem)] font-semibold tracking-tight text-ink">{role}</span>
          {index < TEAM_ROLES.length - 1 ? <Slashes className="h-2.5 opacity-70" /> : null}
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function TeamPreview() {
  const { data: members = [], isPending } = useTeam();
  const preview = members.slice(0, 4);

  return (
    <section className="defer-render bg-mist py-24 sm:py-32 lg:py-40" aria-labelledby="team-title">
      <div className="container-page">
        <SectionHeading
          index="07"
          eyebrow="L'équipe"
          title={
            <span id="team-title">
              Une équipe <Accent>pluridisciplinaire</Accent> à votre service.
            </span>
          }
          intro="Une organisation pensée pour couvrir l'ensemble de vos besoins, du conseil à la production, avec l'appui de prestataires et consultants externes selon les projets."
          aside={<TextLink to={ROUTES.team}>Découvrir l'équipe</TextLink>}
        />

        <div className="mt-16 lg:mt-20">
          {isPending ? (
            <SkeletonGrid count={4} className="lg:grid-cols-4" itemClassName="aspect-[4/5]" />
          ) : preview.length > 0 ? (
            <Stagger className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {preview.map((member) => (
                <StaggerItem key={member.id}>
                  <TeamMemberCard member={member} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <TeamRoles />
          )}
        </div>
      </div>
    </section>
  );
}
