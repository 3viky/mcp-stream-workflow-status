/**
 * Stream history tracking operations
 */
import type Database from 'better-sqlite3';
import type { StreamHistoryEvent } from '../../types.js';
import { DatabaseError } from '../errors.js';

/**
 * Add a history event for a stream
 *
 * @param db - Database instance
 * @param event - History event to record
 * @throws {DatabaseError} If insertion fails
 */
export function addHistoryEvent(
  db: Database.Database,
  event: StreamHistoryEvent
): void {
  try {
    const stmt = db.prepare(`
      INSERT INTO stream_history (
        stream_id, event_type, old_value, new_value, timestamp
      ) VALUES (
        @streamId, @eventType, @oldValue, @newValue, @timestamp
      )
    `);

    stmt.run({
      streamId: event.streamId,
      eventType: event.eventType,
      oldValue: event.oldValue ?? null,
      newValue: event.newValue ?? null,
      timestamp: event.timestamp
    });
  } catch (error) {
    throw new DatabaseError(
      `Failed to add history event for stream ${event.streamId}`,
      'addHistoryEvent',
      error
    );
  }
}

/**
 * Get history events for a specific stream
 *
 * @param db - Database instance
 * @param streamId - Stream ID
 * @returns Array of history events
 */
export function getStreamHistory(
  db: Database.Database,
  streamId: string
): StreamHistoryEvent[] {
  try {
    const stmt = db.prepare(`
      SELECT * FROM stream_history
      WHERE stream_id = ?
      ORDER BY timestamp DESC
    `);

    const rows = stmt.all(streamId) as any[];
    return rows.map(rowToHistoryEvent);
  } catch (error) {
    throw new DatabaseError(
      `Failed to get history for stream ${streamId}`,
      'getStreamHistory',
      error
    );
  }
}

/**
 * Convert database row to StreamHistoryEvent object
 */
function rowToHistoryEvent(row: any): StreamHistoryEvent {
  return {
    id: row.id,
    streamId: row.stream_id,
    eventType: row.event_type,
    oldValue: row.old_value,
    newValue: row.new_value,
    timestamp: row.timestamp
  };
}
