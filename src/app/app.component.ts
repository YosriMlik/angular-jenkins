import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthGuardService } from './guards/auth.guard'; // Import the AuthGuardService

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private router: Router, public authGuard: AuthGuardService) {}

  title = 'angular-frontend';
  message: string = 'Are you sure you want to disconnect?';

  onDisconnect(): void {
    if (confirm(this.message)) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }
}
