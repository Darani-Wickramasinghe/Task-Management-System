export function emitToUser(io, userId, event, payload) {
  io.to(`user:${userId}`).emit(event, payload);
}


export function emitTaskUpdated(io, assigneeIds, task) {
  assigneeIds.forEach((userId) => {
    emitToUser(io, userId, 'task:updated', { task });
  });
}


export function emitTaskAssigned(io, userId, task) {
  emitToUser(io, userId, 'notification:task_assigned', { task });
}


export function emitStatusChanged(io, recipients, task) {
  recipients.forEach((userId) => {
    emitToUser(io, userId, 'notification:status_changed', { task });
  });
}


export function emitNotification(io, userId, notification) {
  emitToUser(io, userId, 'notification:new', { notification });
}

export function broadcastTaskCreated(io, task) {
  io.emit('task:created', { task });
}

export function broadcastTaskUpdated(io, task) {
  io.emit('task:updated', { task });
}

export function broadcastTaskDeleted(io, taskId) {
  io.emit('task:deleted', { id: taskId });
}
