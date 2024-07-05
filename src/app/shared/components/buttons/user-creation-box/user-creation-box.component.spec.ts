import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreationBoxComponent } from './user-creation-box.component';

describe('UserCreationBoxComponent', () => {
  let component: UserCreationBoxComponent;
  let fixture: ComponentFixture<UserCreationBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreationBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserCreationBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
