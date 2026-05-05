import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gallery } from './gallery';
import { of, throwError } from 'rxjs';
import { Api } from '../../../../services/api';

describe('Gallery', () => {
  let component: Gallery;
  let fixture: ComponentFixture<Gallery>;
  let apiMock: any;
  const storageUrl = 'https://project.supabase.co/storage/v1/object/public/cars';
  const cars = [
    {
      id: 1,
      brand: 'Genesis',
      model: 'GV80',
      price: 42000,
      service: 'Leasing',
      images: [`${storageUrl}/genesis-gv80-front.jpg`],
    },
    {
      id: 2,
      brand: 'Genesis',
      model: 'GV80',
      price: 39000,
      service: 'Sale',
      images: [`${storageUrl}/genesis-gv80-side.jpg`],
    },
  ];

  beforeEach(async () => {
    apiMock = {
      findAllCars: vi.fn().mockReturnValue(of({ body: [] })),
    };
    await TestBed.configureTestingModule({
      imports: [Gallery],
      providers: [
        { provide: Api, useValue: apiMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Gallery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cars from an array response body', () => {
    apiMock.findAllCars.mockReturnValue(of({ body: cars }));

    component.ngOnInit();

    expect(component.cars()).toEqual(cars);
  });

  it('should keep an empty cars list when the response body is not an array', () => {
    apiMock.findAllCars.mockReturnValue(of({ body: {} }));

    component.ngOnInit();

    expect(component.cars()).toEqual([]);
  });

  it('should keep an empty cars list when loading cars fails', () => {
    apiMock.findAllCars.mockReturnValue(throwError(() => new Error('')));

    component.ngOnInit();

    expect(component.cars()).toEqual([]);
  });

  it('should return display labels for known services', () => {
    expect(component.getServiceLabel('Leasing')).toBe('Location');
    expect(component.getServiceLabel('Sale')).toBe('Vente');
  });
});
