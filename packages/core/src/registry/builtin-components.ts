import { z } from 'zod';
import { componentRegistry, type ComponentDefinition } from './component-registry';

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

const SectionComponent: ComponentDefinition = {
  type: 'Section',
  displayName: 'Section',
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
    maxWidth: 'lg',
    centered: true,
  },
  propsSchema: z.object({
    maxWidth: z.enum(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full']).default('lg'),
    centered: z.boolean().default(true),
    minHeight: z.enum(['auto', 'full', 'screen']).default('auto'),
  }),
  tags: ['layout', 'container', 'wrapper', 'center'],
};

const StackComponent: ComponentDefinition = {
  type: 'Stack',
  displayName: 'Stack',
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
  displayName: 'Grid',
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
  displayName: 'Divider',
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
  displayName: 'Spacer',
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
  description: 'Paragraph text',
  icon: 'type',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    text: 'Enter your text here',
  },
  propsSchema: z.object({
    text: z.string().default('Enter your text here'),
  }),
  tags: ['content', 'text', 'paragraph', 'p'],
};

const HeadingComponent: ComponentDefinition = {
  type: 'Heading',
  displayName: 'Heading',
  description: 'Heading text (h1-h6)',
  icon: 'heading',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    level: 2,
    text: 'Heading',
  },
  propsSchema: z.object({
    level: z.number().min(1).max(6).default(2),
    text: z.string().default('Heading'),
  }),
  tags: ['content', 'heading', 'title', 'h1', 'h2', 'h3'],
};

const ImageComponent: ComponentDefinition = {
  type: 'Image',
  displayName: 'Image',
  description: 'Display an image',
  icon: 'image',
  category: 'content',
  canHaveChildren: false,
  defaultProps: {
    src: 'https://placehold.co/600x400',
    alt: 'Image description',
    objectFit: 'cover',
  },
  propsSchema: z.object({
    src: z.string().default('https://placehold.co/600x400'),
    alt: z.string().default('Image description'),
    objectFit: z.enum(['cover', 'contain', 'fill', 'none', 'scale-down']).default('cover'),
    width: z.string().optional(),
    height: z.string().optional(),
  }),
  tags: ['content', 'image', 'media', 'picture'],
};

const IconComponent: ComponentDefinition = {
  type: 'Icon',
  displayName: 'Icon',
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
  description: 'Clickable button',
  icon: 'square',
  category: 'ui',
  canHaveChildren: false,
  defaultProps: {
    text: 'Click me',
    variant: 'primary',
    size: 'md',
  },
  propsSchema: z.object({
    text: z.string().default('Click me'),
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
  displayName: 'Card',
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
  displayName: 'Badge',
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
  displayName: 'Alert',
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
  displayName: 'Form',
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
  displayName: 'Input',
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
  displayName: 'Textarea',
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
  displayName: 'Select',
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
  displayName: 'Checkbox',
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
  displayName: 'Submit Button',
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
  displayName: 'Navbar',
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
  displayName: 'Footer',
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
  displayName: 'Collection List',
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
  displayName: 'Record Field',
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
  displayName: 'Pagination',
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
// GATE COMPONENTS
// ============================================================================

const AuthGateComponent: ComponentDefinition = {
  type: 'AuthGate',
  displayName: 'Auth Gate',
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
  
  // Content
  componentRegistry.register(TextComponent);
  componentRegistry.register(HeadingComponent);
  componentRegistry.register(ImageComponent);
  componentRegistry.register(IconComponent);
  
  // UI
  componentRegistry.register(ButtonComponent);
  componentRegistry.register(CardComponent);
  componentRegistry.register(BadgeComponent);
  componentRegistry.register(AlertComponent);
  
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
  
  // Data
  componentRegistry.register(CollectionListComponent);
  componentRegistry.register(RecordFieldTextComponent);
  componentRegistry.register(PaginationComponent);
  
  // Gates
  componentRegistry.register(AuthGateComponent);
}

// Initialize on import
registerBuiltinComponents();
