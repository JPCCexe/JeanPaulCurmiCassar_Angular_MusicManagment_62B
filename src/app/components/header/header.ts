import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  constructor(private router: Router) { }

  // checking of the ser is logged in or not
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  // getting the user current role
  getUserRole(): string {
    return localStorage.getItem('userRole') || '';
  }

  //checking of the user can add records or not
  // Every login can add role just checking if user is logged in or not
  canAdd(): boolean {
    // All roles can add records
    return this.isLoggedIn();
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }
}
