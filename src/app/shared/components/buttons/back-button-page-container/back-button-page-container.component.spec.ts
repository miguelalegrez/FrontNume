import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackButtonPageContainerComponent } from './back-button-page-container.component';

describe('BackButtonPageContainerComponent', () => {
  let component: BackButtonPageContainerComponent;
  let fixture: ComponentFixture<BackButtonPageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackButtonPageContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BackButtonPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
