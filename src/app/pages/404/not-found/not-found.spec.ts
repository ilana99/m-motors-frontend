import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFound } from './not-found';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('NotFound', () => {
  let component: NotFound;
  let fixture: ComponentFixture<NotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFound],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ for: '404' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFound);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
