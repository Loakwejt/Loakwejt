import type {
  ApiResponse,
  Workspace,
  CreateWorkspaceRequest,
  WorkspaceMember,
  InviteMemberRequest,
  UpdateWorkspaceSettingsRequest,
  Page,
  CreatePageRequest,
  UpdatePageRequest,
  PageRevision,
  PublishPageRequest,
  Collection,
  CreateCollectionRequest,
  CollectionRecord,
  CreateRecordRequest,
  UpdateRecordRequest,
  Asset,
  CreateCheckoutRequest,
  Subscription,
  User,
} from '../types/api';

// ============================================================================
// API CLIENT CONFIGURATION
// ============================================================================

export interface ApiClientConfig {
  baseUrl: string;
  getToken?: () => string | null;
  onUnauthorized?: () => void;
}

// ============================================================================
// API CLIENT CLASS
// ============================================================================

export class ApiClient {
  private baseUrl: string;
  private getToken?: () => string | null;
  private onUnauthorized?: () => void;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.getToken = config.getToken;
    this.onUnauthorized = config.onUnauthorized;
  }

  // ============================================================================
  // BASE FETCH METHODS
  // ============================================================================

  private async fetch<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const token = this.getToken?.();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    if (response.status === 401) {
      this.onUnauthorized?.();
      throw new ApiClientError('Unauthorized', 401);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new ApiClientError(error.message || 'API Error', response.status, error);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  private get<T>(path: string): Promise<T> {
    return this.fetch<T>(path, { method: 'GET' });
  }

  private post<T>(path: string, data?: unknown): Promise<T> {
    return this.fetch<T>(path, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  private put<T>(path: string, data?: unknown): Promise<T> {
    return this.fetch<T>(path, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  private patch<T>(path: string, data?: unknown): Promise<T> {
    return this.fetch<T>(path, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  private delete<T>(path: string): Promise<T> {
    return this.fetch<T>(path, { method: 'DELETE' });
  }

  // ============================================================================
  // AUTH ENDPOINTS
  // ============================================================================

  auth = {
    getSession: () => this.get<{ user: User | null }>('/api/auth/session'),
    
    getCurrentUser: () => this.get<User>('/api/user/me'),
  };

  // ============================================================================
  // WORKSPACE ENDPOINTS
  // ============================================================================

  workspaces = {
    list: () => 
      this.get<ApiResponse<Workspace[]>>('/api/workspaces'),

    get: (id: string) => 
      this.get<Workspace>(`/api/workspaces/${id}`),

    create: (data: CreateWorkspaceRequest) =>
      this.post<Workspace>('/api/workspaces', data),

    update: (id: string, data: Partial<CreateWorkspaceRequest>) =>
      this.patch<Workspace>(`/api/workspaces/${id}`, data),

    delete: (id: string) => 
      this.delete<void>(`/api/workspaces/${id}`),

    // Settings (formerly Site settings)
    updateSettings: (workspaceId: string, data: UpdateWorkspaceSettingsRequest) =>
      this.patch<Workspace>(`/api/workspaces/${workspaceId}/settings`, data),

    // Members
    getMembers: (workspaceId: string) =>
      this.get<ApiResponse<WorkspaceMember[]>>(`/api/workspaces/${workspaceId}/members`),

    inviteMember: (workspaceId: string, data: InviteMemberRequest) =>
      this.post<WorkspaceMember>(`/api/workspaces/${workspaceId}/members`, data),

    updateMember: (workspaceId: string, memberId: string, role: string) =>
      this.patch<WorkspaceMember>(`/api/workspaces/${workspaceId}/members/${memberId}`, { role }),

    removeMember: (workspaceId: string, memberId: string) =>
      this.delete<void>(`/api/workspaces/${workspaceId}/members/${memberId}`),
  };

  // ============================================================================
  // PAGE ENDPOINTS
  // ============================================================================

  pages = {
    list: (workspaceId: string) =>
      this.get<ApiResponse<Page[]>>(`/api/workspaces/${workspaceId}/pages`),

    get: (workspaceId: string, pageId: string) =>
      this.get<Page>(`/api/workspaces/${workspaceId}/pages/${pageId}`),

    create: (workspaceId: string, data: CreatePageRequest) =>
      this.post<Page>(`/api/workspaces/${workspaceId}/pages`, data),

    update: (workspaceId: string, pageId: string, data: UpdatePageRequest) =>
      this.patch<Page>(`/api/workspaces/${workspaceId}/pages/${pageId}`, data),

    delete: (workspaceId: string, pageId: string) =>
      this.delete<void>(`/api/workspaces/${workspaceId}/pages/${pageId}`),

    // Revisions
    getRevisions: (workspaceId: string, pageId: string) =>
      this.get<ApiResponse<PageRevision[]>>(
        `/api/workspaces/${workspaceId}/pages/${pageId}/revisions`
      ),

    publish: (workspaceId: string, pageId: string, data?: PublishPageRequest) =>
      this.post<PageRevision>(
        `/api/workspaces/${workspaceId}/pages/${pageId}/publish`,
        data
      ),

    rollback: (workspaceId: string, pageId: string, revisionId: string) =>
      this.post<Page>(
        `/api/workspaces/${workspaceId}/pages/${pageId}/rollback`,
        { revisionId }
      ),
  };

  // ============================================================================
  // COLLECTION ENDPOINTS
  // ============================================================================

  collections = {
    list: (workspaceId: string) => {
      return this.get<ApiResponse<Collection[]>>(`/api/workspaces/${workspaceId}/collections`);
    },

    get: (workspaceId: string, collectionId: string) =>
      this.get<Collection>(`/api/workspaces/${workspaceId}/collections/${collectionId}`),

    create: (workspaceId: string, data: CreateCollectionRequest) =>
      this.post<Collection>(`/api/workspaces/${workspaceId}/collections`, data),

    update: (workspaceId: string, collectionId: string, data: Partial<CreateCollectionRequest>) =>
      this.patch<Collection>(`/api/workspaces/${workspaceId}/collections/${collectionId}`, data),

    delete: (workspaceId: string, collectionId: string) =>
      this.delete<void>(`/api/workspaces/${workspaceId}/collections/${collectionId}`),
  };

  // ============================================================================
  // RECORD ENDPOINTS
  // ============================================================================

  records = {
    list: (workspaceId: string, collectionId: string, params?: {
      page?: number;
      pageSize?: number;
      status?: string;
      sort?: string;
      order?: 'asc' | 'desc';
    }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.pageSize) query.set('pageSize', String(params.pageSize));
      if (params?.status) query.set('status', params.status);
      if (params?.sort) query.set('sort', params.sort);
      if (params?.order) query.set('order', params.order);
      const queryStr = query.toString() ? `?${query.toString()}` : '';
      return this.get<ApiResponse<CollectionRecord[]>>(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/records${queryStr}`
      );
    },

    get: (workspaceId: string, collectionId: string, recordId: string) =>
      this.get<CollectionRecord>(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/records/${recordId}`
      ),

    create: (workspaceId: string, collectionId: string, data: CreateRecordRequest) =>
      this.post<CollectionRecord>(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/records`,
        data
      ),

    update: (workspaceId: string, collectionId: string, recordId: string, data: UpdateRecordRequest) =>
      this.patch<CollectionRecord>(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/records/${recordId}`,
        data
      ),

    delete: (workspaceId: string, collectionId: string, recordId: string) =>
      this.delete<void>(
        `/api/workspaces/${workspaceId}/collections/${collectionId}/records/${recordId}`
      ),
  };

  // ============================================================================
  // ASSET ENDPOINTS
  // ============================================================================

  assets = {
    list: (workspaceId: string) => {
      return this.get<ApiResponse<Asset[]>>(`/api/workspaces/${workspaceId}/assets`);
    },

    get: (workspaceId: string, assetId: string) =>
      this.get<Asset>(`/api/workspaces/${workspaceId}/assets/${assetId}`),

    upload: async (workspaceId: string, file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const token = this.getToken?.();
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${this.baseUrl}/api/workspaces/${workspaceId}/assets/upload`,
        {
          method: 'POST',
          headers,
          body: formData,
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new ApiClientError(error.message, response.status, error);
      }

      return response.json() as Promise<Asset>;
    },

    delete: (workspaceId: string, assetId: string) =>
      this.delete<void>(`/api/workspaces/${workspaceId}/assets/${assetId}`),
  };

  // ============================================================================
  // BILLING ENDPOINTS
  // ============================================================================

  billing = {
    getSubscription: (workspaceId: string) =>
      this.get<Subscription>(`/api/workspaces/${workspaceId}/billing/subscription`),

    createCheckout: (workspaceId: string, data: CreateCheckoutRequest) =>
      this.post<{ url: string }>(`/api/workspaces/${workspaceId}/billing/checkout`, data),

    createPortalSession: (workspaceId: string, returnUrl: string) =>
      this.post<{ url: string }>(`/api/workspaces/${workspaceId}/billing/portal`, { returnUrl }),

    cancelSubscription: (workspaceId: string) =>
      this.post<Subscription>(`/api/workspaces/${workspaceId}/billing/cancel`),
  };

  // ============================================================================
  // RUNTIME ENDPOINTS (Public)
  // ============================================================================

  runtime = {
    getWorkspace: (workspaceSlug: string) =>
      this.get<Workspace>(`/api/runtime/workspaces/${workspaceSlug}`),

    getPage: (workspaceSlug: string, pageSlug?: string) => {
      const path = pageSlug 
        ? `/api/runtime/workspaces/${workspaceSlug}/pages/${pageSlug}`
        : `/api/runtime/workspaces/${workspaceSlug}/pages`;
      return this.get<{ page: Page; revision: PageRevision }>(path);
    },

    getRecords: (workspaceSlug: string, collectionSlug: string, params?: {
      page?: number;
      pageSize?: number;
      filter?: Record<string, unknown>;
    }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.pageSize) query.set('pageSize', String(params.pageSize));
      if (params?.filter) query.set('filter', JSON.stringify(params.filter));
      const queryStr = query.toString() ? `?${query.toString()}` : '';
      return this.get<ApiResponse<CollectionRecord[]>>(
        `/api/runtime/workspaces/${workspaceSlug}/collections/${collectionSlug}/records${queryStr}`
      );
    },
  };
}

// ============================================================================
// API CLIENT ERROR CLASS
// ============================================================================

export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

// ============================================================================
// CREATE CLIENT HELPER
// ============================================================================

export function createApiClient(baseUrl: string): ApiClient {
  return new ApiClient({
    baseUrl,
  });
}
