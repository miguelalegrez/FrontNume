import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationBoxComponent } from './modification-box.component';

describe('ModificationBoxComponent', () => {
  let component: ModificationBoxComponent;
  let fixture: ComponentFixture<ModificationBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificationBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModificationBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
