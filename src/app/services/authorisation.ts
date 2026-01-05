import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private router: Router) { }

  // check if user is logged in
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  // get user role
  getUserRole(): string {
    return localStorage.getItem('userRole') || '';
  }

  // check if user can access route based on allowed roles
  canAccessRoute(allowedRoles: string[]): boolean {
    // if not logged in, redirect to login
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    // if no roles specified, allow all logged in users
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }

    // check if user role is in allowed roles
    const userRole = this.getUserRole();
    if (allowedRoles.includes(userRole)) {
      return true;
    }

    // user doesn't have permission, redirect to records
    this.router.navigate(['/records']);
    return false;
  }
}