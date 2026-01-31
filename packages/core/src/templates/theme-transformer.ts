import type { BuilderNode } from '../schemas/node';
import type { ThemeColors } from '../schemas/site-settings';

// ============================================================================
// TEMPLATE COLOR MAPPING
// ============================================================================

/**
 * Maps template hardcoded colors to theme semantic roles
 * These mappings define what role each hardcoded color plays in templates
 */
const TEMPLATE_COLOR_MAPPINGS: Array<{
  colors: string[];  // Original colors (lowercased hex)
  role: keyof ThemeColors;
}> = [
  // Primary/Accent colors (amber/orange in craftsman template)
  { colors: ['#f59e0b', '#d97706', '#fbbf24', '#f97316'], role: 'primary' },
  
  // Dark backgrounds
  { colors: ['#1a1a2e', '#0a0a0f', '#0f0f14', '#1e1e32', '#0f172a', '#1e293b'], role: 'foreground' },
  
  // Light/White text on dark backgrounds
  { colors: ['#ffffff', '#fff'], role: 'background' },
  
  // Muted text colors
  { colors: ['#94a3b8', '#64748b', '#cbd5e1', '#9ca3af', '#6b7280'], role: 'mutedForeground' },
  
  // Light backgrounds
  { colors: ['#f8fafc', '#f1f5f9', '#e2e8f0'], role: 'secondary' },
  
  // Success color
  { colors: ['#22c55e', '#16a34a', '#10b981'], role: 'success' },
  
  // Warning color
  { colors: ['#eab308', '#ca8a04'], role: 'warning' },
  
  // Destructive/Error color
  { colors: ['#ef4444', '#dc2626', '#f87171'], role: 'destructive' },
  
  // Border colors
  { colors: ['#e5e7eb', '#d1d5db', '#374151'], role: 'border' },
];

/**
 * Get theme color for a template color
 */
function getThemeColor(originalColor: string, themeColors: ThemeColors): string | null {
  const normalizedColor = originalColor.toLowerCase().trim();
  
  for (const mapping of TEMPLATE_COLOR_MAPPINGS) {
    if (mapping.colors.includes(normalizedColor)) {
      return themeColors[mapping.role] || null;
    }
  }
  
  return null;
}

/**
 * Transform a color value using theme colors
 * Returns the theme color if matched, otherwise returns original
 */
function transformColor(color: string | undefined, themeColors: ThemeColors): string | undefined {
  if (!color) return color;
  
  // Handle rgba with opacity
  const rgbaMatch = color.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/);
  if (rgbaMatch) {
    const r = rgbaMatch[1];
    const g = rgbaMatch[2];
    const b = rgbaMatch[3];
    const a = rgbaMatch[4];
    if (r && g && b && a) {
      const hexColor = rgbToHex(parseInt(r), parseInt(g), parseInt(b));
      const themeColor = getThemeColor(hexColor, themeColors);
      if (themeColor) {
        // Convert theme color to rgba with same opacity
        const rgb = hexToRgb(themeColor);
        if (rgb) {
          return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
        }
      }
    }
    return color;
  }
  
  // Handle hex colors
  const themeColor = getThemeColor(color, themeColors);
  return themeColor || color;
}

/**
 * Convert RGB to Hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Convert Hex to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result || !result[1] || !result[2] || !result[3]) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

/**
 * Transform style object with theme colors
 */
function transformStyle(
  style: BuilderNode['style'],
  themeColors: ThemeColors
): BuilderNode['style'] {
  if (!style) return style;
  
  const transformedStyle: Record<string, Record<string, unknown>> = {};
  
  for (const [breakpoint, breakpointStyle] of Object.entries(style)) {
    if (!breakpointStyle || typeof breakpointStyle !== 'object') continue;
    
    const transformedBreakpointStyle: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(breakpointStyle)) {
      if (typeof value === 'string') {
        // Check if this is a color property
        const colorProps = [
          'bgColor', 'backgroundColor', 'textColor', 'color',
          'borderColor', 'shadowColor', 'gradientFrom', 'gradientTo',
          'hoverBgColor', 'hoverTextColor', 'hoverBorderColor'
        ];
        
        if (colorProps.includes(key)) {
          transformedBreakpointStyle[key] = transformColor(value, themeColors);
        } else if (key === 'background' && value.includes('#')) {
          // Handle gradient backgrounds
          let transformedValue = value;
          const hexMatches = value.match(/#[0-9A-Fa-f]{6}/g);
          if (hexMatches) {
            for (const hexColor of hexMatches) {
              const themeColor = getThemeColor(hexColor, themeColors);
              if (themeColor) {
                transformedValue = transformedValue.replace(hexColor, themeColor);
              }
            }
          }
          transformedBreakpointStyle[key] = transformedValue;
        } else {
          transformedBreakpointStyle[key] = value;
        }
      } else {
        transformedBreakpointStyle[key] = value;
      }
    }
    
    transformedStyle[breakpoint] = transformedBreakpointStyle;
  }
  
  return transformedStyle as BuilderNode['style'];
}

/**
 * Transform props that may contain color values
 */
function transformProps(
  props: Record<string, unknown>,
  themeColors: ThemeColors
): Record<string, unknown> {
  const colorPropNames = [
    'color', 'backgroundColor', 'textColor', 'bgColor',
    'borderColor', 'iconColor', 'overlayColor'
  ];
  
  const transformedProps: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'string' && colorPropNames.includes(key)) {
      transformedProps[key] = transformColor(value, themeColors);
    } else {
      transformedProps[key] = value;
    }
  }
  
  return transformedProps;
}

/**
 * Recursively apply theme colors to a node and all its children
 */
export function applyThemeToNode(
  node: BuilderNode,
  themeColors: ThemeColors
): BuilderNode {
  return {
    ...node,
    props: transformProps(node.props, themeColors),
    style: transformStyle(node.style, themeColors),
    children: node.children.map(child => applyThemeToNode(child, themeColors)),
  };
}

/**
 * Apply theme colors to an entire builder tree
 */
export function applyThemeToTree(
  tree: { root: BuilderNode; builderVersion?: number },
  themeColors: ThemeColors
): { root: BuilderNode; builderVersion?: number } {
  return {
    ...tree,
    root: applyThemeToNode(tree.root, themeColors),
  };
}
