
import { Injectable } from '@angular/core'; // Makes this class available for dependency injection
import { CanActivate, Router } from '@angular/router'; // Router for navigation, CanActivate for route protection
import { AuthService } from '../services/auth.service'; // custom authentication service


// CanActivate is an interface that Angular calls to check if user can access a route
@Injectable({
  providedIn: 'root'  // for a single instance shared across the app
})
export class AuthGuard implements CanActivate {


  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // this method is called by Angular when user tries to access a protected route
  canActivate(): boolean {
    console.log('AuthGuard: Checking if user is authenticated...');

    // check if user is logged in
    if (this.authService.isAuthenticated()) {
      console.log('AuthGuard: User is authenticated, allowing access');
      return true; // allow access to the route
    } else {
      console.log('AuthGuard: User is not authenticated, redirecting to login');
      // redirect to login page
      this.router.navigate(['/login']);
      return false; // block access to the route
    }
  }
}
