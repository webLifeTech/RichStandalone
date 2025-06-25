import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerificationSuccessModalComponent } from './email-verification-success-modal.component';

describe('EmailVerificationSuccessModalComponent', () => {
  let component: EmailVerificationSuccessModalComponent;
  let fixture: ComponentFixture<EmailVerificationSuccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailVerificationSuccessModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailVerificationSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
