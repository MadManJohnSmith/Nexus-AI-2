import { Component, signal, computed, inject, ChangeDetectionStrategy, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { MonitoringService } from '../../../core/services/monitoring.service';
import { UserRole } from '../../../core/models/user.model';
import { PillBadgeComponent } from '../pill-badge/pill-badge.component';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  roles?: UserRole[];
  exact?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  url: string;
}

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, PillBadgeComponent],
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly monitoringService = inject(MonitoringService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  // Responsive and collapse state
  readonly isSidebarCollapsed = signal<boolean>(false);
  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly isProfileMenuOpen = signal<boolean>(false);
  readonly isNotificationsMenuOpen = signal<boolean>(false);
  readonly selectedPeriod = signal<string>('2024-B');


  // Dynamic breadcrumbs
  readonly breadcrumbs = signal<BreadcrumbItem[]>([
    { label: 'Inicio', url: '/' },
    { label: 'Expediente', url: '/students/1' }
  ]);

  // Navigation catalog
  readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'dashboard',
      roles: ['ADMIN', 'COORDINADOR']
    },
    {
      label: 'Estudiantes',
      route: '/students',
      icon: 'users',
      exact: true,
      roles: ['ADMIN', 'COORDINADOR', 'ASESOR', 'COASESOR', 'COMITE']
    },
    {
      label: 'Expediente',
      route: '/students/1',
      icon: 'folder',
      roles: ['ADMIN', 'COORDINADOR', 'ASESOR', 'COASESOR', 'COMITE', 'ESTUDIANTE']
    },
    {
      label: 'Tutorías',
      route: '/tutoring',
      icon: 'book',
      roles: ['ADMIN', 'COORDINADOR', 'ASESOR', 'COASESOR', 'COMITE', 'ESTUDIANTE']
    },
    {
      label: 'Acuerdos',
      route: '/agreements',
      icon: 'check-square',
      roles: ['ADMIN', 'COORDINADOR', 'ASESOR', 'COASESOR', 'COMITE', 'ESTUDIANTE']
    },
    {
      label: 'Producción',
      route: '/academic-output',
      icon: 'award',
      roles: ['ADMIN', 'COORDINADOR', 'ASESOR', 'COASESOR', 'ESTUDIANTE']
    },
    {
      label: 'Reportes',
      route: '/reports',
      icon: 'file-text',
      roles: ['ADMIN', 'COORDINADOR', 'ASESOR']
    }
  ];

  // Filtered navigation items based on current role
  readonly filteredNavItems = computed(() => {
    const role = this.authService.currentUser()?.role || 'COORDINADOR';
    return this.navItems.filter(item => !item.roles || item.roles.includes(role));
  });

  readonly userRolePillType = computed(() => {
    const role = this.authService.currentUser()?.role;
    switch (role) {
      case 'COORDINADOR':
      case 'ADMIN':
        return 'INFO';
      case 'ASESOR':
      case 'COASESOR':
        return 'SUCCESS';
      case 'ESTUDIANTE':
        return 'EN_PROCESO';
      default:
        return 'INFO';
    }
  });

  constructor() {
    // If no user in authService (e.g. initial demo load), set default demo user
    if (!this.authService.currentUser()) {
      this.authService.setCurrentUserForDev({
        id: 1,
        username: 'coordinador.posgrado',
        email: 'coordinador@posgrado.edu',
        firstName: 'Dr. Alejandro',
        lastName: 'Vázquez Morales',
        fullName: 'Dr. Alejandro Vázquez Morales',
        role: 'COORDINADOR',
        isActive: true,
        institution: 'Facultad de Ingeniería'
      });
    }

    this.updateBreadcrumbs(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateBreadcrumbs(event.urlAfterRedirects || event.url);
      this.isMobileMenuOpen.set(false);
      this.isProfileMenuOpen.set(false);
      this.isNotificationsMenuOpen.set(false);
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.monitoringService.refreshAlerts();
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(prev => !prev);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(prev => !prev);
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen.update(prev => !prev);
    if (this.isProfileMenuOpen()) {
      this.isNotificationsMenuOpen.set(false);
    }
  }

  toggleNotificationsMenu(): void {
    this.isNotificationsMenuOpen.update(prev => !prev);
    if (this.isNotificationsMenuOpen()) {
      this.isProfileMenuOpen.set(false);
      this.monitoringService.refreshAlerts();
    }
  }

  closeMenus(): void {
    this.isProfileMenuOpen.set(false);
    this.isNotificationsMenuOpen.set(false);
  }

  onPeriodChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedPeriod.set(select.value);
  }

  logout(): void {
    this.authService.logout();
  }

  private updateBreadcrumbs(url: string): void {
    const crumbs: BreadcrumbItem[] = [{ label: 'Inicio', url: '/' }];
    const cleanUrl = url.split('?')[0];

    if (cleanUrl.includes('/dashboard')) {
      crumbs.push({ label: 'Dashboard Coordinador', url: '/dashboard' });
    } else if (cleanUrl.startsWith('/students')) {
      crumbs.push({ label: 'Estudiantes', url: '/students' });
      const parts = cleanUrl.split('/');
      if (parts.length > 2 && parts[2]) {
        crumbs.push({ label: 'Expediente del Doctorando', url: cleanUrl });
      }
    } else if (cleanUrl.includes('/tutoring')) {
      crumbs.push({ label: 'Tutorías', url: '/tutoring' });
    } else if (cleanUrl.includes('/agreements')) {
      crumbs.push({ label: 'Acuerdos y Compromisos', url: '/agreements' });
    } else if (cleanUrl.includes('/academic-output')) {
      crumbs.push({ label: 'Producción Académica', url: '/academic-output' });
    } else if (cleanUrl.includes('/reports')) {
      crumbs.push({ label: 'Reportes Integrales', url: '/reports' });
    }

    this.breadcrumbs.set(crumbs);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-profile-menu')) {
      this.isProfileMenuOpen.set(false);
    }
    if (!target.closest('.nexus-notifications-box')) {
      this.isNotificationsMenuOpen.set(false);
    }
  }
}
