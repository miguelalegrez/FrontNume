import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentCreationBoxComponent } from './appointment-creation-box.component';

describe('UserCreationBoxComponent', () => {
  let component: AppointmentCreationBoxComponent;
  let fixture: ComponentFixture<AppointmentCreationBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentCreationBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentCreationBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
