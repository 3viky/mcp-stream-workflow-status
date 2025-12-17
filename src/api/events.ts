/**
 * Server-Sent Events (SSE) Manager
 *
 * Broadcasts data updates to connected dashboard clients.
 * Replaces polling with push-based updates.
 */

import type { Response } from 'express';

export type EventType = 'streams' | 'commits' | 'stats' | 'all';

interface SSEClient {
  id: string;
  res: Response;
  connectedAt: Date;
}

class EventManager {
  private clients: Map<string, SSEClient> = new Map();
  private clientIdCounter = 0;

  addClient(res: Response): string {
    const id = `client-${++this.clientIdCounter}`;

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    res.flushHeaders();

    this.clients.set(id, {
      id,
      res,
      connectedAt: new Date(),
    });

    // Send initial connection message
    this.sendToClient(id, 'connected', { clientId: id, timestamp: new Date().toISOString() });

    // Keep connection alive with periodic heartbeat
    const heartbeat = setInterval(() => {
      if (this.clients.has(id)) {
        res.write(': heartbeat\n\n');
      } else {
        clearInterval(heartbeat);
      }
    }, 30000);

    // Handle client disconnect
    res.on('close', () => {
      clearInterval(heartbeat);
      this.clients.delete(id);
      console.error(`[SSE] Client ${id} disconnected (${this.clients.size} remaining)`);
    });

    console.error(`[SSE] Client ${id} connected (${this.clients.size} total)`);
    return id;
  }

  private sendToClient(clientId: string, event: string, data: unknown): boolean {
    const client = this.clients.get(clientId);
    if (!client) return false;

    try {
      client.res.write(`event: ${event}\n`);
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
      return true;
    } catch (error) {
      console.error(`[SSE] Failed to send to client ${clientId}:`, error);
      this.clients.delete(clientId);
      return false;
    }
  }

  broadcast(event: EventType, data: unknown): number {
    let sent = 0;
    for (const [clientId] of this.clients) {
      if (this.sendToClient(clientId, event, data)) {
        sent++;
      }
    }
    if (sent > 0) {
      console.error(`[SSE] Broadcast '${event}' to ${sent} client(s)`);
    }
    return sent;
  }

  getClientCount(): number {
    return this.clients.size;
  }
}

// Singleton instance
export const eventManager = new EventManager();

/**
 * Notify all clients that data has been updated
 */
export function notifyUpdate(type: EventType = 'all'): void {
  const timestamp = new Date().toISOString();
  eventManager.broadcast(type, { type, timestamp });
}
