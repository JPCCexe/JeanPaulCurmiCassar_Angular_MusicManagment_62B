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

    this.recordsService.login(this.email, this.password).subscribe({
      next: (user) => {
        // save user info to localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.name);

        // redirect to records page
        this.router.navigate(['/records']);
      },
      error: (error) => {
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}