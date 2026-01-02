import {
    closestCorners,
    getFirstCollision,
    pointerWithin,
    rectIntersection,
    CollisionDetection,
} from '@dnd-kit/core';

/**
 * Custom collision detection strategy optimized for sortable lists inside columns.
 *
 * - Prioritizes pointerWithin for direct container hits (essential for empty columns).
 * - Falls back to closestCorners for smooth sorting between items.
 * - Ensures empty columns are detected as valid drop targets even if no items exist inside.
 */
export const customCollisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);

    // If we are directly over a container (e.g., an empty column), prioritize that
    // Find collisions with our container IDs (New, Screening, etc.)
    if (pointerCollisions.length > 0) {
        // You might need to filter for Container IDs if you had other droppables,
        // but here we likely only have Sortable items and Column droppables.
        // Actually, BoardColumn uses `useDroppable({ id })` where id causes collision.
        return pointerCollisions;
    }

    return closestCorners(args);
};
