/**
 * Graph Theme Configuration
 * Defines colors and styles for D3 graph visualization
 * Following FloWiz design system specifications
 */

export interface NodeTheme {
  fill: string;
  stroke: string;
  strokeWidth: number;
  hoverStroke: string;
  hoverStrokeWidth: number;
}

export interface EdgeTheme {
  stroke: string;
  strokeWidth: number;
  highlightStroke: string;
  highlightStrokeWidth: number;
  opacity: number;
  highlightOpacity: number;
}

export interface GraphTheme {
  node: {
    default: NodeTheme;
    success: NodeTheme;
    failed: NodeTheme;
    running: NodeTheme;
    pending: NodeTheme;
    skipped: NodeTheme;
  };
  edge: EdgeTheme;
  text: {
    fill: string;
    fontSize: string;
    fontWeight: string;
  };
  arrowColor: {
    default: string;
    highlight: string;
  };
}

/**
 * Light mode theme
 */
export const lightTheme: GraphTheme = {
  node: {
    default: {
      fill: '#FFFFFF',
      stroke: '#0078D4',
      strokeWidth: 2,
      hoverStroke: '#0078D4',
      hoverStrokeWidth: 3,
    },
    success: {
      fill: '#D1FAE5',
      stroke: '#10B981',
      strokeWidth: 2,
      hoverStroke: '#10B981',
      hoverStrokeWidth: 3,
    },
    failed: {
      fill: '#FEE2E2',
      stroke: '#EF4444',
      strokeWidth: 2,
      hoverStroke: '#EF4444',
      hoverStrokeWidth: 3,
    },
    running: {
      fill: '#FEF3C7',
      stroke: '#F59E0B',
      strokeWidth: 2,
      hoverStroke: '#F59E0B',
      hoverStrokeWidth: 3,
    },
    pending: {
      fill: '#E9D5FF',
      stroke: '#8B5CF6',
      strokeWidth: 2,
      hoverStroke: '#8B5CF6',
      hoverStrokeWidth: 3,
    },
    skipped: {
      fill: '#F3F4F6',
      stroke: '#6B7280',
      strokeWidth: 2,
      hoverStroke: '#6B7280',
      hoverStrokeWidth: 3,
    },
  },
  edge: {
    stroke: '#D1D5DB',
    strokeWidth: 2,
    highlightStroke: '#0078D4',
    highlightStrokeWidth: 3,
    opacity: 0.6,
    highlightOpacity: 1,
  },
  text: {
    fill: '#111827',
    fontSize: '12px',
    fontWeight: '500',
  },
  arrowColor: {
    default: '#D1D5DB',
    highlight: '#0078D4',
  },
};

/**
 * Dark mode theme
 */
export const darkTheme: GraphTheme = {
  node: {
    default: {
      fill: '#1A1D23',
      stroke: '#0078D4',
      strokeWidth: 2,
      hoverStroke: '#0078D4',
      hoverStrokeWidth: 3,
    },
    success: {
      fill: '#065F46',
      stroke: '#10B981',
      strokeWidth: 2,
      hoverStroke: '#10B981',
      hoverStrokeWidth: 3,
    },
    failed: {
      fill: '#7F1D1D',
      stroke: '#EF4444',
      strokeWidth: 2,
      hoverStroke: '#EF4444',
      hoverStrokeWidth: 3,
    },
    running: {
      fill: '#78350F',
      stroke: '#F59E0B',
      strokeWidth: 2,
      hoverStroke: '#F59E0B',
      hoverStrokeWidth: 3,
    },
    pending: {
      fill: '#581C87',
      stroke: '#8B5CF6',
      strokeWidth: 2,
      hoverStroke: '#8B5CF6',
      hoverStrokeWidth: 3,
    },
    skipped: {
      fill: '#374151',
      stroke: '#6B7280',
      strokeWidth: 2,
      hoverStroke: '#6B7280',
      hoverStrokeWidth: 3,
    },
  },
  edge: {
    stroke: '#2D3139',
    strokeWidth: 2,
    highlightStroke: '#0078D4',
    highlightStrokeWidth: 3,
    opacity: 0.6,
    highlightOpacity: 1,
  },
  text: {
    fill: '#E8EAED',
    fontSize: '12px',
    fontWeight: '500',
  },
  arrowColor: {
    default: '#2D3139',
    highlight: '#0078D4',
  },
};

/**
 * Get node theme based on status
 */
export function getNodeTheme(
  status: 'success' | 'failed' | 'running' | 'pending' | 'skipped' | 'default',
  isDark = false
): NodeTheme {
  const theme = isDark ? darkTheme : lightTheme;
  return theme.node[status];
}

/**
 * Get graph theme based on mode
 */
export function getGraphTheme(isDark = false): GraphTheme {
  return isDark ? darkTheme : lightTheme;
}
