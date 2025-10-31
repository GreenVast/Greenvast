export interface RequestUser {
  uid: string;
  userId?: string;
  role?: string;
  phoneNumber?: string;
  email?: string;
  claims?: Record<string, unknown>;
}
