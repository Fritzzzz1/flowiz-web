import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '@components/ui/AnimatedBackground';
import { usePipelineStore } from '@store/pipeline.store';
import {
  HeroSection,
  LiveDemoSection,
  FeaturesSection,
  CTASection,
  ScrollIndicator,
} from '@/features/home/components';

/**
 * Home page component
 * Landing page with hero section, features, and CTAs
 */
export function Home() {
  const navigate = useNavigate();
  const currentPipeline = usePipelineStore((state) => state.currentPipeline);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleTryDemo = () => {
    navigate('/visualize?demo=true');
  };

  const handleViewVisualization = () => {
    navigate('/visualize');
  };

  return (
    <div className="relative overflow-hidden">
      <AnimatedBackground />

      <HeroSection
        isVisible={isVisible}
        currentPipeline={currentPipeline}
        onTryDemo={handleTryDemo}
        onViewVisualization={handleViewVisualization}
      />

      <LiveDemoSection onTryDemo={handleTryDemo} />

      <FeaturesSection />

      <CTASection onTryDemo={handleTryDemo} />

      <ScrollIndicator />
    </div>
  );
}
