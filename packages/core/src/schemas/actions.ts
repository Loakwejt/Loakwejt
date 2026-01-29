import { z } from 'zod';

// ============================================================================
// ACTION TYPES - Declarative, no-code actions
// ============================================================================

// Navigation action
export const NavigateActionSchema = z.object({
  type: z.literal('navigate'),
  to: z.string(), // URL or path
  target: z.enum(['_self', '_blank']).optional(),
});

// Modal actions
export const OpenModalActionSchema = z.object({
  type: z.literal('openModal'),
  modalId: z.string(),
});

export const CloseModalActionSchema = z.object({
  type: z.literal('closeModal'),
  modalId: z.string().optional(), // If not provided, closes current modal
});

// Form actions
export const SubmitFormActionSchema = z.object({
  type: z.literal('submitForm'),
  collection: z.string(),
  redirectTo: z.string().optional(),
  successMessage: z.string().optional(),
  errorMessage: z.string().optional(),
});

// Record CRUD actions
export const CreateRecordActionSchema = z.object({
  type: z.literal('createRecord'),
  collection: z.string(),
  dataBindingMap: z.record(z.string()), // Maps form field names to collection fields
  redirectTo: z.string().optional(),
});

export const UpdateRecordActionSchema = z.object({
  type: z.literal('updateRecord'),
  collection: z.string(),
  recordIdBinding: z.string(), // How to get the record ID (e.g., from URL param)
  dataBindingMap: z.record(z.string()),
  redirectTo: z.string().optional(),
});

export const DeleteRecordActionSchema = z.object({
  type: z.literal('deleteRecord'),
  collection: z.string(),
  recordIdBinding: z.string(),
  redirectTo: z.string().optional(),
  confirmMessage: z.string().optional(),
});

// E-commerce actions
export const AddToCartActionSchema = z.object({
  type: z.literal('addToCart'),
  productIdBinding: z.string(),
  quantityBinding: z.string().optional(),
});

export const RemoveFromCartActionSchema = z.object({
  type: z.literal('removeFromCart'),
  productIdBinding: z.string(),
});

export const CheckoutActionSchema = z.object({
  type: z.literal('checkout'),
  successUrl: z.string(),
  cancelUrl: z.string(),
});

// Auth actions
export const LoginActionSchema = z.object({
  type: z.literal('login'),
  redirectTo: z.string().optional(),
});

export const LogoutActionSchema = z.object({
  type: z.literal('logout'),
  redirectTo: z.string().optional(),
});

export const SignupActionSchema = z.object({
  type: z.literal('signup'),
  collection: z.string().optional(), // Optional user profile collection
  redirectTo: z.string().optional(),
});

// UI actions
export const ScrollToActionSchema = z.object({
  type: z.literal('scrollTo'),
  targetId: z.string(),
  behavior: z.enum(['smooth', 'instant']).optional(),
});

export const SetStateActionSchema = z.object({
  type: z.literal('setState'),
  key: z.string(),
  value: z.unknown(),
});

export const ToggleStateActionSchema = z.object({
  type: z.literal('toggleState'),
  key: z.string(),
});

// Navigate to internal page
export const NavigatePageActionSchema = z.object({
  type: z.literal('navigatePage'),
  pageSlug: z.string(),
});

// Toggle CSS class on element
export const ToggleClassActionSchema = z.object({
  type: z.literal('toggleClass'),
  targetId: z.string().optional(), // Element ID to target, or self
  className: z.string(),
});

// Set a runtime variable
export const SetVariableActionSchema = z.object({
  type: z.literal('setVariable'),
  name: z.string(),
  value: z.unknown(),
});

// Custom code execution (sanitized)
export const CustomCodeActionSchema = z.object({
  type: z.literal('customCode'),
  code: z.string(), // Simple expression, sandboxed
});

// Custom/webhook action (safe - server-side only)
export const WebhookActionSchema = z.object({
  type: z.literal('webhook'),
  url: z.string().url(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).optional(),
  dataBindingMap: z.record(z.string()).optional(),
});

// ============================================================================
// UNION OF ALL ACTIONS
// ============================================================================

export const BuilderActionSchema = z.discriminatedUnion('type', [
  NavigateActionSchema,
  NavigatePageActionSchema,
  OpenModalActionSchema,
  CloseModalActionSchema,
  SubmitFormActionSchema,
  CreateRecordActionSchema,
  UpdateRecordActionSchema,
  DeleteRecordActionSchema,
  AddToCartActionSchema,
  RemoveFromCartActionSchema,
  CheckoutActionSchema,
  LoginActionSchema,
  LogoutActionSchema,
  SignupActionSchema,
  ScrollToActionSchema,
  SetStateActionSchema,
  ToggleStateActionSchema,
  ToggleClassActionSchema,
  SetVariableActionSchema,
  CustomCodeActionSchema,
  WebhookActionSchema,
]);

export type BuilderAction = z.infer<typeof BuilderActionSchema>;

// ============================================================================
// ACTION EVENT TYPES
// ============================================================================

export const ActionEventType = z.enum([
  // Standard DOM events (camelCase)
  'onClick',
  'onDoubleClick',
  'onSubmit',
  'onLoad',
  'onHover',
  'onFocus',
  'onBlur',
  'onChange',
  // Simplified event names (for better UX in editor)
  'click',
  'mouseenter',
  'mouseleave',
  'focus',
  'blur',
  'submit',
]);

export type ActionEventType = z.infer<typeof ActionEventType>;

// ============================================================================
// ACTION BINDING - Connects events to actions
// ============================================================================

export const BuilderActionBindingSchema = z.object({
  event: ActionEventType,
  action: BuilderActionSchema,
  condition: z.string().optional(), // Simple condition expression (e.g., "user.isLoggedIn")
});

export type BuilderActionBinding = z.infer<typeof BuilderActionBindingSchema>;

// ============================================================================
// ACTION REGISTRY - For plugin-provided actions
// ============================================================================

export interface ActionDefinition<T extends BuilderAction = BuilderAction> {
  type: T['type'];
  displayName: string;
  description: string;
  icon: string;
  schema: z.ZodType<T>;
  // Server-side handler is defined in plugins
}

export class ActionRegistry {
  private actions = new Map<string, ActionDefinition>();

  register<T extends BuilderAction>(definition: ActionDefinition<T>): void {
    this.actions.set(definition.type, definition as ActionDefinition);
  }

  get(type: string): ActionDefinition | undefined {
    return this.actions.get(type);
  }

  getAll(): ActionDefinition[] {
    return Array.from(this.actions.values());
  }

  has(type: string): boolean {
    return this.actions.has(type);
  }

  validate(action: unknown): BuilderAction {
    const parsed = BuilderActionSchema.parse(action);
    return parsed;
  }

  isValid(action: unknown): action is BuilderAction {
    return BuilderActionSchema.safeParse(action).success;
  }
}

// Global action registry instance
export const actionRegistry = new ActionRegistry();

// Register all built-in actions
actionRegistry.register({
  type: 'navigate',
  displayName: 'Navigate',
  description: 'Navigate to a URL or page',
  icon: 'arrow-right',
  schema: NavigateActionSchema,
});

actionRegistry.register({
  type: 'openModal',
  displayName: 'Open Modal',
  description: 'Open a modal dialog',
  icon: 'square-plus',
  schema: OpenModalActionSchema,
});

actionRegistry.register({
  type: 'closeModal',
  displayName: 'Close Modal',
  description: 'Close a modal dialog',
  icon: 'x',
  schema: CloseModalActionSchema,
});

actionRegistry.register({
  type: 'submitForm',
  displayName: 'Submit Form',
  description: 'Submit form data to a collection',
  icon: 'send',
  schema: SubmitFormActionSchema,
});

actionRegistry.register({
  type: 'createRecord',
  displayName: 'Create Record',
  description: 'Create a new record in a collection',
  icon: 'plus',
  schema: CreateRecordActionSchema,
});

actionRegistry.register({
  type: 'updateRecord',
  displayName: 'Update Record',
  description: 'Update an existing record',
  icon: 'edit',
  schema: UpdateRecordActionSchema,
});

actionRegistry.register({
  type: 'deleteRecord',
  displayName: 'Delete Record',
  description: 'Delete a record',
  icon: 'trash',
  schema: DeleteRecordActionSchema,
});

actionRegistry.register({
  type: 'addToCart',
  displayName: 'Add to Cart',
  description: 'Add a product to the shopping cart',
  icon: 'shopping-cart',
  schema: AddToCartActionSchema,
});

actionRegistry.register({
  type: 'checkout',
  displayName: 'Checkout',
  description: 'Start the checkout process',
  icon: 'credit-card',
  schema: CheckoutActionSchema,
});

actionRegistry.register({
  type: 'login',
  displayName: 'Login',
  description: 'Show login form',
  icon: 'log-in',
  schema: LoginActionSchema,
});

actionRegistry.register({
  type: 'logout',
  displayName: 'Logout',
  description: 'Log out the current user',
  icon: 'log-out',
  schema: LogoutActionSchema,
});

actionRegistry.register({
  type: 'scrollTo',
  displayName: 'Scroll To',
  description: 'Scroll to an element',
  icon: 'arrow-down',
  schema: ScrollToActionSchema,
});

actionRegistry.register({
  type: 'navigatePage',
  displayName: 'Navigate to Page',
  description: 'Navigate to an internal page',
  icon: 'file',
  schema: NavigatePageActionSchema,
});

actionRegistry.register({
  type: 'toggleClass',
  displayName: 'Toggle Class',
  description: 'Toggle a CSS class on an element',
  icon: 'toggle-left',
  schema: ToggleClassActionSchema,
});

actionRegistry.register({
  type: 'setVariable',
  displayName: 'Set Variable',
  description: 'Set a runtime variable value',
  icon: 'variable',
  schema: SetVariableActionSchema,
});
