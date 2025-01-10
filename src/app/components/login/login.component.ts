import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string = '';
  dialogVisible: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.authService.login(credentials).subscribe({
        next: (response) => {
          // Store the token
          localStorage.setItem('token', response.token);
          // Store the user ID
          localStorage.setItem('userId', response.client.id);

          this.message = 'Login successful!';
          this.router.navigate(['/dashboard']); // Redirect to the dashboard or another page
        },
        error: (err) => {
          this.message = 'Login failed! Please check your credentials.';
          this.dialogVisible = true; // Show dialog on error
          //console.error('Error:', err);
        },
      });
    }
  }

  showDialog() {
    this.dialogVisible = true;
  }

  closeDialog() {
    this.dialogVisible = false;
    this.loginForm.reset();
  }

}
