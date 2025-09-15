import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { ProjectService } from '../../projects/services/project.service';
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
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.loadProjectsCount();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProjectsCount(): void {
    this.isLoading = true;
    this.projectService.getProjects().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 200 && response.data) {
          this.projectsCount = response.data.length;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.showError('Error', 'Failed to load projects count');
        console.error('Error loading projects count:', error);
      }
    });
  }

  onCreateProject(): void {
    this.router.navigate(['/projects/create']);
  }

  onViewProjects(): void {
    this.router.navigate(['/projects']);
  }
}
