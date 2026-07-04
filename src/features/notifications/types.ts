export type NotificationType =
  | "message"
  | "session_reminder"
  | "mentorship_reminder"
  | "mentorship_reminder_overdue"
  | "announcement"
  | "system";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  entity_id: string | null;
  read: boolean;
  action_url: string | null;
  created_at: string;
}
