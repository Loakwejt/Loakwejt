import { z } from 'zod';

// ============================================================================
// STYLE TOKENS - Whitelist-based safe styling
// ============================================================================

export const SpacingToken = z.enum([
  'none',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
]);
export type SpacingToken = z.infer<typeof SpacingToken>;

export const ColorToken = z.enum([
  'transparent',
  'background',
  'foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'white',
  'black',
]);
export type ColorToken = z.infer<typeof ColorToken>;

export const FontSizeToken = z.enum([
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
]);
export type FontSizeToken = z.infer<typeof FontSizeToken>;

export const FontWeightToken = z.enum([
  'thin',
  'light',
  'normal',
  'medium',
  'semibold',
  'bold',
  'extrabold',
]);
export type FontWeightToken = z.infer<typeof FontWeightToken>;

export const BorderRadiusToken = z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']);
export type BorderRadiusToken = z.infer<typeof BorderRadiusToken>;

export const ShadowToken = z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']);
export type ShadowToken = z.infer<typeof ShadowToken>;

export const TextAlignToken = z.enum(['left', 'center', 'right', 'justify']);
export type TextAlignToken = z.infer<typeof TextAlignToken>;

export const FlexDirectionToken = z.enum(['row', 'row-reverse', 'column', 'column-reverse']);
export type FlexDirectionToken = z.infer<typeof FlexDirectionToken>;

export const FlexAlignToken = z.enum(['start', 'center', 'end', 'stretch', 'baseline']);
export type FlexAlignToken = z.infer<typeof FlexAlignToken>;

export const FlexJustifyToken = z.enum([
  'start',
  'center',
  'end',
  'between',
  'around',
  'evenly',
]);
export type FlexJustifyToken = z.infer<typeof FlexJustifyToken>;

export const DisplayToken = z.enum(['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'none']);
export type DisplayToken = z.infer<typeof DisplayToken>;

export const PositionToken = z.enum(['static', 'relative', 'absolute', 'fixed', 'sticky']);
export type PositionToken = z.infer<typeof PositionToken>;

export const OverflowToken = z.enum(['visible', 'hidden', 'scroll', 'auto']);
export type OverflowToken = z.infer<typeof OverflowToken>;

export const MaxWidthToken = z.enum(['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full', 'none']);
export type MaxWidthToken = z.infer<typeof MaxWidthToken>;

// ============================================================================
// STYLE PROPERTIES SCHEMA
// ============================================================================

export const StylePropertiesSchema = z.object({
  // Layout
  display: DisplayToken.optional(),
  position: PositionToken.optional(),
  overflow: OverflowToken.optional(),
  overflowX: OverflowToken.optional(),
  overflowY: OverflowToken.optional(),
  zIndex: z.number().optional(),
  
  // Sizing
  width: z.string().optional(), // Allow percentage/auto
  height: z.string().optional(),
  minWidth: z.string().optional(),
  minHeight: z.string().optional(),
  maxWidth: z.union([MaxWidthToken, z.string()]).optional(),
  maxHeight: z.string().optional(),
  
  // Spacing
  padding: SpacingToken.optional(),
  paddingX: SpacingToken.optional(),
  paddingY: SpacingToken.optional(),
  paddingTop: SpacingToken.optional(),
  paddingRight: SpacingToken.optional(),
  paddingBottom: SpacingToken.optional(),
  paddingLeft: SpacingToken.optional(),
  
  margin: z.union([SpacingToken, z.literal('auto')]).optional(),
  marginX: z.union([SpacingToken, z.literal('auto')]).optional(),
  marginY: z.union([SpacingToken, z.literal('auto')]).optional(),
  marginTop: z.union([SpacingToken, z.literal('auto')]).optional(),
  marginRight: z.union([SpacingToken, z.literal('auto')]).optional(),
  marginBottom: z.union([SpacingToken, z.literal('auto')]).optional(),
  marginLeft: z.union([SpacingToken, z.literal('auto')]).optional(),
  
  // Gap (for flex/grid)
  gap: SpacingToken.optional(),
  gapX: SpacingToken.optional(),
  gapY: SpacingToken.optional(),
  
  // Flexbox
  flexDirection: FlexDirectionToken.optional(),
  alignItems: FlexAlignToken.optional(),
  justifyContent: FlexJustifyToken.optional(),
  flexWrap: z.enum(['wrap', 'nowrap', 'wrap-reverse']).optional(),
  flexGrow: z.number().optional(),
  flexShrink: z.number().optional(),
  flex: z.string().optional(), // Flex shorthand (e.g., '1', '0 0 auto')
  alignSelf: z.enum(['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch']).optional(),
  justifySelf: z.enum(['auto', 'flex-start', 'flex-end', 'center', 'stretch']).optional(),
  order: z.number().optional(),
  
  // Grid
  gridColumns: z.number().min(1).max(12).optional(),
  gridRows: z.number().min(1).max(12).optional(),
  gridColumnSpan: z.number().min(1).max(12).optional(),
  gridRowSpan: z.number().min(1).max(12).optional(),
  placeItems: z.string().optional(), // Grid/Flex centering (e.g., 'center')
  gridTemplateColumns: z.string().optional(), // e.g., 'repeat(3, 1fr)'
  gridTemplateRows: z.string().optional(), // e.g., 'auto 1fr auto'
  justifyItems: z.enum(['start', 'end', 'center', 'stretch']).optional(),
  
  // Positioning
  top: z.string().optional(),
  right: z.string().optional(),
  bottom: z.string().optional(),
  left: z.string().optional(),
  
  // Theme Colors (using tokens)
  backgroundColor: ColorToken.optional(),
  color: ColorToken.optional(),
  
  // Custom Colors (hex/rgb values)
  bgColor: z.string().optional(),
  textColor: z.string().optional(),
  borderColor: z.string().optional(),
  
  // Background Image
  backgroundImage: z.string().optional(),
  backgroundSize: z.enum(['cover', 'contain', 'auto']).optional(),
  backgroundPosition: z.enum(['center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']).optional(),
  backgroundRepeat: z.enum(['repeat', 'no-repeat', 'repeat-x', 'repeat-y']).optional(),
  
  // Typography
  fontSize: FontSizeToken.optional(),
  fontWeight: FontWeightToken.optional(),
  textAlign: TextAlignToken.optional(),
  lineHeight: z.enum(['none', 'tight', 'snug', 'normal', 'relaxed', 'loose']).optional(),
  letterSpacing: z.enum(['tighter', 'tight', 'normal', 'wide', 'wider', 'widest']).optional(),
  textDecoration: z.enum(['none', 'underline', 'line-through']).optional(),
  textTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']).optional(),
  
  // Borders
  border: z.string().optional(), // CSS border shorthand, e.g., '1px solid #ccc'
  borderTop: z.string().optional(), // CSS border-top shorthand
  borderBottom: z.string().optional(), // CSS border-bottom shorthand
  borderLeft: z.string().optional(),
  borderRight: z.string().optional(),
  borderWidth: z.enum(['0', '1', '2', '4', '8']).optional(),
  borderRadius: BorderRadiusToken.optional(),
  borderStyle: z.enum(['solid', 'dashed', 'dotted', 'none']).optional(),
  
  // Effects
  background: z.string().optional(), // CSS background shorthand (gradients, etc.)
  shadow: z.union([ShadowToken, z.literal('inner')]).optional(),
  boxShadow: z.string().optional(), // Custom box-shadow value
  opacity: z.number().min(0).max(100).optional(),
  gradient: z.string().optional(), // CSS gradient value
  backdropBlur: z.string().optional(), // e.g., '4px', '8px'
  blur: z.string().optional(), // e.g., '4px', '8px'
  transform: z.string().optional(), // CSS transform value
  transition: z.string().optional(), // CSS transition value
  transitionDuration: z.string().optional(), // e.g., '300ms', '0.5s'
  aspectRatio: z.string().optional(), // e.g., '16/9', '1/1'
  objectFit: z.enum(['contain', 'cover', 'fill', 'none', 'scale-down']).optional(),
  
  // Hover States
  hoverBackgroundColor: z.string().optional(),
  hoverTextColor: z.string().optional(),
  hoverBorderColor: z.string().optional(),
  hoverScale: z.string().optional(), // e.g., '1.05', '1.1'
  hoverShadow: z.string().optional(), // Custom hover shadow
  hoverOpacity: z.number().min(0).max(100).optional(),
  
  // Cursor
  cursor: z.enum(['default', 'pointer', 'text', 'move', 'not-allowed', 'grab', 'grabbing']).optional(),
});

export type StyleProperties = z.infer<typeof StylePropertiesSchema>;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const Breakpoint = z.enum(['mobile', 'tablet', 'desktop']);
export type Breakpoint = z.infer<typeof Breakpoint>;

export const BREAKPOINT_VALUES = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
} as const;

// ============================================================================
// BUILDER STYLE SCHEMA (with breakpoint overrides)
// ============================================================================

export const BuilderStyleSchema = z.object({
  base: StylePropertiesSchema,
  mobile: StylePropertiesSchema.optional(),
  tablet: StylePropertiesSchema.optional(),
  desktop: StylePropertiesSchema.optional(),
});

export type BuilderStyle = z.infer<typeof BuilderStyleSchema>;

// ============================================================================
// STYLE TOKEN TO CLASS MAPPING UTILITIES
// ============================================================================

export const SPACING_CLASS_MAP: Record<SpacingToken, string> = {
  none: '0',
  xs: '1',
  sm: '2',
  md: '4',
  lg: '6',
  xl: '8',
  '2xl': '12',
  '3xl': '16',
  '4xl': '24',
};

export const COLOR_CLASS_MAP: Record<ColorToken, string> = {
  transparent: 'transparent',
  background: 'background',
  foreground: 'foreground',
  primary: 'primary',
  'primary-foreground': 'primary-foreground',
  secondary: 'secondary',
  'secondary-foreground': 'secondary-foreground',
  muted: 'muted',
  'muted-foreground': 'muted-foreground',
  accent: 'accent',
  'accent-foreground': 'accent-foreground',
  destructive: 'destructive',
  'destructive-foreground': 'destructive-foreground',
  border: 'border',
  input: 'input',
  ring: 'ring',
  card: 'card',
  'card-foreground': 'card-foreground',
  popover: 'popover',
  'popover-foreground': 'popover-foreground',
  white: 'white',
  black: 'black',
};

export const FONT_SIZE_CLASS_MAP: Record<FontSizeToken, string> = {
  xs: 'xs',
  sm: 'sm',
  base: 'base',
  lg: 'lg',
  xl: 'xl',
  '2xl': '2xl',
  '3xl': '3xl',
  '4xl': '4xl',
  '5xl': '5xl',
  '6xl': '6xl',
};

export const MAX_WIDTH_CLASS_MAP: Record<MaxWidthToken, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
  none: 'max-w-none',
};
