import { Container } from '@components/layout/Container';
import { InteractiveCard } from '@components/ui/InteractiveCard';
import { FEATURES } from '@/constants/home.constants';

/**
 * Features section component
 * Displays the feature cards grid
 */
export function FeaturesSection() {
  return (
    <section className="relative py-20">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to understand and optimize your CI/CD workflows
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <div
              key={feature.title}
              className="animate-slide-up"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <InteractiveCard glowColor={feature.color}>
                <div className="text-5xl mb-4 animate-bounce-slow">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </InteractiveCard>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
