import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { ClientfileDetailed } from './clientfile-detailed';
import { Api } from '../../services/api';

describe('ClientfileDetailed', () => {
  let component: ClientfileDetailed;
  let fixture: ComponentFixture<ClientfileDetailed>;
  let findOneClientfileSpy: any;

  const clientfile = {
    id: '1',
    car: {
      id: '2',
      brand: 'Genesis',
      model: 'GV80',
      price: '200.00',
      service: 'Leasing',
      images: [],
      isAvailable: true,
    },
    status: 'Pending',
    dateSubmitted: '2026-05-08',
    identityCard: 'identity-card.jpg',
    proofOfAddress: 'proof-of-address.jpg',
    insurance: true,
    roadsideAssistance: false,
    maintenance: true,
    technicalControl: false,
  };

  beforeEach(async () => {
    findOneClientfileSpy = vi.fn().mockReturnValue(of({ body: clientfile }));

    await TestBed.configureTestingModule({
      imports: [ClientfileDetailed],
      providers: [
        provideRouter([]),
        {
          provide: Api,
          useValue: {
            findOneClientfile: findOneClientfileSpy,
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

    fixture = TestBed.createComponent(ClientfileDetailed);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the client file on init', () => {
    component.ngOnInit();

    expect(findOneClientfileSpy).toHaveBeenCalledWith('1');
    expect(component.clientfile()).toEqual(clientfile);
  });

  it('should display the client file', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Votre dossier');
    expect(fixture.nativeElement.textContent).toContain('Déposé le 2026-05-08');
    expect(fixture.nativeElement.textContent).toContain('En cours de traitement');
    expect(fixture.nativeElement.textContent).toContain('Genesis GV80');
    expect(fixture.nativeElement.textContent).toContain('Location');
    expect(fixture.nativeElement.textContent).toContain('Assurance tout risque: Oui');
  });
});
