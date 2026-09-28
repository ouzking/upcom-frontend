import { TeamMemberCard } from "@/components/cards/TeamMemberCard";
import { CtaBand } from "@/components/layout/CtaBand";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { Seo } from "@/components/seo/Seo";
import { breadcrumbJsonLd } from "@/lib/seo";
import { ErrorState, SkeletonGrid } from "@/components/ui/Feedback";
import { Accent, Eyebrow } from "@/components/ui/Section";
import { ROUTES } from "@/config/site";
import { COMPANY } from "@/content/company";
import { useTeam } from "@/hooks/queries";
import { TeamRoles } from "@/sections/home/TeamPreview";

export default function TeamPage() {
  const { data: members = [], isPending, isError, refetch } = useTeam();

  return (
    <>
      <Seo
        title="Équipe"
        description="L'équipe pluridisciplinaire d'UPCOM AGENCY & SERVICES : conseil, communication, création, audiovisuel, événementiel et services aux entreprises."
        jsonLd={
          members.length > 0
            ? {
                "@type": "Organization",
                name: COMPANY.name,
                member: members.map((member) => ({ "@type": "Person", name: member.name, jobTitle: member.position })),
              }
            : breadcrumbJsonLd([{ name: "Équipe", path: ROUTES.team }])
        }
      />
      <PageHero
        eyebrow="L'équipe"
        title="Des talents complémentaires, une même ambition."
        accentWords={["complémentaires"]}
        intro="Conseil, communication, création, production, événementiel et gestion : une équipe réunie pour faire avancer vos projets, appuyée par des prestataires et consultants externes selon les besoins."
        crumbs={[{ label: "Équipe" }]}
      />

      <section className="container-page py-20 sm:py-28" aria-label="Membres de l'équipe">
        {isPending ? (
          <SkeletonGrid count={4} className="lg:grid-cols-4" itemClassName="aspect-[4/5]" />
        ) : isError ? (
          <ErrorState onRetry={() => void refetch()} />
        ) : members.length > 0 ? (
          <Stagger className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {members.map((member) => (
              <StaggerItem key={member.id}>
                <TeamMemberCard member={member} showBio />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <Eyebrow>Notre organisation</Eyebrow>
              <h2 className="mt-5 text-display-md text-ink">
                Une équipe <Accent>pluridisciplinaire</Accent>.
              </h2>
              <p className="mt-5 text-muted">Les profils de l'équipe seront présentés ici prochainement.</p>
            </Reveal>
            <div className="lg:col-span-8">
              <TeamRoles />
            </div>
          </div>
        )}
      </section>

      <CtaBand title="Envie de travailler avec nous ? Parlons-en." />
    </>
  );
}
