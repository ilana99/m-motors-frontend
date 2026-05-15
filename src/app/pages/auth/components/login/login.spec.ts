import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { Login } from './login';
import { AuthService } from '../../../../services/auth';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let loginSpy: any;
  let navigateSpy: any;
  let navigateByUrlSpy: any;
  let queryParamMap = convertToParamMap({});

  beforeEach(async () => {
    loginSpy = vi.fn();
    queryParamMap = convertToParamMap({});

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            login: loginSpy,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              get queryParamMap() {
                return queryParamMap;
              },
            },
          },
        },
      ],
    }).compileComponents();

    navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    navigateByUrlSpy = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.loginForm.patchValue({
        email: 'user@gmail.com',
        password: 'password123',
      });
    });

    it('should set loginResponse to "connected" on status 200', () => {
      loginSpy.mockReturnValue(of({ status: 200 }));
      component.login();

      expect(loginSpy).toHaveBeenCalledWith({
        email: 'user@gmail.com',
        password: 'password123',
      });
      expect(component.loginResponse()).toBe('connected');
    });

    it('should set loginResponse to "connected" on status 201', () => {
      loginSpy.mockReturnValue(of({ status: 201 }));
      component.login();

      expect(component.loginResponse()).toBe('connected');
    });

    it('should redirect to cars on successful login', () => {
      loginSpy.mockReturnValue(of({ status: 200 }));
      component.login();

      expect(navigateByUrlSpy).toHaveBeenCalledWith('/cars');
    });

    it('should redirect to returnUrl on successful login', () => {
      queryParamMap = convertToParamMap({ returnUrl: '/submission/1' });
      loginSpy.mockReturnValue(of({ status: 200 }));
      component.login();

      expect(navigateByUrlSpy).toHaveBeenCalledWith('/submission/1');
    });

    it('should set loginResponse to "error" on 401 failure', () => {
      loginSpy.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 401 }))
      );
      component.login();

      expect(component.loginResponse()).toBe('error');
      expect(navigateSpy).not.toHaveBeenCalled();
      expect(navigateByUrlSpy).not.toHaveBeenCalled();
    });

    it('should move from error to connected on a later successful attempt', () => {
      loginSpy
        .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 401 })))
        .mockReturnValueOnce(of({ status: 200 }));

      component.login();
      expect(component.loginResponse()).toBe('error');

      component.login();
      expect(component.loginResponse()).toBe('connected');
    });

    it('should move from connected to error on a later failed attempt', () => {
      loginSpy
        .mockReturnValueOnce(of({ status: 201 }))
        .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 401 })));

      component.login();
      expect(component.loginResponse()).toBe('connected');

      component.login();
      expect(component.loginResponse()).toBe('error');
    });
  });
});
