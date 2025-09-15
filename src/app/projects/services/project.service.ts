import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';

export interface Project {
  id?: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status?: 'active' | 'completed' | 'on-hold';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface ApiResponse<T> {
  status: number;
  data?: T;
  error?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly STORAGE_KEY = 'projects';

  constructor(private apiService: ApiService) { }

  getProjects(): Observable<ApiResponse<Project[]>> {
    const projects = this.getFromStorage();
    return of({
      status: 200,
      data: projects,
      message: 'Projects retrieved successfully'
    }).pipe(delay(800)); // Simulate API delay
  }

  getProject(id: number): Observable<Project | null> {
    const projects = this.getFromStorage();
    const project = projects.find(p => p.id === id);
    return of(project || null);
  }

  createProject(projectData: CreateProjectRequest): Observable<ApiResponse<Project>> {
    const projects = this.getFromStorage();

    // Check for duplicate names
    const existingProject = projects.find(p =>
      p.name.toLowerCase().trim() === projectData.name.toLowerCase().trim()
    );

    if (existingProject) {
      return throwError(() => ({
        status: 400,
        error: 'Project name already exists',
        message: 'A project with this name already exists. Please choose a different name.'
      }));
    }

    const newProject: Project = {
      ...projectData,
      id: Date.now(),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    projects.push(newProject);
    this.saveToStorage(projects);

    return of({
      status: 201,
      data: newProject,
      message: 'Project created successfully'
    }).pipe(delay(1200)); // Simulate API delay
  }

  updateProject(id: number, projectData: Partial<Project>): Observable<Project> {
    const projects = this.getFromStorage();
    const projectIndex = projects.findIndex(p => p.id === id);

    if (projectIndex === -1) {
      throw new Error('Project not found');
    }

    // Check for duplicate names (excluding current project)
    if (projectData.name) {
      const existingProject = projects.find(p =>
        p.id !== id && p.name.toLowerCase().trim() === projectData.name!.toLowerCase().trim()
      );

      if (existingProject) {
        throw new Error('Project name already exists');
      }
    }

    const updatedProject = {
      ...projects[projectIndex],
      ...projectData,
      updatedAt: new Date().toISOString()
    };

    projects[projectIndex] = updatedProject;
    this.saveToStorage(projects);

    return of(updatedProject);
  }

  deleteProject(id: number): Observable<boolean> {
    const projects = this.getFromStorage();
    const filteredProjects = projects.filter(p => p.id !== id);

    if (projects.length === filteredProjects.length) {
      throw new Error('Project not found');
    }

    this.saveToStorage(filteredProjects);
    return of(true);
  }

  private getFromStorage(): Project[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(projects: Project[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
  }
}
