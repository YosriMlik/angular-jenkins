import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Client } from '../../models/client.model'; // Import the Client model
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profile: Client | null = null; // Use the Client model
  editMode: boolean = false;
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const clientId = localStorage.getItem('userId'); // Retrieve the clientId from localStorage
    if (!clientId) {
      this.message = 'User ID not found. Please log in again.';
      return;
    }

    const headers = this.getAuthHeaders();
    //console.log("Headers :", headers);
    this.http.get<Client>(`http://localhost:8083/client/${clientId}`, { headers }).subscribe({
      next: (response) => {
        this.profile = response; // Assign the response to the profile property
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.message = 'Failed to load profile.';
      },
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  updateProfile(): void {
    const clientId = localStorage.getItem('userId'); // Retrieve the clientId from localStorage
    if (!clientId || !this.profile) {
      this.message = 'User ID not found. Please log in again.';
      return;
    }

    const headers = this.getAuthHeaders();
    this.http.put<Client>(`http://localhost:8083/client/${clientId}`, this.profile, { headers }).subscribe({
      next: (response) => {
        this.message = 'Profile updated successfully!';
        this.editMode = false;
        this.loadProfile(); // Reload profile after update
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        this.message = 'Failed to update profile.';
      },
    });
  }

  deleteProfile(): void {
    const clientId = localStorage.getItem('userId'); // Retrieve the clientId from localStorage
    if (!clientId) {
      this.message = 'User ID not found. Please log in again.';
      return;
    }

    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const headers = this.getAuthHeaders();
      console.log("Headers :", headers)
      this.http.delete(`http://localhost:8083/client/${clientId}`, { headers }).subscribe({
        next: (response) => {
          localStorage.removeItem('token'); // Clear the token
          localStorage.removeItem('userId'); // Clear the user ID
          this.router.navigate(['/login']); // Redirect to login page
        },
        error: (err) => {
          console.error('Error deleting profile:', err);
          this.message = 'Failed to delete profile.';
        },
      });
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
