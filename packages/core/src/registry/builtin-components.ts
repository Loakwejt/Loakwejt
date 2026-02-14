import { z } from 'zod';
import { componentRegistry, type ComponentDefinition } from './component-registry';

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

const SectionComponent: ComponentDefinition = {
  type: 'Section',
  displayName: 'Bereich',
  description: 'A full-width section container',
  icon: 'layout',
  category: 'layout',
  canHaveChildren: true,
  defaultProps: {
    fullWidth: true,
    minHeight: 'auto',
    verticalAlign: 'start',
  },
  propsSchema: z.object({
    fullWidth: z.boolean().default(true),
    minHeight: z.enum(['auto', 'screen', 'half', 'third']).default('auto'),
    verticalAlign: z.enum(['start', 'center', 'end']).default('start'),
    backgroundImage: z.string().optional(),
    backgroundSize: z.enum(['cover', 'contain', 'auto']).default('cover'),
    backgroundPosition: z.enum(['center', 'top', 'bottom', 'left', 'right']).default('center'),
    backgroundRepeat: z.boolean().default(false),
    backgroundOverlay: z.string().optional(),
    backgroundOverlayOpacity: z.number().min(0).max(100).default(50),
  }),
  tags: ['layout', 'container', 'wrapper'],
};

const ContainerComponent: ComponentDefinition = {
  type: 'Container',
  displayName: 'Container',
  description: 'A centered container with max-width',
  icon: 'square',
  category: 'layout',
  canHaveChildren: true,
  defaultProps: {
    maxWidth: '7xl',
    centered: true,
  },
  propsSchema: z.object({
    maxWidth: z.enum(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full']).default('7xl'),
    centered: z.boolean().default(true),
    minHeight: z.enum(['auto', 'full', 'screen']).default('auto'),
  }),
  tags: ['layout', 'container', 'wrapper', 'center'],
};

const StackComponent: ComponentDefinition = {
  type: 'Stack',
  displayName: 'Stapel',
  description: 'Flex container for stacking elements',
  icon: 'layers',
  category: 'layout',
  canHaveChildren: true,
  defaultProps: {
    direction: 'column',
    gap: 'md',
    align: 'stretch',
    justify: 'start',
    wrap: false,
  },
  propsSchema: z.object({
    direction: z.enum(['row', 'column', 'row-reverse', 'column-reverse']).default('column'),
    gap: z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']).default('md'),
    align: z.enum(['start', 'center', 'end', 'stretch', 'baseline']).default('stretch'),
    justify: z.enum(['start', 'center', 'end', 'between', 'around', 'evenly']).default('start'),
    wrap: z.boolean().default(false),
    reverse: z.boolean().default(false),
  }),
  tags: ['layout', 'flex', 'stack', 'flexbox'],
};

const GridComponent: ComponentDefinition = {
  type: 'Grid',
  displayName: 'Raster',
  description: 'Grid layout for responsive columns',
  icon: 'grid',
  category: 'layout',
  canHaveChildren: true,
  defaultProps: {
    columns: 3,
    gap: 'md',
    columnsMobile: 1,
    columnsTablet: 2,
  },
  propsSchema: z.object({
    columns: z.number().min(1).max(12).default(3),
    gap: z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']).default('md'),
    columnsMobile: z.number().min(1).max(12).default(1),
    columnsTablet: z.number().min(1).max(12).default(2),
    rowGap: z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']).optional(),
    alignItems: z.enum(['start', 'center', 'end', 'stretch']).default('stretch'),
  }),
  tags: ['layout', 'grid', 'columns', 'responsive'],
};

const DividerComponent: ComponentDefinition = {
  type: 'Divider',
  displayName: 'Trennlinie',
  description: 'Horizontal divider line',
  icon: 'minus',
  category: 'layout',
  canHaveChildren: false,
  defaultProps: {
    orientation: 'horizontal',
  },
  propsSchema: z.object({
    orientation: z.enum(['horizontal', 'vertical']).default('horizontal'),
  }),
  tags: ['layout', 'divider', 'separator', 'line'],
};

const SpacerComponent: ComponentDefinition = {
  type: 'Spacer',
  displayName: 'Abstand',
  description: 'Empty space for layout adjustments',
  icon: 'move-vertical',
  category: 'layout',
  canHaveChildren: false,
  defaultProps: {
    size: 'md',
  },
  propsSchema: z.object({
    size: z.enum(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']).default('md'),
  }),
  tags: ['layout', 'spacer', 'space', 'gap'],
};

// ============================================================================
// CONTENT COMPONENTS
// ============================================================================

const TextComponent: ComponentDefinition = {
  type: 'Text',
  displayName: 'Text',
  description: 'Absatztext',
  icon: 'type',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    text: 'Text hier eingeben',
  },
  propsSchema: z.object({
    text: z.string().default('Text hier eingeben'),
  }),
  tags: ['content', 'text', 'paragraph', 'p'],
};

const HeadingComponent: ComponentDefinition = {
  type: 'Heading',
  displayName: 'Überschrift',
  description: 'Überschrift (h1-h6)',
  icon: 'heading',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    level: 2,
    text: 'Überschrift',
  },
  propsSchema: z.object({
    level: z.number().min(1).max(6).default(2),
    text: z.string().default('Überschrift'),
  }),
  tags: ['content', 'heading', 'title', 'h1', 'h2', 'h3'],
};

const ImageComponent: ComponentDefinition = {
  type: 'Image',
  displayName: 'Bild',
  description: 'Bild anzeigen',
  icon: 'image',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    src: 'https://placehold.co/600x400',
    alt: 'Bildbeschreibung',
    objectFit: 'cover',
  },
  propsSchema: z.object({
    src: z.string().default('https://placehold.co/600x400'),
    alt: z.string().default('Bildbeschreibung'),
    objectFit: z.enum(['cover', 'contain', 'fill', 'none', 'scale-down']).default('cover'),
    width: z.string().optional(),
    height: z.string().optional(),
  }),
  tags: ['content', 'image', 'media', 'picture'],
};

const IconComponent: ComponentDefinition = {
  type: 'Icon',
  displayName: 'Symbol',
  description: 'Display an icon',
  icon: 'smile',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    name: 'star',
    size: 'md',
  },
  propsSchema: z.object({
    name: z.string().default('star'),
    size: z.enum(['sm', 'md', 'lg', 'xl']).default('md'),
  }),
  tags: ['content', 'icon', 'symbol'],
};

// ============================================================================
// UI COMPONENTS
// ============================================================================

const ButtonComponent: ComponentDefinition = {
  type: 'Button',
  displayName: 'Button',
  description: 'Klickbarer Button',
  icon: 'square',
  category: 'ui',
  canHaveChildren: false,
  defaultProps: {
    text: 'Klick mich',
    variant: 'primary',
    size: 'md',
  },
  propsSchema: z.object({
    text: z.string().default('Klick mich'),
    variant: z.enum(['primary', 'secondary', 'outline', 'ghost', 'destructive']).default('primary'),
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    disabled: z.boolean().default(false),
    fullWidth: z.boolean().default(false),
    icon: z.string().optional(),
    iconPosition: z.enum(['left', 'right']).default('left'),
  }),
  tags: ['ui', 'button', 'action', 'click', 'cta'],
};

const CardComponent: ComponentDefinition = {
  type: 'Card',
  displayName: 'Karte',
  description: 'Card container with optional header',
  icon: 'credit-card',
  category: 'ui',
  canHaveChildren: true,
  defaultProps: {
    title: '',
    description: '',
  },
  propsSchema: z.object({
    title: z.string().default(''),
    description: z.string().default(''),
    image: z.string().optional(),
    imagePosition: z.enum(['top', 'left', 'right']).default('top'),
  }),
  tags: ['ui', 'card', 'container', 'box'],
};

const BadgeComponent: ComponentDefinition = {
  type: 'Badge',
  displayName: 'Abzeichen',
  description: 'Small label badge',
  icon: 'tag',
  category: 'ui',
  canHaveChildren: false,
  defaultProps: {
    text: 'Badge',
    variant: 'default',
  },
  propsSchema: z.object({
    text: z.string().default('Badge'),
    variant: z.enum(['default', 'secondary', 'destructive', 'outline']).default('default'),
  }),
  tags: ['ui', 'badge', 'label', 'tag'],
};

const AlertComponent: ComponentDefinition = {
  type: 'Alert',
  displayName: 'Hinweis',
  description: 'Alert message box',
  icon: 'alert-circle',
  category: 'ui',
  canHaveChildren: false,
  defaultProps: {
    title: 'Alert',
    description: 'This is an alert message.',
    variant: 'default',
  },
  propsSchema: z.object({
    title: z.string().default('Alert'),
    description: z.string().default('This is an alert message.'),
    variant: z.enum(['default', 'destructive', 'success', 'warning', 'info']).default('default'),
    dismissible: z.boolean().default(false),
  }),
  tags: ['ui', 'alert', 'message', 'notification'],
};

// ============================================================================
// FORM COMPONENTS
// ============================================================================

const FormComponent: ComponentDefinition = {
  type: 'Form',
  displayName: 'Formular',
  description: 'Form container',
  icon: 'file-text',
  category: 'forms',
  canHaveChildren: true,
  allowedChildrenTypes: ['Input', 'Textarea', 'Select', 'Checkbox', 'SubmitButton', 'Stack', 'Grid'],
  defaultProps: {
    collection: '',
  },
  propsSchema: z.object({
    collection: z.string().default(''),
    successMessage: z.string().optional(),
    redirectTo: z.string().optional(),
  }),
  tags: ['form', 'input', 'submit'],
};

const InputComponent: ComponentDefinition = {
  type: 'Input',
  displayName: 'Eingabefeld',
  description: 'Text input field',
  icon: 'text-cursor-input',
  category: 'forms',
  canHaveChildren: false,
  defaultProps: {
    name: 'field',
    label: 'Label',
    type: 'text',
    placeholder: '',
  },
  propsSchema: z.object({
    name: z.string().default('field'),
    label: z.string().default('Label'),
    type: z.enum(['text', 'email', 'password', 'number', 'tel', 'url', 'date']).default('text'),
    placeholder: z.string().default(''),
    required: z.boolean().default(false),
    disabled: z.boolean().default(false),
    helpText: z.string().optional(),
  }),
  tags: ['form', 'input', 'text', 'field'],
};

const TextareaComponent: ComponentDefinition = {
  type: 'Textarea',
  displayName: 'Textbereich',
  description: 'Multi-line text input',
  icon: 'align-left',
  category: 'forms',
  canHaveChildren: false,
  defaultProps: {
    name: 'field',
    label: 'Label',
    placeholder: '',
    rows: 4,
  },
  propsSchema: z.object({
    name: z.string().default('field'),
    label: z.string().default('Label'),
    placeholder: z.string().default(''),
    rows: z.number().min(2).max(20).default(4),
    required: z.boolean().default(false),
    disabled: z.boolean().default(false),
  }),
  tags: ['form', 'textarea', 'text', 'field', 'multiline'],
};

const SelectComponent: ComponentDefinition = {
  type: 'Select',
  displayName: 'Auswahl',
  description: 'Dropdown select',
  icon: 'chevron-down',
  category: 'forms',
  canHaveChildren: false,
  defaultProps: {
    name: 'field',
    label: 'Label',
    options: [],
  },
  propsSchema: z.object({
    name: z.string().default('field'),
    label: z.string().default('Label'),
    options: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).default([]),
    placeholder: z.string().default('Select an option'),
    required: z.boolean().default(false),
    disabled: z.boolean().default(false),
  }),
  tags: ['form', 'select', 'dropdown', 'field'],
};

const CheckboxComponent: ComponentDefinition = {
  type: 'Checkbox',
  displayName: 'Kontrollkästchen',
  description: 'Checkbox input',
  icon: 'check-square',
  category: 'forms',
  canHaveChildren: false,
  defaultProps: {
    name: 'field',
    label: 'Checkbox label',
  },
  propsSchema: z.object({
    name: z.string().default('field'),
    label: z.string().default('Checkbox label'),
    required: z.boolean().default(false),
    disabled: z.boolean().default(false),
  }),
  tags: ['form', 'checkbox', 'check', 'field'],
};

const SubmitButtonComponent: ComponentDefinition = {
  type: 'SubmitButton',
  displayName: 'Absenden Button',
  description: 'Form submit button',
  icon: 'send',
  category: 'forms',
  canHaveChildren: false,
  defaultProps: {
    text: 'Submit',
    variant: 'primary',
  },
  propsSchema: z.object({
    text: z.string().default('Submit'),
    variant: z.enum(['primary', 'secondary', 'outline']).default('primary'),
    fullWidth: z.boolean().default(false),
    loadingText: z.string().default('Submitting...'),
  }),
  tags: ['form', 'submit', 'button'],
};

// ============================================================================
// NAVIGATION COMPONENTS
// ============================================================================

const NavbarComponent: ComponentDefinition = {
  type: 'Navbar',
  displayName: 'Navigationsleiste',
  description: 'Navigation bar',
  icon: 'menu',
  category: 'navigation',
  canHaveChildren: true,
  defaultProps: {
    logo: '',
    sticky: false,
  },
  propsSchema: z.object({
    logo: z.string().default(''),
    logoText: z.string().default(''),
    sticky: z.boolean().default(false),
  }),
  tags: ['navigation', 'navbar', 'header', 'menu'],
};

const FooterComponent: ComponentDefinition = {
  type: 'Footer',
  displayName: 'Fußzeile',
  description: 'Page footer',
  icon: 'panel-bottom',
  category: 'navigation',
  canHaveChildren: true,
  defaultProps: {
    showPoweredBy: true,
  },
  propsSchema: z.object({
    showPoweredBy: z.boolean().default(true),
    copyrightText: z.string().optional(),
  }),
  tags: ['navigation', 'footer', 'bottom'],
};

const LinkComponent: ComponentDefinition = {
  type: 'Link',
  displayName: 'Link',
  description: 'Hyperlink',
  icon: 'link',
  category: 'navigation',
  canHaveChildren: false,
  defaultProps: {
    text: 'Link',
    href: '#',
  },
  propsSchema: z.object({
    text: z.string().default('Link'),
    href: z.string().default('#'),
    target: z.enum(['_self', '_blank']).default('_self'),
    underline: z.boolean().default(true),
  }),
  tags: ['navigation', 'link', 'anchor', 'url'],
};

// ============================================================================
// DATA-DRIVEN COMPONENTS
// ============================================================================

const CollectionListComponent: ComponentDefinition = {
  type: 'CollectionList',
  displayName: 'Sammlungs-Liste',
  description: 'Display a list of collection records',
  icon: 'list',
  category: 'data',
  canHaveChildren: true,
  defaultProps: {
    collection: '',
    limit: 10,
  },
  propsSchema: z.object({
    collection: z.string().default(''),
    limit: z.number().min(1).max(100).default(10),
    orderBy: z.string().optional(),
    orderDirection: z.enum(['asc', 'desc']).default('desc'),
    emptyText: z.string().default('No items found'),
  }),
  dataBindings: [
    {
      name: 'records',
      description: 'List of records from the collection',
      type: 'listRecords',
    },
  ],
  tags: ['data', 'list', 'collection', 'records'],
};

const RecordFieldTextComponent: ComponentDefinition = {
  type: 'RecordFieldText',
  displayName: 'Datensatz-Feld',
  description: 'Display a field from the current record',
  icon: 'file-text',
  category: 'data',
  canHaveChildren: false,
  defaultProps: {
    field: '',
  },
  propsSchema: z.object({
    field: z.string().default(''),
    fallback: z.string().default(''),
  }),
  dataBindings: [
    {
      name: 'currentRecord',
      description: 'Current record in context',
      type: 'currentRecord',
    },
  ],
  tags: ['data', 'field', 'record', 'text'],
};

const PaginationComponent: ComponentDefinition = {
  type: 'Pagination',
  displayName: 'Seitennavigation',
  description: 'Pagination controls',
  icon: 'chevrons-left-right',
  category: 'data',
  canHaveChildren: false,
  defaultProps: {
    pageSize: 10,
  },
  propsSchema: z.object({
    pageSize: z.number().min(1).max(100).default(10),
    showPageNumbers: z.boolean().default(true),
    maxPageButtons: z.number().min(3).max(10).default(5),
  }),
  tags: ['data', 'pagination', 'pages', 'navigation'],
};

// ============================================================================
// ADDITIONAL UI COMPONENTS
// ============================================================================

const AvatarComponent: ComponentDefinition = {
  type: 'Avatar',
  displayName: 'Profilbild',
  description: 'User avatar image',
  icon: 'smile',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    src: '',
    fallback: 'AB',
    size: 'md',
  },
  propsSchema: z.object({
    src: z.string().optional(),
    fallback: z.string().default('AB'),
    size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).default('md'),
  }),
  tags: ['avatar', 'user', 'profile', 'image'],
};

const VideoComponent: ComponentDefinition = {
  type: 'Video',
  displayName: 'Video',
  description: 'Embed video (YouTube, Vimeo, or direct)',
  icon: 'play',
  category: 'media',
  canHaveChildren: false,
  defaultProps: {
    src: '',
    aspectRatio: '16/9',
    autoplay: false,
    controls: true,
  },
  propsSchema: z.object({
    src: z.string().default(''),
    aspectRatio: z.string().default('16/9'),
    autoplay: z.boolean().default(false),
    controls: z.boolean().default(true),
    loop: z.boolean().default(false),
    muted: z.boolean().default(false),
  }),
  tags: ['video', 'media', 'youtube', 'vimeo', 'embed'],
};

const MapComponent: ComponentDefinition = {
  type: 'Map',
  displayName: 'Karte',
  description: 'Embedded Google Maps',
  icon: 'map-pin',
  category: 'media',
  canHaveChildren: false,
  defaultProps: {
    address: 'Berlin, Germany',
    zoom: 14,
    height: '300px',
  },
  propsSchema: z.object({
    address: z.string().default('Berlin, Germany'),
    zoom: z.number().min(1).max(20).default(14),
    height: z.string().default('300px'),
  }),
  tags: ['map', 'google', 'location', 'embed'],
};

const SocialLinksComponent: ComponentDefinition = {
  type: 'SocialLinks',
  displayName: 'Social Media Links',
  description: 'Social media icon links',
  icon: 'share',
  category: 'navigation',
  canHaveChildren: false,
  defaultProps: {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: '',
  },
  propsSchema: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
    tiktok: z.string().optional(),
    size: z.enum(['sm', 'md', 'lg']).default('md'),
  }),
  tags: ['social', 'links', 'facebook', 'instagram', 'icons'],
};

const AccordionComponent: ComponentDefinition = {
  type: 'Accordion',
  displayName: 'Akkordeon',
  description: 'Collapsible FAQ sections',
  icon: 'chevron-down',
  category: 'layout',
  canHaveChildren: true,
  defaultProps: {
    type: 'single',
    collapsible: true,
  },
  propsSchema: z.object({
    type: z.enum(['single', 'multiple']).default('single'),
    collapsible: z.boolean().default(true),
  }),
  tags: ['accordion', 'faq', 'collapsible', 'expand'],
};

const AccordionItemComponent: ComponentDefinition = {
  type: 'AccordionItem',
  displayName: 'Akkordeon-Element',
  description: 'Single accordion item',
  icon: 'chevron-down',
  category: 'layout',
  canHaveChildren: true,
  allowedParentTypes: ['Accordion'],
  defaultProps: {
    title: 'Accordion Title',
    value: 'item-1',
  },
  propsSchema: z.object({
    title: z.string().default('Accordion Title'),
    value: z.string().default('item-1'),
  }),
  tags: ['accordion', 'item', 'faq'],
};

const TabsComponent: ComponentDefinition = {
  type: 'Tabs',
  displayName: 'Tabs',
  description: 'Tabbed content container',
  icon: 'folder',
  category: 'layout',
  canHaveChildren: true,
  defaultProps: {
    defaultValue: 'tab-1',
  },
  propsSchema: z.object({
    defaultValue: z.string().default('tab-1'),
  }),
  tags: ['tabs', 'navigation', 'content'],
};

const TabComponent: ComponentDefinition = {
  type: 'Tab',
  displayName: 'Tab',
  description: 'Single tab content',
  icon: 'file',
  category: 'layout',
  canHaveChildren: true,
  allowedParentTypes: ['Tabs'],
  defaultProps: {
    label: 'Tab',
    value: 'tab-1',
  },
  propsSchema: z.object({
    label: z.string().default('Tab'),
    value: z.string().default('tab-1'),
  }),
  tags: ['tab', 'panel', 'content'],
};

const CarouselComponent: ComponentDefinition = {
  type: 'Carousel',
  displayName: 'Karussell',
  description: 'Image/content slider',
  icon: 'chevrons-left-right',
  category: 'layout',
  canHaveChildren: true,
  defaultProps: {
    autoplay: false,
    interval: 5000,
    showArrows: true,
    showDots: true,
  },
  propsSchema: z.object({
    autoplay: z.boolean().default(false),
    interval: z.number().default(5000),
    showArrows: z.boolean().default(true),
    showDots: z.boolean().default(true),
  }),
  tags: ['carousel', 'slider', 'gallery', 'images'],
};

const ProgressComponent: ComponentDefinition = {
  type: 'Progress',
  displayName: 'Fortschrittsbalken',
  description: 'Progress indicator',
  icon: 'loader',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    value: 60,
    max: 100,
    showLabel: false,
  },
  propsSchema: z.object({
    value: z.number().default(60),
    max: z.number().default(100),
    showLabel: z.boolean().default(false),
  }),
  tags: ['progress', 'bar', 'loading', 'indicator'],
};

const RatingComponent: ComponentDefinition = {
  type: 'Rating',
  displayName: 'Bewertung',
  description: 'Star rating display',
  icon: 'star',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    value: 4,
    max: 5,
    size: 'md',
  },
  propsSchema: z.object({
    value: z.number().min(0).max(5).default(4),
    max: z.number().default(5),
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    color: z.string().optional(),
  }),
  tags: ['rating', 'stars', 'review', 'score'],
};

const CounterComponent: ComponentDefinition = {
  type: 'Counter',
  displayName: 'Zähler',
  description: 'Animated number counter',
  icon: 'hash',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    value: 1000,
    prefix: '',
    suffix: '+',
    duration: 2000,
  },
  propsSchema: z.object({
    value: z.number().default(1000),
    prefix: z.string().default(''),
    suffix: z.string().default('+'),
    duration: z.number().default(2000),
  }),
  tags: ['counter', 'number', 'stats', 'animated'],
};

const QuoteComponent: ComponentDefinition = {
  type: 'Quote',
  displayName: 'Zitat',
  description: 'Blockquote with author',
  icon: 'quote',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    text: 'This is an inspiring quote.',
    author: 'Author Name',
    role: 'CEO, Company',
  },
  propsSchema: z.object({
    text: z.string().default('This is an inspiring quote.'),
    author: z.string().optional(),
    role: z.string().optional(),
  }),
  tags: ['quote', 'blockquote', 'testimonial', 'citation'],
};

const PricingCardComponent: ComponentDefinition = {
  type: 'PricingCard',
  displayName: 'Preis-Karte',
  description: 'Pricing plan card',
  icon: 'credit-card',
  category: 'content',
  canHaveChildren: true,
  defaultProps: {
    title: 'Pro Plan',
    price: '29',
    currency: '€',
    period: '/Monat',
    featured: false,
  },
  propsSchema: z.object({
    title: z.string().default('Pro Plan'),
    price: z.string().default('29'),
    currency: z.string().default('€'),
    period: z.string().default('/Monat'),
    featured: z.boolean().default(false),
    description: z.string().optional(),
  }),
  tags: ['pricing', 'card', 'plan', 'subscription'],
};

const FeatureCardComponent: ComponentDefinition = {
  type: 'FeatureCard',
  displayName: 'Feature-Karte',
  description: 'Feature highlight with icon',
  icon: 'star',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    icon: '⚡',
    title: 'Feature Title',
    description: 'Feature description goes here.',
  },
  propsSchema: z.object({
    icon: z.string().default('⚡'),
    title: z.string().default('Feature Title'),
    description: z.string().default('Feature description goes here.'),
  }),
  tags: ['feature', 'card', 'highlight', 'icon'],
};

const TestimonialCardComponent: ComponentDefinition = {
  type: 'TestimonialCard',
  displayName: 'Kundenstimme',
  description: 'Customer testimonial card',
  icon: 'message-circle',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    quote: 'Great service! Highly recommended.',
    author: 'Max Mustermann',
    role: 'CEO, Firma GmbH',
    avatar: '',
    rating: 5,
  },
  propsSchema: z.object({
    quote: z.string().default('Great service!'),
    author: z.string().default('Max Mustermann'),
    role: z.string().optional(),
    avatar: z.string().optional(),
    rating: z.number().min(0).max(5).default(5),
  }),
  tags: ['testimonial', 'review', 'quote', 'customer'],
};

const TeamMemberComponent: ComponentDefinition = {
  type: 'TeamMember',
  displayName: 'Teammitglied',
  description: 'Team member profile card',
  icon: 'user',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    name: 'Max Mustermann',
    role: 'CEO & Gründer',
    image: 'https://placehold.co/200x200',
    bio: '',
  },
  propsSchema: z.object({
    name: z.string().default('Max Mustermann'),
    role: z.string().default('CEO & Gründer'),
    image: z.string().default('https://placehold.co/200x200'),
    bio: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
  }),
  tags: ['team', 'member', 'profile', 'about'],
};

const LogoCloudComponent: ComponentDefinition = {
  type: 'LogoCloud',
  displayName: 'Logo-Sammlung',
  description: 'Display partner/client logos',
  icon: 'grid',
  category: 'content',
  canHaveChildren: true,
  defaultProps: {
    columns: 5,
    grayscale: true,
  },
  propsSchema: z.object({
    columns: z.number().min(2).max(8).default(5),
    grayscale: z.boolean().default(true),
  }),
  tags: ['logos', 'partners', 'clients', 'brands'],
};

const CTAComponent: ComponentDefinition = {
  type: 'CTA',
  displayName: 'Handlungsaufruf',
  description: 'Call-to-action section',
  icon: 'megaphone',
  category: 'layout',
  canHaveChildren: true,
  defaultProps: {
    variant: 'centered',
  },
  propsSchema: z.object({
    variant: z.enum(['centered', 'split', 'banner']).default('centered'),
  }),
  tags: ['cta', 'call-to-action', 'marketing', 'conversion'],
};

const BreadcrumbComponent: ComponentDefinition = {
  type: 'Breadcrumb',
  displayName: 'Navigationspfad',
  description: 'Navigation breadcrumb trail',
  icon: 'chevron-right',
  category: 'navigation',
  canHaveChildren: false,
  defaultProps: {
    separator: '/',
  },
  propsSchema: z.object({
    separator: z.string().default('/'),
    items: z.array(z.object({
      label: z.string(),
      href: z.string().optional(),
    })).default([]),
  }),
  tags: ['breadcrumb', 'navigation', 'path'],
};

const TableComponent: ComponentDefinition = {
  type: 'Table',
  displayName: 'Tabelle',
  description: 'Data table with rows and columns',
  icon: 'table',
  category: 'data',
  canHaveChildren: true,
  defaultProps: {
    striped: true,
    hoverable: true,
  },
  propsSchema: z.object({
    striped: z.boolean().default(true),
    hoverable: z.boolean().default(true),
    bordered: z.boolean().default(false),
  }),
  tags: ['table', 'data', 'grid', 'rows'],
};

const CodeBlockComponent: ComponentDefinition = {
  type: 'CodeBlock',
  displayName: 'Code-Block',
  description: 'Syntax highlighted code',
  icon: 'code',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    code: 'console.log("Hello World");',
    language: 'javascript',
  },
  propsSchema: z.object({
    code: z.string().default('console.log("Hello World");'),
    language: z.string().default('javascript'),
    showLineNumbers: z.boolean().default(true),
  }),
  tags: ['code', 'syntax', 'developer', 'programming'],
};

const TimelineComponent: ComponentDefinition = {
  type: 'Timeline',
  displayName: 'Zeitleiste',
  description: 'Vertical timeline for history/steps',
  icon: 'git-branch',
  category: 'layout',
  canHaveChildren: true,
  defaultProps: {
    variant: 'left',
  },
  propsSchema: z.object({
    variant: z.enum(['left', 'right', 'alternating']).default('left'),
  }),
  tags: ['timeline', 'history', 'steps', 'process'],
};

const TimelineItemComponent: ComponentDefinition = {
  type: 'TimelineItem',
  displayName: 'Zeitleisten-Eintrag',
  description: 'Single timeline entry',
  icon: 'circle',
  category: 'layout',
  canHaveChildren: true,
  allowedParentTypes: ['Timeline'],
  defaultProps: {
    date: '2024',
    title: 'Timeline Event',
  },
  propsSchema: z.object({
    date: z.string().default('2024'),
    title: z.string().default('Timeline Event'),
    icon: z.string().optional(),
  }),
  tags: ['timeline', 'item', 'event'],
};

const CountdownComponent: ComponentDefinition = {
  type: 'Countdown',
  displayName: 'Countdown',
  description: 'Countdown timer to date',
  icon: 'clock',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    showDays: true,
    showHours: true,
    showMinutes: true,
    showSeconds: true,
  },
  propsSchema: z.object({
    targetDate: z.string(),
    showDays: z.boolean().default(true),
    showHours: z.boolean().default(true),
    showMinutes: z.boolean().default(true),
    showSeconds: z.boolean().default(true),
  }),
  tags: ['countdown', 'timer', 'launch', 'event'],
};

const MarqueeComponent: ComponentDefinition = {
  type: 'Marquee',
  displayName: 'Lauftext',
  description: 'Scrolling text/content ticker',
  icon: 'arrow-right',
  category: 'content',
  canHaveChildren: true,
  defaultProps: {
    speed: 50,
    pauseOnHover: true,
  },
  propsSchema: z.object({
    speed: z.number().default(50),
    pauseOnHover: z.boolean().default(true),
    direction: z.enum(['left', 'right']).default('left'),
  }),
  tags: ['marquee', 'ticker', 'scroll', 'animation'],
};

// ============================================================================
// GATE COMPONENTS
// ============================================================================

const AuthGateComponent: ComponentDefinition = {
  type: 'AuthGate',
  displayName: 'Anmeldesperre',
  description: 'Show/hide content based on authentication',
  icon: 'shield',
  category: 'gates',
  canHaveChildren: true,
  defaultProps: {
    showWhen: 'authenticated',
  },
  propsSchema: z.object({
    showWhen: z.enum(['authenticated', 'unauthenticated']).default('authenticated'),
    redirectTo: z.string().optional(),
  }),
  tags: ['gate', 'auth', 'conditional', 'access'],
};

// ============================================================================
// AUTH / USER COMPONENTS
// ============================================================================

const LoginFormComponent: ComponentDefinition = {
  type: 'LoginForm',
  displayName: 'Anmeldeformular',
  description: 'Login form for site visitors',
  icon: 'log-in',
  category: 'auth',
  canHaveChildren: false,
  defaultProps: {
    title: 'Anmelden',
    subtitle: 'Melde dich mit deinem Konto an.',
    showRemember: true,
    showForgotPassword: true,
    showRegisterLink: true,
    registerUrl: '/register',
    forgotPasswordUrl: '/forgot-password',
    redirectAfterLogin: '/',
    buttonText: 'Anmelden',
    variant: 'card',
    showSocialLogin: false,
    emailLabel: 'E-Mail',
    passwordLabel: 'Passwort',
  },
  propsSchema: z.object({
    title: z.string().default('Anmelden'),
    subtitle: z.string().default('Melde dich mit deinem Konto an.'),
    showRemember: z.boolean().default(true),
    showForgotPassword: z.boolean().default(true),
    showRegisterLink: z.boolean().default(true),
    registerUrl: z.string().default('/register'),
    forgotPasswordUrl: z.string().default('/forgot-password'),
    redirectAfterLogin: z.string().default('/'),
    buttonText: z.string().default('Anmelden'),
    variant: z.enum(['card', 'inline', 'minimal']).default('card'),
    showSocialLogin: z.boolean().default(false),
    emailLabel: z.string().default('E-Mail'),
    passwordLabel: z.string().default('Passwort'),
    successMessage: z.string().optional(),
    errorMessage: z.string().optional(),
  }),
  tags: ['login', 'auth', 'signin', 'form', 'user', 'anmelden'],
};

const RegisterFormComponent: ComponentDefinition = {
  type: 'RegisterForm',
  displayName: 'Registrierungsformular',
  description: 'Registration form for new site visitors',
  icon: 'user-plus',
  category: 'auth',
  canHaveChildren: false,
  defaultProps: {
    title: 'Registrieren',
    subtitle: 'Erstelle ein neues Konto.',
    showName: true,
    showLoginLink: true,
    loginUrl: '/login',
    redirectAfterRegister: '/',
    buttonText: 'Konto erstellen',
    variant: 'card',
    requireEmailVerification: false,
    showTerms: false,
    termsUrl: '/agb',
    privacyUrl: '/datenschutz',
    nameLabel: 'Name',
    emailLabel: 'E-Mail',
    passwordLabel: 'Passwort',
    confirmPasswordLabel: 'Passwort bestätigen',
  },
  propsSchema: z.object({
    title: z.string().default('Registrieren'),
    subtitle: z.string().default('Erstelle ein neues Konto.'),
    showName: z.boolean().default(true),
    showLoginLink: z.boolean().default(true),
    loginUrl: z.string().default('/login'),
    redirectAfterRegister: z.string().default('/'),
    buttonText: z.string().default('Konto erstellen'),
    variant: z.enum(['card', 'inline', 'minimal']).default('card'),
    requireEmailVerification: z.boolean().default(false),
    showTerms: z.boolean().default(false),
    termsUrl: z.string().default('/agb'),
    privacyUrl: z.string().default('/datenschutz'),
    nameLabel: z.string().default('Name'),
    emailLabel: z.string().default('E-Mail'),
    passwordLabel: z.string().default('Passwort'),
    confirmPasswordLabel: z.string().default('Passwort bestätigen'),
    showPasswordStrength: z.boolean().default(true),
    minPasswordLength: z.number().min(6).max(32).default(8),
    successMessage: z.string().optional(),
    errorMessage: z.string().optional(),
  }),
  tags: ['register', 'signup', 'auth', 'form', 'user', 'registrieren'],
};

const PasswordResetFormComponent: ComponentDefinition = {
  type: 'PasswordResetForm',
  displayName: 'Passwort zurücksetzen',
  description: 'Password reset request form',
  icon: 'key',
  category: 'auth',
  canHaveChildren: false,
  defaultProps: {
    title: 'Passwort vergessen?',
    subtitle: 'Gib deine E-Mail-Adresse ein und wir senden dir einen Link.',
    buttonText: 'Link senden',
    variant: 'card',
    loginUrl: '/login',
    showLoginLink: true,
    emailLabel: 'E-Mail',
  },
  propsSchema: z.object({
    title: z.string().default('Passwort vergessen?'),
    subtitle: z.string().default('Gib deine E-Mail-Adresse ein und wir senden dir einen Link.'),
    buttonText: z.string().default('Link senden'),
    variant: z.enum(['card', 'inline', 'minimal']).default('card'),
    loginUrl: z.string().default('/login'),
    showLoginLink: z.boolean().default(true),
    emailLabel: z.string().default('E-Mail'),
    successMessage: z.string().optional(),
    errorMessage: z.string().optional(),
  }),
  tags: ['password', 'reset', 'forgot', 'auth', 'form'],
};

const UserProfileComponent: ComponentDefinition = {
  type: 'UserProfile',
  displayName: 'Benutzerprofil',
  description: 'Display and edit the logged-in visitor\'s profile',
  icon: 'user-circle',
  category: 'auth',
  canHaveChildren: false,
  defaultProps: {
    variant: 'card',
    showAvatar: true,
    showName: true,
    showEmail: true,
    showBio: true,
    editable: true,
    showChangePassword: true,
    showDeleteAccount: false,
    title: 'Mein Profil',
    saveButtonText: 'Speichern',
  },
  propsSchema: z.object({
    variant: z.enum(['card', 'inline', 'sidebar']).default('card'),
    showAvatar: z.boolean().default(true),
    showName: z.boolean().default(true),
    showEmail: z.boolean().default(true),
    showBio: z.boolean().default(true),
    editable: z.boolean().default(true),
    showChangePassword: z.boolean().default(true),
    showDeleteAccount: z.boolean().default(false),
    title: z.string().default('Mein Profil'),
    saveButtonText: z.string().default('Speichern'),
    avatarSize: z.enum(['sm', 'md', 'lg', 'xl']).default('lg'),
    showJoinDate: z.boolean().default(true),
    showRole: z.boolean().default(false),
  }),
  tags: ['profile', 'user', 'account', 'settings', 'profil', 'konto'],
};

const UserAvatarComponent: ComponentDefinition = {
  type: 'UserAvatar',
  displayName: 'Benutzer-Avatar',
  description: 'Show the logged-in visitor\'s avatar and name',
  icon: 'circle-user',
  category: 'auth',
  canHaveChildren: false,
  defaultProps: {
    size: 'md',
    showName: true,
    showRole: false,
    fallbackIcon: 'user',
    namePosition: 'right',
    showDropdown: true,
    profileUrl: '/profil',
    logoutRedirect: '/',
  },
  propsSchema: z.object({
    size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']).default('md'),
    showName: z.boolean().default(true),
    showRole: z.boolean().default(false),
    fallbackIcon: z.string().default('user'),
    namePosition: z.enum(['right', 'below']).default('right'),
    showDropdown: z.boolean().default(true),
    profileUrl: z.string().default('/profil'),
    logoutRedirect: z.string().default('/'),
    showLoginButton: z.boolean().default(true),
    loginUrl: z.string().default('/login'),
    loginButtonText: z.string().default('Anmelden'),
  }),
  tags: ['avatar', 'user', 'profile', 'picture', 'account'],
};

const LogoutButtonComponent: ComponentDefinition = {
  type: 'LogoutButton',
  displayName: 'Abmelde-Button',
  description: 'A button that logs out the current visitor',
  icon: 'log-out',
  category: 'auth',
  canHaveChildren: false,
  defaultProps: {
    text: 'Abmelden',
    variant: 'outline',
    size: 'md',
    redirectTo: '/',
    confirmLogout: false,
    confirmMessage: 'Möchtest du dich wirklich abmelden?',
  },
  propsSchema: z.object({
    text: z.string().default('Abmelden'),
    variant: z.enum(['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link']).default('outline'),
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    redirectTo: z.string().default('/'),
    confirmLogout: z.boolean().default(false),
    confirmMessage: z.string().default('Möchtest du dich wirklich abmelden?'),
    icon: z.string().optional(),
    showIcon: z.boolean().default(true),
    fullWidth: z.boolean().default(false),
  }),
  tags: ['logout', 'signout', 'auth', 'button', 'abmelden'],
};

const MemberListComponent: ComponentDefinition = {
  type: 'MemberList',
  displayName: 'Mitglieder-Liste',
  description: 'Display a list of registered site members',
  icon: 'users',
  category: 'auth',
  canHaveChildren: false,
  defaultProps: {
    layout: 'grid',
    columns: 3,
    showAvatar: true,
    showName: true,
    showRole: true,
    showBio: false,
    showJoinDate: false,
    pageSize: 12,
    showSearch: true,
    filterByRole: 'all',
    title: 'Unsere Mitglieder',
  },
  propsSchema: z.object({
    layout: z.enum(['grid', 'list', 'compact']).default('grid'),
    columns: z.number().min(1).max(6).default(3),
    columnsMobile: z.number().min(1).max(3).default(1),
    showAvatar: z.boolean().default(true),
    showName: z.boolean().default(true),
    showRole: z.boolean().default(true),
    showBio: z.boolean().default(false),
    showJoinDate: z.boolean().default(false),
    pageSize: z.number().min(4).max(100).default(12),
    showSearch: z.boolean().default(true),
    filterByRole: z.enum(['all', 'admin', 'moderator', 'member', 'vip']).default('all'),
    title: z.string().default('Unsere Mitglieder'),
    showPagination: z.boolean().default(true),
    avatarSize: z.enum(['sm', 'md', 'lg']).default('md'),
    linkToProfile: z.boolean().default(true),
    profileUrlPattern: z.string().default('/mitglieder/{id}'),
  }),
  tags: ['members', 'users', 'community', 'directory', 'mitglieder', 'liste'],
};

const ProtectedContentComponent: ComponentDefinition = {
  type: 'ProtectedContent',
  displayName: 'Geschützter Inhalt',
  description: 'Wrap content that requires specific roles or authentication',
  icon: 'lock',
  category: 'auth',
  canHaveChildren: true,
  defaultProps: {
    requiredRole: 'any',
    showFallback: true,
    fallbackMessage: 'Du musst angemeldet sein, um diesen Inhalt zu sehen.',
    showLoginButton: true,
    loginUrl: '/login',
    loginButtonText: 'Jetzt anmelden',
  },
  propsSchema: z.object({
    requiredRole: z.enum(['any', 'admin', 'moderator', 'member', 'vip']).default('any'),
    showFallback: z.boolean().default(true),
    fallbackMessage: z.string().default('Du musst angemeldet sein, um diesen Inhalt zu sehen.'),
    showLoginButton: z.boolean().default(true),
    loginUrl: z.string().default('/login'),
    loginButtonText: z.string().default('Jetzt anmelden'),
    hideCompletely: z.boolean().default(false),
  }),
  tags: ['protected', 'restricted', 'role', 'access', 'geschützt', 'zugang'],
};

// ============================================================================
// COMMERCE / SHOP COMPONENTS
// ============================================================================

const ProductListComponent: ComponentDefinition = {
  type: 'ProductList',
  displayName: 'Produktliste',
  description: 'A grid/list of shop products, dynamically loaded from the site',
  icon: 'shopping-cart',
  category: 'commerce',
  canHaveChildren: true,
  allowedChildrenTypes: ['ProductCard'],
  defaultProps: {
    layout: 'grid',
    columns: 4,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    categoryFilter: '',
  },
  propsSchema: z.object({
    layout: z.enum(['grid', 'list']).default('grid'),
    columns: z.number().min(1).max(6).default(4),
    limit: z.number().min(1).max(100).default(12),
    sortBy: z.enum(['createdAt', 'price', 'name', 'updatedAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    categoryFilter: z.string().default(''),
  }),
  dataBindings: [
    { name: 'products', description: 'Product data source', type: 'listRecords', collection: 'products' },
  ],
  tags: ['shop', 'products', 'list', 'grid', 'catalog', 'produkte', 'shop'],
};

const ProductCardComponent: ComponentDefinition = {
  type: 'ProductCard',
  displayName: 'Produktkarte',
  description: 'Displays a single product with image, name, price and add-to-cart',
  icon: 'shopping-cart',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    showPrice: true,
    showAddToCart: true,
    showDescription: false,
    showBadge: true,
    imageAspect: 'square',
    productName: 'Beispielprodukt',
    productPrice: 29.99,
    productImage: '',
    productDescription: 'Kurze Produktbeschreibung',
    productBadge: '',
    productSlug: '',
  },
  propsSchema: z.object({
    showPrice: z.boolean().default(true),
    showAddToCart: z.boolean().default(true),
    showDescription: z.boolean().default(false),
    showBadge: z.boolean().default(true),
    imageAspect: z.enum(['square', '4:3', '16:9', '3:4']).default('square'),
    productName: z.string().default('Beispielprodukt'),
    productPrice: z.number().default(29.99),
    productComparePrice: z.number().optional(),
    productImage: z.string().default(''),
    productDescription: z.string().default(''),
    productBadge: z.string().default(''),
    productSlug: z.string().default(''),
    productId: z.string().default(''),
  }),
  dataBindings: [
    { name: 'product', description: 'Bound product record', type: 'currentRecord', collection: 'products' },
  ],
  tags: ['shop', 'product', 'card', 'item', 'produkt', 'karte'],
};

const ProductDetailComponent: ComponentDefinition = {
  type: 'ProductDetail',
  displayName: 'Produktdetail',
  description: 'Full product detail view with gallery, description and purchase',
  icon: 'shopping-cart',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    showGallery: true,
    showDescription: true,
    showSku: false,
    showInventory: false,
    showAddToCart: true,
    showTax: true,
    productName: 'Beispielprodukt',
    productPrice: 49.99,
    productDescription: 'Ausführliche Produktbeschreibung mit allen Details.',
    productImages: [],
    productSku: '',
  },
  propsSchema: z.object({
    showGallery: z.boolean().default(true),
    showDescription: z.boolean().default(true),
    showSku: z.boolean().default(false),
    showInventory: z.boolean().default(false),
    showAddToCart: z.boolean().default(true),
    showTax: z.boolean().default(true),
    productName: z.string().default('Beispielprodukt'),
    productPrice: z.number().default(49.99),
    productComparePrice: z.number().optional(),
    productDescription: z.string().default(''),
    productImages: z.array(z.string()).default([]),
    productSku: z.string().default(''),
    productInventory: z.number().optional(),
    productId: z.string().default(''),
  }),
  dataBindings: [
    { name: 'product', description: 'Bound product record', type: 'currentRecord', collection: 'products' },
  ],
  tags: ['shop', 'product', 'detail', 'page', 'produkt', 'einzelansicht'],
};

const AddToCartButtonComponent: ComponentDefinition = {
  type: 'AddToCartButton',
  displayName: 'Warenkorb-Button',
  description: 'Button to add a product to the shopping cart',
  icon: 'shopping-cart',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    text: 'In den Warenkorb',
    variant: 'primary',
    fullWidth: false,
    productId: '',
  },
  propsSchema: z.object({
    text: z.string().default('In den Warenkorb'),
    variant: z.enum(['primary', 'secondary', 'outline']).default('primary'),
    fullWidth: z.boolean().default(false),
    productId: z.string().default(''),
  }),
  tags: ['shop', 'cart', 'button', 'warenkorb', 'kaufen'],
};

const CartSummaryComponent: ComponentDefinition = {
  type: 'CartSummary',
  displayName: 'Warenkorb-Zusammenfassung',
  description: 'Shows cart totals, tax and shipping with checkout button',
  icon: 'shopping-cart',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    showTax: true,
    showShipping: true,
    showCheckoutButton: true,
    checkoutUrl: '/checkout',
  },
  propsSchema: z.object({
    showTax: z.boolean().default(true),
    showShipping: z.boolean().default(true),
    showCheckoutButton: z.boolean().default(true),
    checkoutUrl: z.string().default('/checkout'),
  }),
  tags: ['shop', 'cart', 'summary', 'warenkorb', 'zusammenfassung', 'kasse'],
};

const CartItemsComponent: ComponentDefinition = {
  type: 'CartItems',
  displayName: 'Warenkorb-Artikel',
  description: 'Displays the list of items currently in the shopping cart',
  icon: 'shopping-cart',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    showQuantityControls: true,
    showRemoveButton: true,
    showImage: true,
  },
  propsSchema: z.object({
    showQuantityControls: z.boolean().default(true),
    showRemoveButton: z.boolean().default(true),
    showImage: z.boolean().default(true),
  }),
  tags: ['shop', 'cart', 'items', 'warenkorb', 'artikel'],
};

const CheckoutButtonComponent: ComponentDefinition = {
  type: 'CheckoutButton',
  displayName: 'Kasse-Button',
  description: 'Button to proceed to checkout',
  icon: 'credit-card',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    text: 'Zur Kasse',
    variant: 'primary',
    fullWidth: true,
  },
  propsSchema: z.object({
    text: z.string().default('Zur Kasse'),
    variant: z.enum(['primary', 'secondary', 'outline']).default('primary'),
    fullWidth: z.boolean().default(true),
  }),
  tags: ['shop', 'checkout', 'button', 'kasse', 'bezahlen'],
};

const PriceDisplayComponent: ComponentDefinition = {
  type: 'PriceDisplay',
  displayName: 'Preisanzeige',
  description: 'Displays product price with optional compare/sale price',
  icon: 'tag',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    showCurrency: true,
    showOriginalPrice: true,
    size: 'md',
    price: 29.99,
    comparePrice: 0,
    currency: '€',
  },
  propsSchema: z.object({
    showCurrency: z.boolean().default(true),
    showOriginalPrice: z.boolean().default(true),
    size: z.enum(['sm', 'md', 'lg', 'xl']).default('md'),
    price: z.number().default(29.99),
    comparePrice: z.number().default(0),
    currency: z.string().default('€'),
    productId: z.string().default(''),
  }),
  dataBindings: [
    { name: 'product', description: 'Bound product for price', type: 'currentRecord', collection: 'products' },
  ],
  tags: ['shop', 'price', 'money', 'preis', 'betrag'],
};

// ============================================================================
// WISHLIST & FAVORITES
// ============================================================================

const WishlistButtonComponent: ComponentDefinition = {
  type: 'WishlistButton',
  displayName: 'Wunschliste-Button',
  description: 'Button to add/remove products from wishlist',
  icon: 'heart',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    variant: 'icon',
    showCount: false,
    addText: 'Zur Wunschliste',
    removeText: 'Von Wunschliste entfernen',
  },
  propsSchema: z.object({
    variant: z.enum(['icon', 'button', 'text']).default('icon'),
    showCount: z.boolean().default(false),
    addText: z.string().default('Zur Wunschliste'),
    removeText: z.string().default('Von Wunschliste entfernen'),
    productId: z.string().optional(),
    size: z.enum(['sm', 'md', 'lg']).default('md'),
  }),
  dataBindings: [
    { name: 'product', description: 'Product to add/remove', type: 'currentRecord', collection: 'products' },
  ],
  tags: ['shop', 'wishlist', 'favorites', 'heart', 'wunschliste', 'merken'],
};

const WishlistDisplayComponent: ComponentDefinition = {
  type: 'WishlistDisplay',
  displayName: 'Wunschliste-Anzeige',
  description: 'Display wishlist items',
  icon: 'heart',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    layout: 'grid',
    columns: 4,
    showRemoveButton: true,
    showAddToCart: true,
    emptyText: 'Deine Wunschliste ist leer',
  },
  propsSchema: z.object({
    layout: z.enum(['grid', 'list']).default('grid'),
    columns: z.number().min(1).max(6).default(4),
    showRemoveButton: z.boolean().default(true),
    showAddToCart: z.boolean().default(true),
    emptyText: z.string().default('Deine Wunschliste ist leer'),
  }),
  tags: ['shop', 'wishlist', 'favorites', 'wunschliste', 'liste'],
};

// ============================================================================
// SEARCH COMPONENTS
// ============================================================================

const SearchBoxComponent: ComponentDefinition = {
  type: 'SearchBox',
  displayName: 'Suchfeld',
  description: 'Search input for products or content',
  icon: 'search',
  category: 'ui',
  canHaveChildren: false,
  defaultProps: {
    placeholder: 'Suchen...',
    variant: 'default',
    size: 'md',
    searchType: 'products',
    showIcon: true,
    showButton: false,
    buttonText: 'Suchen',
    instantSearch: true,
  },
  propsSchema: z.object({
    placeholder: z.string().default('Suchen...'),
    variant: z.enum(['default', 'outlined', 'filled', 'minimal']).default('default'),
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    searchType: z.enum(['products', 'content', 'all']).default('products'),
    showIcon: z.boolean().default(true),
    showButton: z.boolean().default(false),
    buttonText: z.string().default('Suchen'),
    instantSearch: z.boolean().default(true),
    minChars: z.number().min(1).max(10).default(2),
    resultsLimit: z.number().min(1).max(50).default(10),
  }),
  tags: ['search', 'suche', 'find', 'query', 'products'],
};

const SearchResultsComponent: ComponentDefinition = {
  type: 'SearchResults',
  displayName: 'Suchergebnisse',
  description: 'Display search results',
  icon: 'list',
  category: 'ui',
  canHaveChildren: false,
  defaultProps: {
    layout: 'grid',
    columns: 4,
    showNoResults: true,
    noResultsText: 'Keine Ergebnisse gefunden',
    showFilters: true,
  },
  propsSchema: z.object({
    layout: z.enum(['grid', 'list']).default('grid'),
    columns: z.number().min(1).max(6).default(4),
    showNoResults: z.boolean().default(true),
    noResultsText: z.string().default('Keine Ergebnisse gefunden'),
    showFilters: z.boolean().default(true),
    showSortOptions: z.boolean().default(true),
    showPagination: z.boolean().default(true),
    pageSize: z.number().min(1).max(100).default(20),
  }),
  tags: ['search', 'results', 'find', 'ergebnisse', 'suche'],
};

// ============================================================================
// COOKIE CONSENT / GDPR
// ============================================================================

const CookieBannerComponent: ComponentDefinition = {
  type: 'CookieBanner',
  displayName: 'Cookie-Banner',
  description: 'GDPR-compliant cookie consent banner',
  icon: 'cookie',
  category: 'ui',
  canHaveChildren: false,
  defaultProps: {
    position: 'bottom',
    variant: 'bar',
    title: 'Cookie-Einstellungen',
    description: 'Wir verwenden Cookies, um deine Erfahrung auf unserer Website zu verbessern.',
    acceptAllText: 'Alle akzeptieren',
    acceptNecessaryText: 'Nur notwendige',
    settingsText: 'Einstellungen',
    privacyLinkText: 'Datenschutzerklärung',
    privacyLinkUrl: '/datenschutz',
    showCategories: true,
  },
  propsSchema: z.object({
    position: z.enum(['top', 'bottom', 'center']).default('bottom'),
    variant: z.enum(['bar', 'modal', 'compact']).default('bar'),
    title: z.string().default('Cookie-Einstellungen'),
    description: z.string().default('Wir verwenden Cookies, um deine Erfahrung auf unserer Website zu verbessern.'),
    acceptAllText: z.string().default('Alle akzeptieren'),
    acceptNecessaryText: z.string().default('Nur notwendige'),
    settingsText: z.string().default('Einstellungen'),
    privacyLinkText: z.string().default('Datenschutzerklärung'),
    privacyLinkUrl: z.string().default('/datenschutz'),
    showCategories: z.boolean().default(true),
    categories: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      required: z.boolean(),
    })).optional(),
  }),
  tags: ['cookie', 'gdpr', 'dsgvo', 'consent', 'privacy', 'datenschutz'],
};

// ============================================================================
// PRODUCT REVIEWS
// ============================================================================

const ProductReviewsComponent: ComponentDefinition = {
  type: 'ProductReviews',
  displayName: 'Produktbewertungen',
  description: 'Display product reviews and ratings',
  icon: 'star',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    showSummary: true,
    showWriteReview: true,
    showAvatar: true,
    sortBy: 'newest',
    limit: 10,
  },
  propsSchema: z.object({
    showSummary: z.boolean().default(true),
    showWriteReview: z.boolean().default(true),
    showAvatar: z.boolean().default(true),
    sortBy: z.enum(['newest', 'oldest', 'highest', 'lowest', 'helpful']).default('newest'),
    limit: z.number().min(1).max(100).default(10),
    productId: z.string().optional(),
    emptyText: z.string().default('Noch keine Bewertungen vorhanden'),
    writeReviewText: z.string().default('Bewertung schreiben'),
  }),
  dataBindings: [
    { name: 'product', description: 'Product to show reviews for', type: 'currentRecord', collection: 'products' },
  ],
  tags: ['reviews', 'rating', 'bewertungen', 'sterne', 'feedback'],
};

const ReviewFormComponent: ComponentDefinition = {
  type: 'ReviewForm',
  displayName: 'Bewertungsformular',
  description: 'Form to submit a product review',
  icon: 'edit',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    showRating: true,
    showTitle: true,
    showContent: true,
    showImages: false,
    submitText: 'Bewertung absenden',
    titlePlaceholder: 'Titel deiner Bewertung',
    contentPlaceholder: 'Teile deine Erfahrung mit diesem Produkt...',
    successMessage: 'Vielen Dank für deine Bewertung!',
  },
  propsSchema: z.object({
    showRating: z.boolean().default(true),
    showTitle: z.boolean().default(true),
    showContent: z.boolean().default(true),
    showImages: z.boolean().default(false),
    submitText: z.string().default('Bewertung absenden'),
    titlePlaceholder: z.string().default('Titel deiner Bewertung'),
    contentPlaceholder: z.string().default('Teile deine Erfahrung mit diesem Produkt...'),
    successMessage: z.string().default('Vielen Dank für deine Bewertung!'),
    productId: z.string().optional(),
    requirePurchase: z.boolean().default(false),
  }),
  dataBindings: [
    { name: 'product', description: 'Product to review', type: 'currentRecord', collection: 'products' },
  ],
  tags: ['review', 'form', 'bewertung', 'schreiben', 'feedback'],
};

// ============================================================================
// CATEGORY FILTER
// ============================================================================

const CategoryFilterComponent: ComponentDefinition = {
  type: 'CategoryFilter',
  displayName: 'Kategorie-Filter',
  description: 'Filter products by category',
  icon: 'filter',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    layout: 'horizontal',
    showCount: true,
    showAllOption: true,
    allText: 'Alle Kategorien',
  },
  propsSchema: z.object({
    layout: z.enum(['horizontal', 'vertical', 'dropdown']).default('horizontal'),
    showCount: z.boolean().default(true),
    showAllOption: z.boolean().default(true),
    allText: z.string().default('Alle Kategorien'),
    showIcons: z.boolean().default(false),
    collapsible: z.boolean().default(false),
    multiSelect: z.boolean().default(false),
  }),
  tags: ['filter', 'category', 'kategorie', 'shop', 'navigation'],
};

// ============================================================================
// CHECKOUT FORM
// ============================================================================

const CheckoutFormComponent: ComponentDefinition = {
  type: 'CheckoutForm',
  displayName: 'Checkout-Formular',
  description: 'Complete checkout form with address and payment',
  icon: 'shopping-cart',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    showBillingAddress: true,
    showShippingAddress: true,
    showPaymentMethods: true,
    showOrderSummary: true,
    showCouponField: true,
    showTermsCheckbox: true,
    submitText: 'Jetzt kaufen',
    termsText: 'Ich akzeptiere die AGB und Datenschutzbestimmungen',
    termsLinkUrl: '/terms',
  },
  propsSchema: z.object({
    showBillingAddress: z.boolean().default(true),
    showShippingAddress: z.boolean().default(true),
    showPaymentMethods: z.boolean().default(true),
    showOrderSummary: z.boolean().default(true),
    showCouponField: z.boolean().default(true),
    showTermsCheckbox: z.boolean().default(true),
    submitText: z.string().default('Jetzt kaufen'),
    termsText: z.string().default('Ich akzeptiere die AGB und Datenschutzbestimmungen'),
    termsLinkUrl: z.string().default('/terms'),
    successRedirect: z.string().default('/order-confirmation'),
    guestCheckout: z.boolean().default(true),
  }),
  tags: ['checkout', 'form', 'payment', 'kasse', 'bezahlung', 'address'],
};

const AddressFormComponent: ComponentDefinition = {
  type: 'AddressForm',
  displayName: 'Adressformular',
  description: 'Reusable address input form',
  icon: 'map-pin',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    type: 'billing',
    showCompanyField: false,
    showPhoneField: true,
    countries: ['DE', 'AT', 'CH'],
    defaultCountry: 'DE',
  },
  propsSchema: z.object({
    type: z.enum(['billing', 'shipping']).default('billing'),
    showCompanyField: z.boolean().default(false),
    showPhoneField: z.boolean().default(true),
    countries: z.array(z.string()).default(['DE', 'AT', 'CH']),
    defaultCountry: z.string().default('DE'),
    required: z.boolean().default(true),
  }),
  tags: ['address', 'form', 'adresse', 'billing', 'shipping'],
};

// ============================================================================
// PRODUCT VARIANTS
// ============================================================================

const ProductVariantSelectorComponent: ComponentDefinition = {
  type: 'ProductVariantSelector',
  displayName: 'Varianten-Auswahl',
  description: 'Select product variants like size, color, etc.',
  icon: 'sliders',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    layout: 'buttons',
    showLabel: true,
    showStock: true,
    showPrice: true,
    outOfStockBehavior: 'disable',
  },
  propsSchema: z.object({
    layout: z.enum(['buttons', 'dropdown', 'swatches']).default('buttons'),
    showLabel: z.boolean().default(true),
    showStock: z.boolean().default(true),
    showPrice: z.boolean().default(true),
    outOfStockBehavior: z.enum(['disable', 'hide', 'show']).default('disable'),
    optionType: z.enum(['size', 'color', 'material', 'custom']).optional(),
    productId: z.string().optional(),
  }),
  dataBindings: [
    { name: 'product', description: 'Product with variants', type: 'currentRecord', collection: 'products' },
  ],
  tags: ['variants', 'size', 'color', 'options', 'varianten', 'größe', 'farbe'],
};

const ColorSwatchComponent: ComponentDefinition = {
  type: 'ColorSwatch',
  displayName: 'Farbauswahl',
  description: 'Color selector with visual swatches',
  icon: 'palette',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    size: 'md',
    shape: 'circle',
    showLabel: false,
    showSelected: true,
  },
  propsSchema: z.object({
    size: z.enum(['sm', 'md', 'lg']).default('md'),
    shape: z.enum(['circle', 'square', 'rounded']).default('circle'),
    showLabel: z.boolean().default(false),
    showSelected: z.boolean().default(true),
    colors: z.array(z.object({
      value: z.string(),
      label: z.string(),
      hex: z.string(),
    })).optional(),
    productId: z.string().optional(),
  }),
  dataBindings: [
    { name: 'product', description: 'Product with color options', type: 'currentRecord', collection: 'products' },
  ],
  tags: ['color', 'swatch', 'farbe', 'auswahl', 'variant'],
};

const SizeSelectorComponent: ComponentDefinition = {
  type: 'SizeSelector',
  displayName: 'Größenauswahl',
  description: 'Size selector with availability display',
  icon: 'ruler',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    layout: 'buttons',
    showSizeGuide: true,
    sizeGuideText: 'Größentabelle',
    showStock: true,
  },
  propsSchema: z.object({
    layout: z.enum(['buttons', 'dropdown']).default('buttons'),
    showSizeGuide: z.boolean().default(true),
    sizeGuideText: z.string().default('Größentabelle'),
    sizeGuideUrl: z.string().optional(),
    showStock: z.boolean().default(true),
    sizes: z.array(z.object({
      value: z.string(),
      label: z.string(),
      inStock: z.boolean(),
    })).optional(),
    productId: z.string().optional(),
  }),
  dataBindings: [
    { name: 'product', description: 'Product with size options', type: 'currentRecord', collection: 'products' },
  ],
  tags: ['size', 'größe', 'auswahl', 'variant', 'clothing'],
};

// ============================================================================
// STOCK & AVAILABILITY
// ============================================================================

const StockIndicatorComponent: ComponentDefinition = {
  type: 'StockIndicator',
  displayName: 'Lagerbestand-Anzeige',
  description: 'Show product stock status',
  icon: 'box',
  category: 'commerce',
  canHaveChildren: false,
  defaultProps: {
    showExactCount: false,
    lowStockThreshold: 5,
    inStockText: 'Auf Lager',
    lowStockText: 'Nur noch wenige verfügbar',
    outOfStockText: 'Ausverkauft',
    showIcon: true,
  },
  propsSchema: z.object({
    showExactCount: z.boolean().default(false),
    lowStockThreshold: z.number().default(5),
    inStockText: z.string().default('Auf Lager'),
    lowStockText: z.string().default('Nur noch wenige verfügbar'),
    outOfStockText: z.string().default('Ausverkauft'),
    showIcon: z.boolean().default(true),
    productId: z.string().optional(),
  }),
  dataBindings: [
    { name: 'product', description: 'Product to show stock for', type: 'currentRecord', collection: 'products' },
  ],
  tags: ['stock', 'inventory', 'lager', 'bestand', 'verfügbarkeit'],
};

// ============================================================================
// SYMBOL INSTANCE - For Global Symbols
// ============================================================================

const SymbolInstanceComponent: ComponentDefinition = {
  type: 'SymbolInstance',
  displayName: 'Komponente',
  description: 'An instance of a reusable global symbol',
  icon: 'component',
  category: 'advanced',
  canHaveChildren: false, // Children come from the symbol definition
  defaultProps: {
    symbolId: '',
    isDetached: false,
  },
  propsSchema: z.object({
    symbolId: z.string().min(1, 'Symbol ID is required'),
    isDetached: z.boolean().default(false),
    overrides: z.record(z.unknown()).optional(),
  }),
  tags: ['symbol', 'component', 'reusable', 'instance'],
};

// ============================================================================
// REGISTER ALL BUILT-IN COMPONENTS
// ============================================================================

export function registerBuiltinComponents(): void {
  // Layout
  componentRegistry.register(SectionComponent);
  componentRegistry.register(ContainerComponent);
  componentRegistry.register(StackComponent);
  componentRegistry.register(GridComponent);
  componentRegistry.register(DividerComponent);
  componentRegistry.register(SpacerComponent);
  componentRegistry.register(AccordionComponent);
  componentRegistry.register(AccordionItemComponent);
  componentRegistry.register(TabsComponent);
  componentRegistry.register(TabComponent);
  componentRegistry.register(CarouselComponent);
  componentRegistry.register(TimelineComponent);
  componentRegistry.register(TimelineItemComponent);
  componentRegistry.register(CTAComponent);
  
  // Content
  componentRegistry.register(TextComponent);
  componentRegistry.register(HeadingComponent);
  componentRegistry.register(ImageComponent);
  componentRegistry.register(IconComponent);
  componentRegistry.register(AvatarComponent);
  componentRegistry.register(ProgressComponent);
  componentRegistry.register(RatingComponent);
  componentRegistry.register(CounterComponent);
  componentRegistry.register(QuoteComponent);
  componentRegistry.register(CodeBlockComponent);
  componentRegistry.register(CountdownComponent);
  componentRegistry.register(MarqueeComponent);
  
  // UI
  componentRegistry.register(ButtonComponent);
  componentRegistry.register(CardComponent);
  componentRegistry.register(BadgeComponent);
  componentRegistry.register(AlertComponent);
  componentRegistry.register(PricingCardComponent);
  componentRegistry.register(FeatureCardComponent);
  componentRegistry.register(TestimonialCardComponent);
  componentRegistry.register(TeamMemberComponent);
  componentRegistry.register(LogoCloudComponent);
  
  // Forms
  componentRegistry.register(FormComponent);
  componentRegistry.register(InputComponent);
  componentRegistry.register(TextareaComponent);
  componentRegistry.register(SelectComponent);
  componentRegistry.register(CheckboxComponent);
  componentRegistry.register(SubmitButtonComponent);
  
  // Navigation
  componentRegistry.register(NavbarComponent);
  componentRegistry.register(FooterComponent);
  componentRegistry.register(LinkComponent);
  componentRegistry.register(SocialLinksComponent);
  componentRegistry.register(BreadcrumbComponent);
  
  // Media
  componentRegistry.register(VideoComponent);
  componentRegistry.register(MapComponent);
  
  // Data
  componentRegistry.register(CollectionListComponent);
  componentRegistry.register(RecordFieldTextComponent);
  componentRegistry.register(PaginationComponent);
  componentRegistry.register(TableComponent);
  
  // Gates
  componentRegistry.register(AuthGateComponent);
  
  // Auth / Users
  componentRegistry.register(LoginFormComponent);
  componentRegistry.register(RegisterFormComponent);
  componentRegistry.register(PasswordResetFormComponent);
  componentRegistry.register(UserProfileComponent);
  componentRegistry.register(UserAvatarComponent);
  componentRegistry.register(LogoutButtonComponent);
  componentRegistry.register(MemberListComponent);
  componentRegistry.register(ProtectedContentComponent);
  
  // Symbols
  componentRegistry.register(SymbolInstanceComponent);
  
  // Commerce / Shop
  componentRegistry.register(ProductListComponent);
  componentRegistry.register(ProductCardComponent);
  componentRegistry.register(ProductDetailComponent);
  componentRegistry.register(AddToCartButtonComponent);
  componentRegistry.register(CartSummaryComponent);
  componentRegistry.register(CartItemsComponent);
  componentRegistry.register(CheckoutButtonComponent);
  componentRegistry.register(PriceDisplayComponent);
  componentRegistry.register(WishlistButtonComponent);
  componentRegistry.register(WishlistDisplayComponent);
  componentRegistry.register(ProductReviewsComponent);
  componentRegistry.register(ReviewFormComponent);
  componentRegistry.register(CategoryFilterComponent);
  componentRegistry.register(CheckoutFormComponent);
  componentRegistry.register(AddressFormComponent);
  componentRegistry.register(ProductVariantSelectorComponent);
  componentRegistry.register(ColorSwatchComponent);
  componentRegistry.register(SizeSelectorComponent);
  componentRegistry.register(StockIndicatorComponent);
  
  // Search
  componentRegistry.register(SearchBoxComponent);
  componentRegistry.register(SearchResultsComponent);
  
  // GDPR / Cookie Consent
  componentRegistry.register(CookieBannerComponent);
}

// Initialize on import
registerBuiltinComponents();
