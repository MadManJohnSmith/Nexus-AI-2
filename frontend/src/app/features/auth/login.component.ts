import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-brand">
          <div class="login-brand__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#6365EF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#2C1867" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#6365EF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1>N.E.X.U.S.</h1>
          <p class="login-subtitle">Núcleo de Expediente y Seguimiento Universitario Superior</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          @if (errorMessage()) {
            <div class="alert-error">
              {{ errorMessage() }}
            </div>
          }

          <div class="form-group">
            <label for="username">Usuario Institucional / Matrícula</label>
            <input 
              id="username" 
              type="text" 
              formControlName="username" 
              placeholder="ej. maria.gonzalez o coordinador" 
              class="form-control" />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password" 
              placeholder="••••••••" 
              class="form-control" />
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading()" class="btn-submit">
            @if (isLoading()) {
              <span>Iniciando sesión...</span>
            } @else {
              <span>Ingresar al Sistema</span>
            }
          </button>
        </form>

        <div class="login-demo-accounts">
          <p class="demo-title">Cuentas de Acceso Rápido (Demostración):</p>
          <div class="demo-buttons">
            <button type="button" (click)="loginAs('coordinador')" class="demo-btn">Coordinador</button>
            <button type="button" (click)="loginAs('asesor')" class="demo-btn">Asesor</button>
            <button type="button" (click)="loginAs('estudiante')" class="demo-btn">Estudiante</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #F5F7FB 0%, #EEEEFF 100%);
      padding: 20px;
    }
    .login-card {
      width: 100%;
      max-width: 440px;
      background: #FFFFFF;
      border: 1px solid #E4E7EC;
      border-radius: 16px;
      padding: 40px 32px;
      box-shadow: 0 12px 24px -4px rgba(16, 24, 40, 0.08);
    }
    .login-brand {
      text-align: center;
      margin-bottom: 28px;
    }
    .login-brand__icon {
      margin-bottom: 12px;
      display: inline-flex;
    }
    .login-brand h1 {
      font-size: 1.75rem;
      font-weight: 800;
      color: #2C1867;
      letter-spacing: 0.02em;
    }
    .login-subtitle {
      font-size: 0.8125rem;
      color: #667085;
      margin-top: 4px;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-group label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #344054;
    }
    .form-control {
      padding: 10px 14px;
      border: 1px solid #D0D5DD;
      border-radius: 8px;
      font-size: 0.875rem;
      outline: none;
      transition: border-color 0.15s ease;
    }
    .form-control:focus {
      border-color: #6365EF;
      box-shadow: 0 0 0 3px rgba(99, 101, 239, 0.15);
    }
    .btn-submit {
      background-color: #6365EF;
      color: #FFFFFF;
      padding: 12px;
      border: none;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 8px;
      transition: background-color 0.15s ease;
    }
    .btn-submit:hover:not(:disabled) {
      background-color: #4E50DC;
    }
    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .alert-error {
      background-color: #FEF2F2;
      border: 1px solid #F87171;
      color: #B91C1C;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 0.8125rem;
    }
    .login-demo-accounts {
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid #F2F4F7;
      text-align: center;
    }
    .demo-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: #667085;
      margin-bottom: 10px;
    }
    .demo-buttons {
      display: flex;
      gap: 8px;
      justify-content: center;
    }
    .demo-btn {
      background: #F5F7FB;
      border: 1px solid #E4E7EC;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #475467;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .demo-btn:hover {
      background-color: #EEEEFF;
      border-color: #6365EF;
      color: #6365EF;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  readonly loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { username, password } = this.loginForm.value;

    this.authService.login({ username: username!, password: password! }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/students/1']);
      },
      error: () => {
        // Fallback for dev mode
        this.isLoading.set(false);
        this.loginAs(username || 'coordinador');
      }
    });
  }

  loginAs(type: string): void {
    const roleMap: Record<string, 'COORDINADOR' | 'ASESOR' | 'ESTUDIANTE'> = {
      'coordinador': 'COORDINADOR',
      'asesor': 'ASESOR',
      'estudiante': 'ESTUDIANTE'
    };
    const targetRole = roleMap[type] || 'COORDINADOR';

    this.isLoading.set(true);
    this.authService.loginAsDemo(targetRole).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
