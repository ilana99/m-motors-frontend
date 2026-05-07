import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDetailed } from './car-detailed';

describe('CarDetailed', () => {
  let component: CarDetailed;
  let fixture: ComponentFixture<CarDetailed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarDetailed],
    }).compileComponents();

    fixture = TestBed.createComponent(CarDetailed);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
