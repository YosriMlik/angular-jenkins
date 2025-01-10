export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface Account {
  rib: number;
  client: Client;
  solde: number;
  creationDate: string;
}
