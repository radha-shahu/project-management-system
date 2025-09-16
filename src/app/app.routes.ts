import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/home/home.component').then(m => m.HomeComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'projects',
        loadComponent: () => import('./projects/project-list/project-list.component').then(m => m.ProjectListComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'projects/create',
        loadComponent: () => import('./projects/project-create/project-create.component').then(m => m.ProjectCreateComponent),
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: '/dashboard'
    }
];
