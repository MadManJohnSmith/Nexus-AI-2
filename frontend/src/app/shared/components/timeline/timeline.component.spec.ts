import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimelineComponent } from './timeline.component';
import { MonitoringService } from '../../../core/services/monitoring.service';
import { of } from 'rxjs';
import { TimelineEvent } from '../../../core/models/timeline.model';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;
  let mockMonitoringService: jasmine.SpyObj<MonitoringService>;

  const mockEvents: TimelineEvent[] = [
    {
      id: 'tutoria-1',
      tipo: 'TUTORIA',
      titulo: 'Sesión de Tutoría (Presencial)',
      descripcion: 'Revisión semestral',
      fecha: '2025-02-20',
      estado: 'CONCLUIDA',
      icono: '📘',
      color: '#6365EF',
      metadata: {
        modalidad: 'PRESENCIAL',
        participantes: [{ nombre: 'Dr. Asesor', rol: 'Asesor Principal', asistencia: true }]
      }
    },
    {
      id: 'acuerdo-1',
      tipo: 'ACUERDO',
      titulo: 'Acuerdo: Entrega de borrador',
      descripcion: 'Entregar protocolo',
      fecha: '2025-02-22',
      estado: 'PENDIENTE',
      icono: '📝',
      color: '#57949D',
      metadata: {
        responsable: 'Juan Pérez',
        fecha_limite: '2025-02-22'
      }
    }
  ];

  beforeEach(async () => {
    mockMonitoringService = jasmine.createSpyObj('MonitoringService', ['getTimeline']);
    mockMonitoringService.getTimeline.and.returnValue(of({
      student_id: 1,
      total_eventos: 2,
      timeline: mockEvents
    }));

    await TestBed.configureTestingModule({
      imports: [TimelineComponent],
      providers: [
        { provide: MonitoringService, useValue: mockMonitoringService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
  });

  it('should create the timeline component', () => {
    expect(component).toBeTruthy();
  });

  it('should load timeline on init when studentId is passed', () => {
    component.studentId = 1;
    component.ngOnInit();
    expect(mockMonitoringService.getTimeline).toHaveBeenCalledWith(1);
    expect(component.events().length).toBe(2);
  });

  it('should filter events when filter is set', () => {
    component.events.set(mockEvents);
    component.setFilter('ACUERDO');
    expect(component.filteredEvents().length).toBe(1);
    expect(component.filteredEvents()[0].tipo).toBe('ACUERDO');
  });

  it('should open and close flyout drawer on event click', () => {
    component.openDrawer(mockEvents[0]);
    expect(component.isDrawerOpen()).toBeTrue();
    expect(component.selectedEvent()?.id).toBe('tutoria-1');

    component.closeDrawer();
    expect(component.isDrawerOpen()).toBeFalse();
    expect(component.selectedEvent()).toBeNull();
  });
});
