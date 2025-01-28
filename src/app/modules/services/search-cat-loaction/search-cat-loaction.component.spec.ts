import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCatLoactionComponent } from './search-cat-loaction.component';

describe('SearchCatLoactionComponent', () => {
  let component: SearchCatLoactionComponent;
  let fixture: ComponentFixture<SearchCatLoactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchCatLoactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchCatLoactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
