import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../projects/services/project.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonComponent, HeaderComponent, SidebarComponent, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  projectsCount = 0;
  isLoading = false;


  constructor(
    private router: Router,
    private projectService: ProjectService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    console.log('HomeComponent: Component initialized');
    this.loadProjectsCount();
  }

  // load the count of projects
  loadProjectsCount(): void {
    console.log('HomeComponent: Loading projects count...');
    this.isLoading = true;

    this.projectService.getProjects().subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('HomeComponent: Projects loaded successfully');

        if (response.status === 200 && response.data) {
          this.projectsCount = response.data.length;
          console.log('HomeComponent: Projects count:', this.projectsCount);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.log('HomeComponent: Error loading projects count:', error);
        this.notificationService.showError('Error', 'Failed to load projects count');
      }
    });
  }

  // navigate to create project page
  onCreateProject(): void {
    console.log('HomeComponent: Navigating to create project');
    this.router.navigate(['/projects/create']);
  }

  // navigate to projects list page
  onViewProjects(): void {
    console.log('HomeComponent: Navigating to projects list');
    this.router.navigate(['/projects']);
  }
}
