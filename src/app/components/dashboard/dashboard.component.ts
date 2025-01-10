import { Component, OnInit } from '@angular/core';
import { Account } from '../../models/account.model';
import { AccountService } from '../../services/account.service';
import { AuthGuardService } from '../../guards/auth.guard';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  accounts: Account[] = [];
  message: string = '';
  showMsg: boolean = false;
  showCreateForm: boolean = false;
  showEditForm: boolean = false;
  newAccount: any = {
    solde: 0,
    clientId: 0, // Initialize with the logged-in user's client ID
    creationDate: new Date().toISOString().split('T')[0], // Default to today's date in 'yyyy-MM-dd' format
  };
  selectedAccount: Account = { ...this.newAccount };

  constructor(private accountService: AccountService, private authGuard: AuthGuardService) {}

  ngOnInit(): void {
    this.loadAccounts();
    // Set the clientId to the logged-in user's ID
    const clientId = localStorage.getItem('userId');
    if (clientId) {
      this.newAccount.clientId = +clientId; // Convert string to number
    }
  }

  loadAccounts(): void {
    this.accountService.getAccountsByClientId().subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: (err) => {
        console.error('Error fetching accounts:', err);
      },
    });
  }

  onDeleteAccount(rib: number): void {
    if (confirm('Are you sure you want to delete this account?')) {
      this.accountService.deleteAccount(rib).subscribe({
        next: (response) => {
          this.message = 'Account deleted successfully!';
          this.showMsg = true;
          this.loadAccounts(); // Reload accounts after deletion
        },
        error: (err) => {
          this.message = 'Failed to delete account!';
          this.showMsg = true;
          console.error(err);
        },
      });
    }
  }

  onCreateAccount(): void {
    this.showCreateForm = true;
  }

  closeDialog() {
    this.showMsg = false;
  }

  onSubmitCreate(): void {
    // Ensure the creationDate is in the correct format
    this.newAccount.creationDate = new Date(this.newAccount.creationDate).toISOString().split('T')[0];
    console.log('Creating account:', this.newAccount);
    this.accountService.createAccount(this.newAccount).subscribe({
      next: (response) => {
        this.newAccount = {
          solde: 0,
          clientId: 0,
          creationDate: new Date().toISOString().split('T')[0],
        };
        this.message = 'Account created successfully!';
        this.showMsg = true;
        this.showCreateForm = false;
        this.loadAccounts(); // Reload accounts after creation
      },
      error: (err) => {
        this.message = 'Failed to create account!';
        this.showMsg = true;
        console.error(err);
      },
    });
  }

  onEditAccount(account: Account): void {
    this.showEditForm = true;
    this.selectedAccount = { ...account };
  }

  onSubmitEdit(): void {
    this.accountService.updateAccount(this.selectedAccount.rib, this.selectedAccount).subscribe({
      next: (response) => {
        this.message = 'Account updated successfully!';
        this.showMsg = true;
        this.showEditForm = false;
        this.loadAccounts(); // Reload accounts after update
      },
      error: (err) => {
        this.message = 'Failed to update account!';
        console.error(err);
      },
    });
  }
}
