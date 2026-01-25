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

export const DisplayToken = z.enum(['block', 'inline', 'inline-block', 'flex', 'grid', 'none']);
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
  
  // Sizing
  width: z.string().optional(), // Allow percentage/auto
  height: z.string().optional(),
  minWidth: z.string().optional(),
  minHeight: z.string().optional(),
  maxWidth: MaxWidthToken.optional(),
  maxHeight: z.string().optional(),
  
  // Spacing
  padding: SpacingToken.optional(),
  paddingX: SpacingToken.optional(),
  paddingY: SpacingToken.optional(),
  paddingTop: SpacingToken.optional(),
  paddingRight: SpacingToken.optional(),
  paddingBottom: SpacingToken.optional(),
  paddingLeft: SpacingToken.optional(),
  
  margin: SpacingToken.optional(),
  marginX: SpacingToken.optional(),
  marginY: SpacingToken.optional(),
  marginTop: SpacingToken.optional(),
  marginRight: SpacingToken.optional(),
  marginBottom: SpacingToken.optional(),
  marginLeft: SpacingToken.optional(),
  
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
  
  // Grid
  gridColumns: z.number().min(1).max(12).optional(),
  gridRows: z.number().min(1).max(12).optional(),
  gridColumnSpan: z.number().min(1).max(12).optional(),
  gridRowSpan: z.number().min(1).max(12).optional(),
  
  // Colors
  backgroundColor: ColorToken.optional(),
  color: ColorToken.optional(),
  borderColor: ColorToken.optional(),
  
  // Typography
  fontSize: FontSizeToken.optional(),
  fontWeight: FontWeightToken.optional(),
  textAlign: TextAlignToken.optional(),
  lineHeight: z.enum(['none', 'tight', 'snug', 'normal', 'relaxed', 'loose']).optional(),
  letterSpacing: z.enum(['tighter', 'tight', 'normal', 'wide', 'wider', 'widest']).optional(),
  textDecoration: z.enum(['none', 'underline', 'line-through']).optional(),
  textTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']).optional(),
  
  // Borders
  borderWidth: z.enum(['0', '1', '2', '4', '8']).optional(),
  borderRadius: BorderRadiusToken.optional(),
  borderStyle: z.enum(['solid', 'dashed', 'dotted', 'none']).optional(),
  
  // Effects
  shadow: ShadowToken.optional(),
  opacity: z.number().min(0).max(100).optional(),
  
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
