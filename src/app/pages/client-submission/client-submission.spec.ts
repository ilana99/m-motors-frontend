import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ClientSubmission } from './client-submission';
import { Api } from '../../services/api';

describe('ClientSubmission', () => {
  let component: ClientSubmission;
  let fixture: ComponentFixture<ClientSubmission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSubmission],
      providers: [
        provideRouter([]),
        {
          provide: Api,
          useValue: {
            findOneCar: () => of({
              body: {
                id: '1',
                brand: 'Genesis',
                model: 'GV80',
                service: 'Leasing',
              },
            }),
            getProfile: () => of({ body: {} }),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientSubmission);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
