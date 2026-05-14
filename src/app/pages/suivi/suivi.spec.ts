import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviComponent } from './suivi';

describe('Suivi', () => {
  let component: SuiviComponent;
  let fixture: ComponentFixture<SuiviComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiviComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuiviComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
