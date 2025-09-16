import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

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

  constructor() { }

  getProjects(): Observable<ApiResponse<Project[]>> {
    const projects = this.getFromStorage();
    return of({
      status: 200,
      data: projects,
      message: 'Projects retrieved successfully'
    }).pipe(delay(800)); // Simulate API delay
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
    }).pipe(delay(1200));
  }

  private getFromStorage(): Project[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(projects: Project[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
  }
}
