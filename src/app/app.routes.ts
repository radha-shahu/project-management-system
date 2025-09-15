import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
        canActivate: [authGuard]
    },
    {
        path: 'projects',
        loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule),
        canActivate: [authGuard]
    },
    {
        path: 'projects/create',
        loadComponent: () => import('./projects/project-create/project-create.component').then(m => m.ProjectCreateComponent),
        canActivate: [authGuard]
    },
    // Team and Reports modules will be implemented in later weeks
    // {
    //   path: 'team',
    //   loadChildren: () => import('./team/team.module').then(m => m.TeamModule),
    //   canActivate: [authGuard]
    // },
    // {
    //   path: 'reports',
    //   loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
    //   canActivate: [authGuard]
    // },
    {
        path: '**',
        redirectTo: '/dashboard'
    }
];
