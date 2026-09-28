import { m, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, Clapperboard, Compass, PenTool, type LucideIcon } from "lucide-react";
import { useRef, type PointerEvent } from "react";
import { SplitWords } from "@/components/motion/primitives";
import { EASE } from "@/components/motion/variants";
import { Logo, Orbits, Slashes } from "@/components/ui/Brand";
import { ButtonLink } from "@/components/ui/Button";
import { buttonClasses } from "@/components/ui/button-styles";
import { PRIMARY_CTA } from "@/config/site";
import { COMPANY } from "@/content/company";
import { useExpertises } from "@/hooks/queries";
import { cn } from "@/lib/cn";

const FLOATING: { label: string; icon: LucideIcon; className: string; delay: number }[] = [
  { label: "Stratégie", icon: Compass, className: "left-[2%] top-[16%]", delay: 0.9 },
  { label: "Création", icon: PenTool, className: "right-[0%] top-[42%]", delay: 1.05 },
  { label: "Audiovisuel", icon: Clapperboard, className: "bottom-[12%] left-[10%]", delay: 1.2 },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Parallaxe au pointeur (desktop), amortie par un ressort.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 50, damping: 18 });
  const springY = useSpring(pointerY, { stiffness: 50, damping: 18 });
  const logoX = useTransform(springX, (value) => value * 14);
  const logoY = useTransform(springY, (value) => value * 14);
  const orbitX = useTransform(springX, (value) => value * -22);
  const orbitY = useTransform(springY, (value) => value * -22);

  // Parallaxe au défilement.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      className="relative isolate flex flex-col overflow-hidden bg-white pt-28 sm:pt-36 lg:min-h-[100svh] lg:pt-32"
      aria-labelledby="hero-title"
    >
      {/* Profondeur : trame fine + halo bleu */}
      <div className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_70%_35%,black,transparent)]" aria-hidden="true" />
      <div className="absolute -right-[20%] -top-[30%] -z-10 aspect-square w-[80vw] max-w-[70rem] rounded-full bg-[radial-gradient(circle,rgba(1,114,231,0.14),transparent_65%)]" aria-hidden="true" />

      <div className="container-page grid flex-1 items-center gap-14 pb-16 lg:grid-cols-12 lg:gap-6 lg:pb-10">
        <m.div className="lg:col-span-7" style={{ opacity: copyOpacity }}>
          <m.p
            className="flex items-center gap-4 text-[0.78rem] font-semibold uppercase tracking-[0.24em] text-brand"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            <Slashes className="h-3" />
            {COMPANY.name}
          </m.p>

          <h1 id="hero-title" className="mt-7 text-display-xl text-ink">
            <SplitWords text="Donner de la valeur à votre image." accentWords={["image"]} accentClassName="text-brand" immediate delay={0.2} />
          </h1>

          {/* Trait orange : écho à la trajectoire du logo */}
          <svg viewBox="0 0 420 24" className="mt-3 h-4 w-[min(26rem,70%)] sm:h-5" aria-hidden="true" fill="none">
            <m.path
              d="M3 18C110 4 270 2 417 10"
              stroke="url(#hero-swoosh)"
              strokeWidth="5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: EASE, delay: 0.95 }}
            />
            <defs>
              <linearGradient id="hero-swoosh" x1="0" x2="1">
                <stop offset="0" stopColor="#EB4602" />
                <stop offset="1" stopColor="#FD8E03" />
              </linearGradient>
            </defs>
          </svg>

          <m.p
            className="mt-8 max-w-xl text-lead text-muted"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
          >
            {COMPANY.description}
          </m.p>

          <m.div
            className="mt-10 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.85 }}
          >
            <ButtonLink to={PRIMARY_CTA.to} variant="accent" size="lg" arrow>
              {PRIMARY_CTA.label}
            </ButtonLink>
            <a href="#expertises" className={buttonClasses({ variant: "outline", size: "lg" })}>
              Découvrir nos expertises
            </a>
          </m.div>
        </m.div>

        {/* Composition : logo, orbites, repères métiers */}
        <m.div
          className="relative mx-auto w-full max-w-[34rem] lg:col-span-5 lg:max-w-none"
          style={{ y: visualY }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
        >
          <div className="relative aspect-square">
            <m.div className="absolute inset-[-6%]" style={{ x: orbitX, y: orbitY }}>
              <Orbits className="absolute inset-0" />
            </m.div>
            <div
              className="absolute inset-[14%] rounded-full border border-brand/10 bg-[radial-gradient(circle_at_35%_30%,#ffffff,#f1f4fb_70%)] shadow-[0_40px_120px_-40px_rgba(1,53,146,0.35)]"
              aria-hidden="true"
            />
            <m.div className="absolute inset-[24%] flex items-center justify-center" style={{ x: logoX, y: logoY }}>
              <Logo large eager className="h-auto w-full drop-shadow-[0_18px_30px_rgba(1,53,146,0.18)]" />
            </m.div>

            {FLOATING.map(({ label, icon: Icon, className, delay }, index) => (
              <m.div
                key={label}
                className={cn("absolute hidden sm:block", className)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay }}
              >
                <m.div
                  className="flex items-center gap-2.5 rounded-full border border-white bg-white/80 py-2 pl-2 pr-4 text-sm font-semibold text-ink shadow-[0_12px_32px_-12px_rgba(10,22,51,0.28)] backdrop-blur-md"
                  animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
                  transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className={cn("flex size-8 items-center justify-center rounded-full", index === 1 ? "bg-accent text-ink" : "bg-brand text-white")}>
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  {label}
                </m.div>
              </m.div>
            ))}
          </div>
        </m.div>
      </div>

      <m.a
        href="#agence"
        className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        aria-label="Faire défiler vers la présentation"
      >
        <ArrowDown className="size-4 animate-bounce" aria-hidden="true" />
      </m.a>

      <ExpertiseMarquee />
    </section>
  );
}

/** Bandeau défilant des six pôles (statique si les animations sont réduites). */
function ExpertiseMarquee() {
  const { data: expertises = [] } = useExpertises();
  if (expertises.length === 0) return <div className="h-[4.5rem] border-y border-line" />;

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {expertises.map((expertise) => (
        <li key={expertise.slug} className="flex items-center gap-10 pr-10">
          <span className="whitespace-nowrap font-display text-lg font-semibold tracking-tight text-ink sm:text-xl">{expertise.name}</span>
          <Slashes className="h-2.5" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="group relative border-y border-line bg-white/80 py-5 backdrop-blur" aria-label="Nos six pôles d'expertise">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-white to-transparent sm:w-32" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-white to-transparent sm:w-32" aria-hidden="true" />
    </div>
  );
}
