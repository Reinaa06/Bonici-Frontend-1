import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularDishesComponent } from './popular-dishes';

describe('PopularDishes', () => {
  let component: PopularDishesComponent;
  let fixture: ComponentFixture<PopularDishesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularDishesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PopularDishesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
