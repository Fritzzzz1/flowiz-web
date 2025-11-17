import { useEffect, useState } from 'react';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  status: 'pending' | 'running' | 'success' | 'failed';
}

const demoNodes: Node[] = [
  { id: '1', label: 'Setup', x: 50, y: 150, status: 'success' },
  { id: '2', label: 'Build', x: 200, y: 100, status: 'success' },
  { id: '3', label: 'Test', x: 200, y: 200, status: 'running' },
  { id: '4', label: 'Deploy', x: 350, y: 150, status: 'pending' },
];

const connections = [
  { from: '1', to: '2' },
  { from: '1', to: '3' },
  { from: '2', to: '4' },
  { from: '3', to: '4' },
];

export function PipelineAnimation() {
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set(['1']));
  const [flowProgress, setFlowProgress] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    let nodeAnimationTimeout: number;
    let animationFrameId: number;
    let lastFrameTime = 0;

    // Node progression logic (runs every 2 seconds)
    const progressNodes = () => {
      setActiveNodes((prev) => {
        const next = new Set(prev);

        if (prev.has('1') && !prev.has('2') && !prev.has('3')) {
          next.add('2');
          next.add('3');
        } else if (prev.has('2') && prev.has('3') && !prev.has('4')) {
          next.add('4');
        } else {
          return new Set(['1']);
        }

        return next;
      });

      nodeAnimationTimeout = window.setTimeout(progressNodes, 2000);
    };

    // Start node progression
    nodeAnimationTimeout = window.setTimeout(progressNodes, 2000);

    // Particle animation using requestAnimationFrame for smooth 60fps animation
    const animateParticles = (currentTime: number) => {
      // Calculate delta time for frame-rate independent animation
      const deltaTime = currentTime - lastFrameTime;

      // Update approximately every 16ms (60fps) or use delta for smoother animation
      if (deltaTime >= 16) {
        setFlowProgress((prev) => {
          const next = new Map(prev);
          connections.forEach((conn) => {
            const key = `${conn.from}-${conn.to}`;
            const current = next.get(key) || 0;
            // Adjust speed based on delta time for consistent animation
            const increment = 0.01 * (deltaTime / 16);
            next.set(key, (current + increment) % 1);
          });
          return next;
        });

        lastFrameTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(animateParticles);
    };

    // Start particle animation
    animationFrameId = requestAnimationFrame(animateParticles);

    return () => {
      clearTimeout(nodeAnimationTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const getNodeColor = (status: string, isActive: boolean) => {
    if (!isActive) return '#6B7280';
    switch (status) {
      case 'success':
        return '#10B981';
      case 'running':
        return '#3B82F6';
      case 'failed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getConnection = (fromId: string, toId: string) => {
    const from = demoNodes.find((n) => n.id === fromId);
    const to = demoNodes.find((n) => n.id === toId);
    if (!from || !to) return null;

    const key = `${fromId}-${toId}`;
    const progress = flowProgress.get(key) || 0;
    const particleX = from.x + (to.x - from.x) * progress;
    const particleY = from.y + (to.y - from.y) * progress;

    return { from, to, particleX, particleY };
  };

  return (
    <div className="relative w-full h-[300px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connections */}
        {connections.map((conn) => {
          const data = getConnection(conn.from, conn.to);
          if (!data) return null;

          return (
            <g key={`${conn.from}-${conn.to}`}>
              {/* Connection line */}
              <line
                x1={data.from.x}
                y1={data.from.y}
                x2={data.to.x}
                y2={data.to.y}
                stroke="url(#lineGradient)"
                strokeWidth="2"
                className="transition-all duration-300"
              />
              {/* Animated particle */}
              <circle
                cx={data.particleX}
                cy={data.particleY}
                r="4"
                fill="#3B82F6"
                filter="url(#glow)"
                className="animate-pulse"
              />
            </g>
          );
        })}

        {/* Nodes */}
        {demoNodes.map((node) => {
          const isActive = activeNodes.has(node.id);
          const color = getNodeColor(node.status, isActive);

          return (
            <g key={node.id} className="transition-all duration-500">
              {/* Outer ring animation */}
              {isActive && node.status === 'running' && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="30"
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  opacity="0.3"
                  className="animate-ping"
                />
              )}
              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r="20"
                fill={isActive ? color : '#6B7280'}
                filter={isActive ? 'url(#glow)' : undefined}
                className="transition-all duration-300"
              />
              {/* Node label */}
              <text
                x={node.x}
                y={node.y + 35}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700 dark:fill-gray-300"
              >
                {node.label}
              </text>
              {/* Status icon */}
              {isActive && (
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fontSize="16"
                  className="fill-white"
                >
                  {node.status === 'success' ? '✓' : node.status === 'running' ? '⟳' : '○'}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Success</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-gray-600 dark:text-gray-400">Running</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span className="text-gray-600 dark:text-gray-400">Pending</span>
        </div>
      </div>
    </div>
  );
}
