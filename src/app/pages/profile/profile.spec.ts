import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, it, beforeEach, expect, vi } from 'vitest';

import { Profile } from './profile';
import { Api } from '../../services/api';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let getProfileSpy: any;
  let getMyClientfilesSpy: any;
  let cancelMyClientfileSpy: any;

  const user = {
    surname: 'Marie',
    name: 'Maria',
    birthday: '1998-01-01',
    email: 'user@gmail.com',
  };

  const clientfiles = [
    {
      id: '1',
      car: {
        brand: 'Genesis',
        model: 'GV80',
        service: 'Leasing',
      },
      status: 'Pending',
    },
    {
      id: '2',
      car: {
        brand: 'Genesis',
        model: 'GV80',
        service: 'Sale',
      },
      status: 'Accepted',
    },
  ];

  beforeEach(async () => {
    getProfileSpy = vi.fn();
    getMyClientfilesSpy = vi.fn();
    cancelMyClientfileSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        provideRouter([]),
        {
          provide: Api,
          useValue: {
            getProfile: getProfileSpy,
            getMyClientfiles: getMyClientfilesSpy,
            cancelMyClientfile: cancelMyClientfileSpy,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    getProfileSpy.mockReturnValue(of({ body: user }));
    getMyClientfilesSpy.mockReturnValue(of({ body: clientfiles }));
    cancelMyClientfileSpy.mockReturnValue(of({
      body: [
        {
          ...clientfiles[0],
          status: 'Canceled',
        },
        clientfiles[1],
      ],
    }));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the user profile on init', () => {
    component.ngOnInit();

    expect(getProfileSpy).toHaveBeenCalled();
    expect(component.user()).toEqual(user);
  });

  it('should load the user client files on init', () => {
    component.ngOnInit();

    expect(getMyClientfilesSpy).toHaveBeenCalled();
    expect(component.clientfile()).toEqual(clientfiles);
  });

  it('should display the user profile', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Marie');
    expect(fixture.nativeElement.textContent).toContain('Maria');
    expect(fixture.nativeElement.textContent).toContain('1998-01-01');
    expect(fixture.nativeElement.textContent).toContain('user@gmail.com');
  });

  it('should display the user client files', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Dossier client');
    expect(fixture.nativeElement.textContent).toContain('Dossier en cours');
    expect(fixture.nativeElement.textContent).toContain('Dossiers passés');
    expect(fixture.nativeElement.textContent).toContain('En cours de traitement');
    expect(fixture.nativeElement.textContent).toContain('Accepté');
    expect(fixture.nativeElement.textContent).toContain('Location');
    expect(fixture.nativeElement.textContent).toContain('Vente');
    expect(fixture.nativeElement.textContent).toContain('Genesis GV80');
  });

  it('should return display labels for known services', () => {
    expect(component.getServiceLabel('Leasing')).toBe('Location');
    expect(component.getServiceLabel('Sale')).toBe('Vente');
    expect(component.getServiceLabel('Other')).toBe('Other');
  });

  it('should cancel the selected client file', () => {
    component.clientfile.set(clientfiles);
    component.clientfileToCancel.set(clientfiles[0]);

    component.cancelClientfile();

    expect(cancelMyClientfileSpy).toHaveBeenCalled();
    expect(component.clientfile()[0].status).toBe('Canceled');
    expect(component.clientfileToCancel()).toBeNull();
  });

  it('should log error when loading profile fails', () => {
    const consoleSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);
    const error = new Error('');
    getProfileSpy.mockReturnValue(throwError(() => error));

    component.ngOnInit();

    expect(consoleSpy).toHaveBeenCalledWith(error);
    consoleSpy.mockRestore();
  });
});
