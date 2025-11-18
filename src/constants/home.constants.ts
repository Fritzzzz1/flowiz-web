/**
 * Home page constants - features, stats, and content data
 */

export interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

/**
 * Feature cards displayed on the home page
 */
export const FEATURES: Feature[] = [
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Visualize complex pipelines in milliseconds with optimized D3.js rendering',
    color: '234, 179, 8', // yellow
  },
  {
    icon: '🎨',
    title: 'Beautiful Graphs',
    description: 'Force-directed layouts with smooth animations and interactive controls',
    color: '139, 92, 246', // purple
  },
  {
    icon: '🔍',
    title: 'Deep Analysis',
    description: 'Detect bottlenecks, critical paths, and optimization opportunities instantly',
    color: '59, 130, 246', // blue
  },
  {
    icon: '🎯',
    title: 'Intuitive UI',
    description: 'Drag, zoom, and explore your pipelines with seamless interactions',
    color: '16, 185, 129', // green
  },
  {
    icon: '🌓',
    title: 'Dark Mode',
    description: 'Gorgeous dark theme that is easy on your eyes during late-night debugging',
    color: '244, 63, 94', // pink
  },
  {
    icon: '♿',
    title: 'Accessible',
    description: 'WCAG 2.1 AA compliant with full keyboard navigation and screen reader support',
    color: '249, 115, 22', // orange
  },
];

/**
 * Statistics displayed on the home page
 */
export const STATS: Stat[] = [
  { value: 10000, suffix: '+', label: 'Pipelines Visualized' },
  { value: 50000, suffix: '+', label: 'Jobs Analyzed' },
  { value: 99, suffix: '%', label: 'Uptime' },
  { value: 150, suffix: 'ms', label: 'Avg Response' },
];
