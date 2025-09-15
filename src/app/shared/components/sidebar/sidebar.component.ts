import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface SidebarItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Projects', route: '/projects', icon: '📁' },
    { label: 'Team Management', route: '/team', icon: '👥' },
    { label: 'Reports', route: '/reports', icon: '📈' }
  ];
}
