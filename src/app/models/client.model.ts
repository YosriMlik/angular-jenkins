// src/app/models/client.model.ts
export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string; // Note: You may not need to use this in the frontend
  role: string;
}
