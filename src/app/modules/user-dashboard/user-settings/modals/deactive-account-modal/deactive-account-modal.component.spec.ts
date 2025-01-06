import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactiveAccountModalComponent } from './deactive-account-modal.component';

describe('DeactiveAccountModalComponent', () => {
  let component: DeactiveAccountModalComponent;
  let fixture: ComponentFixture<DeactiveAccountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeactiveAccountModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeactiveAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
