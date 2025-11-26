export interface NotificationData {
  userId: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface NotificationAdapterPort {
  send(data: NotificationData): Promise<boolean>;
}

