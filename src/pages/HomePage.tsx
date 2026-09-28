import { CtaBand } from "@/components/layout/CtaBand";
import { Seo } from "@/components/seo/Seo";
import { env } from "@/config/env";
import { COMPANY } from "@/content/company";
import { Approach } from "@/sections/home/Approach";
import { Expertises } from "@/sections/home/Expertises";
import { FeaturedProjects } from "@/sections/home/FeaturedProjects";
import { Hero } from "@/sections/home/Hero";
import { Intro } from "@/sections/home/Intro";
import { NewsEvents } from "@/sections/home/NewsEvents";
import { TeamPreview } from "@/sections/home/TeamPreview";
import { Testimonials } from "@/sections/home/Testimonials";
import { WhyUpcom } from "@/sections/home/WhyUpcom";

export default function HomePage() {
  return (
    <>
      <Seo
        description={COMPANY.description}
        jsonLd={{ "@type": "WebSite", name: COMPANY.name, url: env.siteUrl, inLanguage: "fr" }}
      />
      <Hero />
      <Intro />
      <Expertises />
      <Approach />
      <FeaturedProjects />
      <WhyUpcom />
      <Testimonials />
      <TeamPreview />
      <NewsEvents />
      <CtaBand />
    </>
  );
}
