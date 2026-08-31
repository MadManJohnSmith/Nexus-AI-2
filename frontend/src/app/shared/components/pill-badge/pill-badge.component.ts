import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PillBadgeType = 
  | 'PENDIENTE'
  | 'EN_PROCESO'
  | 'CONCLUIDO'
  | 'VENCIDO'
  | 'ACTIVO'
  | 'INACTIVO'
  | 'INFO'
  | 'SUCCESS';

export type PillBadgeSize = 'sm' | 'md';

@Component({
  selector: 'app-pill-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pill-badge.component.html',
  styleUrls: ['./pill-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PillBadgeComponent {
  readonly type = input<PillBadgeType>('INFO');
  readonly text = input<string>('');
  readonly size = input<PillBadgeSize>('md');
  readonly showDot = input<boolean>(false);

  // Normalized label if text is empty
  readonly displayLabel = computed(() => {
    const customText = this.text();
    if (customText) return customText;
    
    switch (this.type()) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'EN_PROCESO':
        return 'En Proceso';
      case 'CONCLUIDO':
        return 'Concluido';
      case 'VENCIDO':
        return 'Vencido';
      case 'ACTIVO':
        return 'Activo';
      case 'INACTIVO':
        return 'Inactivo';
      case 'SUCCESS':
        return 'Éxito';
      case 'INFO':
      default:
        return 'Info';
    }
  });

  readonly badgeClasses = computed(() => {
    return `pill-badge pill-badge--${this.type().toLowerCase().replace('_', '-')} pill-badge--${this.size()}`;
  });
}
