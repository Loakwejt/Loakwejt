import { useEffect, useRef, useState, useCallback } from 'react';
import { useEditorStore } from '../store/editor-store';

interface CollabUser {
  userId: string;
  userName: string;
  color: string;
  x?: number;
  y?: number;
  selectedNodeId?: string | null;
}

interface UseCollabOptions {
  enabled?: boolean;
  wsUrl?: string;
}

/**
 * Hook for real-time collaborative editing via WebSocket.
 *
 * Usage:
 *   const { users, sendCursor, sendChange } = useCollab({ enabled: true });
 */
export function useCollab(options: UseCollabOptions = {}) {
  const { enabled = false, wsUrl } = options;
  const wsRef = useRef<WebSocket | null>(null);
  const [users, setUsers] = useState<Map<string, CollabUser>>(new Map());
  const [connected, setConnected] = useState(false);

  const { pageId, selectedNodeId } = useEditorStore();

  // Determine WS URL
  const collabUrl = wsUrl || (
    typeof window !== 'undefined'
      ? `ws://${window.location.hostname}:3001`
      : 'ws://localhost:3001'
  );

  useEffect(() => {
    if (!enabled || !pageId) return;

    const ws = new WebSocket(collabUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({
        type: 'join',
        pageId,
        userId: crypto.randomUUID(),
        userName: 'Editor',
      }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        switch (msg.type) {
          case 'presence': {
            const newUsers = new Map<string, CollabUser>();
            for (const u of msg.users) {
              newUsers.set(u.userId, u);
            }
            setUsers(newUsers);
            break;
          }

          case 'user-joined': {
            setUsers(prev => {
              const next = new Map(prev);
              next.set(msg.userId, {
                userId: msg.userId,
                userName: msg.userName,
                color: msg.color,
              });
              return next;
            });
            break;
          }

          case 'user-left': {
            setUsers(prev => {
              const next = new Map(prev);
              next.delete(msg.userId);
              return next;
            });
            break;
          }

          case 'cursor': {
            setUsers(prev => {
              const next = new Map(prev);
              const existing = next.get(msg.userId);
              next.set(msg.userId, {
                ...existing,
                userId: msg.userId,
                userName: msg.userName,
                color: msg.color,
                x: msg.x,
                y: msg.y,
                selectedNodeId: msg.selectedNodeId,
              });
              return next;
            });
            break;
          }

          case 'change': {
            // Apply remote changes to editor store
            const store = useEditorStore.getState();
            const { operation } = msg;
            if (operation?.type === 'updateProps' && operation.nodeId) {
              store.updateNodeProps(operation.nodeId, operation.props);
            } else if (operation?.type === 'updateStyle' && operation.nodeId) {
              store.updateNodeStyle(operation.nodeId, operation.style);
            } else if (operation?.type === 'deleteNode' && operation.nodeId) {
              store.deleteNode(operation.nodeId);
            } else if (operation?.type === 'replaceTree' && operation.tree) {
              store.setTree(operation.tree);
            }
            break;
          }
        }
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      setConnected(false);
      setUsers(new Map());
    };

    ws.onerror = () => {
      setConnected(false);
    };

    return () => {
      ws.send(JSON.stringify({ type: 'leave', pageId }));
      ws.close();
      wsRef.current = null;
      setConnected(false);
      setUsers(new Map());
    };
  }, [enabled, pageId, collabUrl]);

  const sendCursor = useCallback((x: number, y: number) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({
      type: 'cursor',
      x,
      y,
      selectedNodeId,
    }));
  }, [selectedNodeId]);

  const sendChange = useCallback((operation: Record<string, unknown>) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({
      type: 'change',
      operation,
    }));
  }, []);

  return {
    users: Array.from(users.values()),
    connected,
    sendCursor,
    sendChange,
  };
}
