import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl = 'http://localhost:8083/account';

  constructor(private http: HttpClient) {}

  // Fetch accounts for the logged-in user by their client ID
  getAccountsByClientId(): Observable<Account[]> {
    const clientId = localStorage.getItem('userId');
    const headers = this.getAuthHeaders();

    if (!clientId) {
      throw new Error('Client ID not available in local storage');
    }

    return this.http.get<Account[]>(`${this.baseUrl}/client/${clientId}`, { headers });
  }

  // Delete an account by its RIB
  deleteAccount(rib: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${rib}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Create a new account
  createAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(this.baseUrl, account, {
      headers: this.getAuthHeaders(),
    });
  }

  // Update an existing account
  updateAccount(rib: number, account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.baseUrl}/${rib}`, account, {
      headers: this.getAuthHeaders(),
    });
  }

  // Method to get the common headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
