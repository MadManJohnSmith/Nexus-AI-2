import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/app-shell/app-shell.component').then(m => m.AppShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'students/1'
      },
      {
        path: 'students',
        loadComponent: () => import('./features/students-list/students-list.component').then(m => m.StudentsListComponent)
      },
      {
        path: 'students/:id',
        loadComponent: () => import('./features/student-overview/student-overview.component').then(m => m.StudentOverviewComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'tutoring',
        loadComponent: () => import('./features/student-overview/student-overview.component').then(m => m.StudentOverviewComponent)
      },
      {
        path: 'agreements',
        loadComponent: () => import('./features/agreements/agreements-list/agreements-list.component').then(m => m.AgreementsListComponent)
      },
      {
        path: 'academic-output',
        loadComponent: () => import('./features/academic-output/academic-output.component').then(m => m.AcademicOutputComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/student-overview/student-overview.component').then(m => m.StudentOverviewComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
