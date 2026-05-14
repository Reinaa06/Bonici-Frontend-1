import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtaComponent } from './cta';

describe('Cta', () => {
  let component: CtaComponent ;
  let fixture: ComponentFixture<CtaComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CtaComponent ],
    }).compileComponents();

    fixture = TestBed.createComponent(CtaComponent );
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
