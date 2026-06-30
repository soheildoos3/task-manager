import LandingFooter from "@/components/common/Footer/LandingFooter";
import LandingHeader from "@/components/common/Header/LandingHeader";
import CTASection from "@/components/features/landing/CTASection";
import FeaturesSection from "@/components/features/landing/FeaturesSection";
import HeroSection from "@/components/features/landing/HeroSection";
import StatsSection from "@/components/features/landing/StatsSection";

export const metadata = {
  title: "Task Manager - Professional Task Management",
  description: "The best task and project management tool with modern UI",
};

export default function HomePage() {
  return (
    <div className="bg-background min-h-screen">
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
