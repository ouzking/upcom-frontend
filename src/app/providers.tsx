import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

const loadMotionFeatures = () => import("@/components/motion/motion-features").then((module) => module.default);

export function AppProviders({ children, queryClient }: { children: ReactNode; queryClient: QueryClient }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* strict : impose les composants `m.*` légers ; reducedMotion : respecte le réglage système. */}
      <LazyMotion features={loadMotionFeatures} strict>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
    </QueryClientProvider>
  );
}
