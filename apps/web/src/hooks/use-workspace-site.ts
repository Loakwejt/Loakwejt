'use client';
import { useParams } from 'next/navigation';

/**
 * @deprecated Sites have been removed. Use workspaceId directly from useParams().
 */
export function useWorkspaceSite() {
  const params = useParams();
  const workspaceId = params?.workspaceId as string;
  return {
    workspaceId,
    // Legacy compat
    activeSiteId: null as string | null,
    sites: [],
    loading: false,
    hasSites: true,
  };
}
