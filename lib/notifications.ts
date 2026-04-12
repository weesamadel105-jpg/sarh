import { EventEmitter } from 'events';

// Singleton event emitter for notifications
class NotificationManager extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100);
  }

  public notifyNewRequest(request: any) {
    this.emit('newRequest', request);
  }
}

// Global variable to persist the instance across hot-reloads in development
// and across different route handler invocations.
const globalForNotifications = global as unknown as {
  notificationManager: NotificationManager | undefined;
};

export const notificationManager =
  globalForNotifications.notificationManager ?? new NotificationManager();

if (process.env.NODE_ENV !== 'production') {
  globalForNotifications.notificationManager = notificationManager;
}
