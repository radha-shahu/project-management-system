import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProjectService, Project } from '../services/project.service';
import { NotificationService } from '../../shared/services/notification.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
    selector: 'app-project-list',
    standalone: true,
    imports: [
        CommonModule,
        ButtonComponent,
        HeaderComponent,
        SidebarComponent,
        LoaderComponent
    ],
    templateUrl: './project-list.component.html',
    styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit {
    projects: Project[] = [];
    isLoading = false;
    private destroy$ = new Subject<void>();
    private projectService = inject(ProjectService);
    private notificationService = inject(NotificationService);
    private router = inject(Router);

    ngOnInit(): void {
        this.loadProjects();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadProjects(): void {
        this.isLoading = true;
        this.projectService.getProjects().subscribe({
            next: (response) => {
                this.isLoading = false;
                if (response.status === 200 && response.data) {
                    this.projects = response.data;
                }
            },
            error: (error) => {
                this.isLoading = false;
                this.notificationService.showError('Error', 'Failed to load projects');
                console.error('Error loading projects:', error);
            }
        });
    }

    onCreateProject(): void {
        this.router.navigate(['/projects/create']);
    }

    onProjectClick(project: Project): void {
        // For now, just show project details in console
        // In future weeks, this will navigate to project details
        console.log('Project clicked:', project);
        this.notificationService.showInfo('Project Selected', `Selected project: ${project.name}`);
    }

    getProjectStatusClass(status: string): string {
        switch (status) {
            case 'active': return 'status-active';
            case 'completed': return 'status-completed';
            case 'on-hold': return 'status-on-hold';
            default: return 'status-active';
        }
    }

    getProjectStatusText(status: string): string {
        switch (status) {
            case 'active': return 'Active';
            case 'completed': return 'Completed';
            case 'on-hold': return 'On Hold';
            default: return 'Active';
        }
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    hasProjects(): boolean {
        return this.projects.length > 0;
    }
}
