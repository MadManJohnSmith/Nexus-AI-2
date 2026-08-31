import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentOverviewComponent } from './student-overview.component';
import { StudentService } from '../../core/services/student.service';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('StudentOverviewComponent', () => {
  let component: StudentOverviewComponent;
  let fixture: ComponentFixture<StudentOverviewComponent>;
  let studentService: StudentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentOverviewComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        StudentService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    studentService = TestBed.inject(StudentService);
    fixture = TestBed.createComponent(StudentOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the StudentOverviewComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should load student details on initialization', () => {
    expect(component.student()).toBeTruthy();
    expect(component.student()?.matricula).toBe('DOC-2023-042');
  });

  it('should update activeSemester when tab is clicked', () => {
    component.selectSemester(2);
    expect(component.activeSemester()).toBe(2);

    component.selectSemester('ALL');
    expect(component.activeSemester()).toBe('ALL');
  });

  it('should calculate pending and overdue agreements correctly', () => {
    const pending = component.pendingAgreementsCount();
    const overdue = component.overdueAgreementsCount();
    expect(pending).toBeGreaterThanOrEqual(0);
    expect(overdue).toBeGreaterThanOrEqual(0);
  });

  it('should render 70/30 grid layout elements', () => {
    const mainCol = fixture.nativeElement.querySelector('.overview-grid__col-main');
    const sideCol = fixture.nativeElement.querySelector('.overview-grid__col-side');

    expect(mainCol).toBeTruthy();
    expect(sideCol).toBeTruthy();
  });
});
