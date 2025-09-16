
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;


  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('HeaderComponent: Component initialized');

    this.currentUser = this.authService.getCurrentUser();

    console.log('HeaderComponent: Current user:', this.currentUser?.name || 'No user');
  }

  // handle user logout
  logout(): void {
    console.log('HeaderComponent: User logging out');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
