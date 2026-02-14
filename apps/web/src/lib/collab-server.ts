/**
 * Collaborative Editing WebSocket Server
 *
 * Lightweight WS server that runs alongside the Next.js app.
 * Protocol:
 *   Client → Server: { type: 'join', pageId, userId, userName }
 *   Client → Server: { type: 'cursor', pageId, x, y, selectedNodeId }
 *   Client → Server: { type: 'change', pageId, operation }
 *   Client → Server: { type: 'leave', pageId }
 *
 *   Server → Client: { type: 'presence', users: [...] }
 *   Server → Client: { type: 'cursor', userId, userName, x, y, selectedNodeId }
 *   Server → Client: { type: 'change', userId, operation }
 *   Server → Client: { type: 'user-joined', userId, userName }
 *   Server → Client: { type: 'user-left', userId }
 */

// @ts-ignore — ws types handled at runtime
import { WebSocketServer, WebSocket } from 'ws';

interface ConnectedUser {
  ws: WebSocket;
  userId: string;
  userName: string;
  pageId: string;
  color: string;
}

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
];

const rooms = new Map<string, Map<string, ConnectedUser>>(); // pageId → userId → user

export function createCollabServer(port = 3001) {
  const wss = new WebSocketServer({ port });

  console.log(`[Collab] WebSocket server running on ws://localhost:${port}`);

  wss.on('connection', (ws: WebSocket) => {
    let currentUser: ConnectedUser | null = null;

    ws.on('message', (raw: Buffer) => {
      try {
        const msg = JSON.parse(raw.toString());

        switch (msg.type) {
          case 'join': {
            const { pageId, userId, userName } = msg;
            if (!pageId || !userId) return;

            // Create room if not exists
            if (!rooms.has(pageId)) rooms.set(pageId, new Map());
            const room = rooms.get(pageId)!;

            // Assign color
            const usedColors = new Set([...room.values()].map(u => u.color));
            const color = COLORS.find(c => !usedColors.has(c)) || COLORS[room.size % COLORS.length] || '#3b82f6';

            currentUser = { ws, userId, userName: userName || 'Anonym', pageId, color };
            room.set(userId, currentUser);

            // Broadcast user-joined to others
            broadcastToRoom(pageId, userId, {
              type: 'user-joined',
              userId,
              userName: currentUser.userName,
              color,
            });

            // Send presence list to joining user
            ws.send(JSON.stringify({
              type: 'presence',
              users: [...room.values()]
                .filter(u => u.userId !== userId)
                .map(u => ({
                  userId: u.userId,
                  userName: u.userName,
                  color: u.color,
                })),
            }));
            break;
          }

          case 'cursor': {
            if (!currentUser) return;
            broadcastToRoom(currentUser.pageId, currentUser.userId, {
              type: 'cursor',
              userId: currentUser.userId,
              userName: currentUser.userName,
              color: currentUser.color,
              x: msg.x,
              y: msg.y,
              selectedNodeId: msg.selectedNodeId || null,
            });
            break;
          }

          case 'change': {
            if (!currentUser) return;
            broadcastToRoom(currentUser.pageId, currentUser.userId, {
              type: 'change',
              userId: currentUser.userId,
              operation: msg.operation,
            });
            break;
          }

          case 'leave': {
            if (currentUser) {
              removeUser(currentUser);
              currentUser = null;
            }
            break;
          }
        }
      } catch (err) {
        console.error('[Collab] Parse error:', err);
      }
    });

    ws.on('close', () => {
      if (currentUser) {
        removeUser(currentUser);
        currentUser = null;
      }
    });

    ws.on('error', (err: Error) => {
      console.error('[Collab] WS error:', err);
      if (currentUser) {
        removeUser(currentUser);
        currentUser = null;
      }
    });
  });

  return wss;
}

function removeUser(user: ConnectedUser) {
  const room = rooms.get(user.pageId);
  if (!room) return;
  room.delete(user.userId);
  if (room.size === 0) {
    rooms.delete(user.pageId);
  } else {
    broadcastToRoom(user.pageId, user.userId, {
      type: 'user-left',
      userId: user.userId,
    });
  }
}

function broadcastToRoom(pageId: string, excludeUserId: string, msg: Record<string, unknown>) {
  const room = rooms.get(pageId);
  if (!room) return;
  const payload = JSON.stringify(msg);
  for (const [uid, user] of room) {
    if (uid !== excludeUserId && user.ws.readyState === WebSocket.OPEN) {
      user.ws.send(payload);
    }
  }
}

// Auto-start if run directly
if (require.main === module) {
  const port = parseInt(process.env.COLLAB_PORT || '3001');
  createCollabServer(port);
}
