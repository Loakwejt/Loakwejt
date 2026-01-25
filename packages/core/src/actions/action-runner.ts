import type { BuilderAction, BuilderActionBinding } from '../schemas/actions';

// ============================================================================
// ACTION CONTEXT - Data available during action execution
// ============================================================================

export interface ActionContext {
  // Site & page context
  siteId: string;
  pageId: string;
  
  // User context
  user: {
    id: string;
    email: string;
    isLoggedIn: boolean;
  } | null;
  
  // Current record (for data-bound components)
  currentRecord?: Record<string, unknown>;
  
  // Form data (for form submissions)
  formData?: Record<string, unknown>;
  
  // URL parameters
  urlParams: Record<string, string>;
  
  // State (client-side state)
  state: Record<string, unknown>;
  
  // Cart (for e-commerce)
  cart?: {
    items: Array<{ productId: string; quantity: number }>;
    total: number;
  };
}

// ============================================================================
// ACTION RESULT
// ============================================================================

export interface ActionResult {
  success: boolean;
  error?: string;
  data?: unknown;
  
  // Side effects to apply
  redirect?: string;
  setState?: Record<string, unknown>;
  showMessage?: {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  };
  openModal?: string;
  closeModal?: string;
}

// ============================================================================
// ACTION HANDLER TYPE
// ============================================================================

export type ActionHandler<T extends BuilderAction = BuilderAction> = (
  action: T,
  context: ActionContext
) => Promise<ActionResult>;

// ============================================================================
// ACTION RUNNER - Client-side action executor
// ============================================================================

export class ActionRunner {
  private handlers = new Map<string, ActionHandler>();
  
  // Register an action handler
  registerHandler<T extends BuilderAction>(
    type: T['type'],
    handler: ActionHandler<T>
  ): void {
    this.handlers.set(type, handler as ActionHandler);
  }
  
  // Execute an action
  async execute(
    action: BuilderAction,
    context: ActionContext
  ): Promise<ActionResult> {
    const handler = this.handlers.get(action.type);
    
    if (!handler) {
      console.warn(`No handler registered for action type: ${action.type}`);
      return {
        success: false,
        error: `Unknown action type: ${action.type}`,
      };
    }
    
    try {
      return await handler(action, context);
    } catch (error) {
      console.error(`Error executing action ${action.type}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  // Execute multiple actions in sequence
  async executeBindings(
    bindings: BuilderActionBinding[],
    event: string,
    context: ActionContext
  ): Promise<ActionResult[]> {
    const results: ActionResult[] = [];
    
    for (const binding of bindings) {
      if (binding.event !== event) continue;
      
      // Check condition if present
      if (binding.condition && !this.evaluateCondition(binding.condition, context)) {
        continue;
      }
      
      const result = await this.execute(binding.action, context);
      results.push(result);
      
      // Stop on error unless we want to continue
      if (!result.success) {
        break;
      }
    }
    
    return results;
  }
  
  // Safe condition evaluation (no eval!)
  private evaluateCondition(condition: string, context: ActionContext): boolean {
    // Simple condition parser - no dynamic code execution
    // Supports: user.isLoggedIn, !user.isLoggedIn, state.key, etc.
    
    const trimmed = condition.trim();
    const isNegated = trimmed.startsWith('!');
    const path = isNegated ? trimmed.slice(1) : trimmed;
    
    const value = this.getValueByPath(context, path);
    const result = Boolean(value);
    
    return isNegated ? !result : result;
  }
  
  private getValueByPath(obj: unknown, path: string): unknown {
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      if (typeof current !== 'object') return undefined;
      current = (current as Record<string, unknown>)[part];
    }
    
    return current;
  }
}

// ============================================================================
// CLIENT-SIDE ACTION HANDLERS
// ============================================================================

export function createClientActionRunner(): ActionRunner {
  const runner = new ActionRunner();
  
  // Navigate action
  runner.registerHandler('navigate', async (action) => {
    const target = action.target || '_self';
    
    if (target === '_blank') {
      window.open(action.to, '_blank');
    } else {
      window.location.href = action.to;
    }
    
    return { success: true };
  });
  
  // Scroll to action
  runner.registerHandler('scrollTo', async (action) => {
    const element = document.getElementById(action.targetId);
    
    if (element) {
      element.scrollIntoView({
        behavior: action.behavior || 'smooth',
      });
      return { success: true };
    }
    
    return {
      success: false,
      error: `Element not found: ${action.targetId}`,
    };
  });
  
  // Set state action
  runner.registerHandler('setState', async (action) => {
    return {
      success: true,
      setState: { [action.key]: action.value },
    };
  });
  
  // Toggle state action
  runner.registerHandler('toggleState', async (action, context) => {
    const currentValue = context.state[action.key];
    return {
      success: true,
      setState: { [action.key]: !currentValue },
    };
  });
  
  // Open modal action
  runner.registerHandler('openModal', async (action) => {
    return {
      success: true,
      openModal: action.modalId,
    };
  });
  
  // Close modal action
  runner.registerHandler('closeModal', async (action) => {
    return {
      success: true,
      closeModal: action.modalId || '__current__',
    };
  });
  
  // Login action (redirect to login page)
  runner.registerHandler('login', async (action) => {
    const redirectTo = action.redirectTo || window.location.pathname;
    return {
      success: true,
      redirect: `/login?redirect=${encodeURIComponent(redirectTo)}`,
    };
  });
  
  // Logout action
  runner.registerHandler('logout', async (action) => {
    return {
      success: true,
      redirect: `/api/auth/signout?redirect=${encodeURIComponent(action.redirectTo || '/')}`,
    };
  });
  
  return runner;
}

// ============================================================================
// SERVER ACTION TYPES (for API routes)
// ============================================================================

export interface ServerActionRequest {
  action: BuilderAction;
  context: {
    siteId: string;
    pageId?: string;
    formData?: Record<string, unknown>;
    urlParams?: Record<string, string>;
  };
}

export interface ServerActionResponse {
  success: boolean;
  error?: string;
  data?: unknown;
  redirect?: string;
}
