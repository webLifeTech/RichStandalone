import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTypesComponent } from './card-types.component';

describe('CardTypesComponent', () => {
  let component: CardTypesComponent;
  let fixture: ComponentFixture<CardTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
