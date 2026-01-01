import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecordsService } from '../../services/records';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private recordsService: RecordsService
  ) { }

  onLogin(): void {
    this.errorMessage = '';

    this.recordsService.getUsers().subscribe({
      next: (users) => {
        const user = users.find(u => u.email === this.email && u.password === this.password);

        if (user) {
          // Saving hte info of the user to localStorage
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userRole', user.role);
          localStorage.setItem('userEmail', user.email);

          // Redirect to records page
          this.router.navigate(['/records']);
        } else {
          this.errorMessage = 'Invalid email or password';
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'An error occurred. Please try again.';
      }
    });
  }
}