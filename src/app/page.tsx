import HeroScene from '@/components/HeroScene';
import ConstructionStory from '@/components/ConstructionStory';
import InteriorShowcase from '@/components/InteriorShowcase';
import ProjectShowcase from '@/components/ProjectShowcase';
import ServicesPreview from '@/components/ServicesPreview';
import StatsSection from '@/components/StatsSection';
import CTASection from '@/components/CTASection';

export default function Home() {
  return (
    <>
      <HeroScene />
      <ConstructionStory />
      <ServicesPreview />
      <InteriorShowcase />
      <ProjectShowcase />
      <StatsSection />
      <CTASection />
    </>
  );
}
