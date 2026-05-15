import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { Signup } from './signup';
import { AuthService } from '../../../../services/auth';

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let signupSpy: any;
  let navigateSpy: any;

  beforeEach(async () => {
    signupSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            signup: signupSpy,
          },
        },
      ],
    }).compileComponents();

    navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  describe('Form Submission', () => {
    beforeEach(() => {
      component.signupForm.patchValue({
        email: 'user@gmail.com',
        password: 'password123',
        name: 'Maria',
        surname: 'Marie',
        birthday: '1998-01-01',
      });
    });

    it('should not submit when form is invalid', () => {
      component.signupForm.get('email')?.setValue('');
      component.signup();
      expect(signupSpy).not.toHaveBeenCalled();
    });

    it('should call auth.signup with form data when form is valid', () => {
      signupSpy.mockReturnValue(of({ status: 201 }));
      component.signup();

      expect(signupSpy).toHaveBeenCalledWith({
        email: 'user@gmail.com',
        password: 'password123',
        name: 'Maria',
        surname: 'Marie',
        birthday: '1998-01-01',
      });
    });

    it('should set signupResponse to "accepted" on successful signup', () => {
      signupSpy.mockReturnValue(of({ status: 201 }));
      component.signup();

      expect(component.signupResponse()).toBe('accepted');
    });

    it('should redirect on successful signup', () => {
      signupSpy.mockReturnValue(of({ status: 201 }));
      component.signup();

      expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });

    it('should set signupResponse to "error" on signup failure', () => {
      signupSpy.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 500 }))
      );
      component.signup();

      expect(component.signupResponse()).toBe('error');
    });

    it('should move from error to accepted on a later successful attempt', () => {
      signupSpy
        .mockReturnValueOnce(
          throwError(() => new HttpErrorResponse({ status: 500 }))
        )
        .mockReturnValueOnce(of({ status: 201 }));

      component.signup();
      expect(component.signupResponse()).toBe('error');

      component.signup();
      expect(component.signupResponse()).toBe('accepted');
    });

    it('should move from accepted to error on a later failed attempt', () => {
      signupSpy
        .mockReturnValueOnce(of({ status: 201 }))
        .mockReturnValueOnce(
          throwError(() => new HttpErrorResponse({ status: 500 }))
        );

      component.signup();
      expect(component.signupResponse()).toBe('accepted');

      component.signup();
      expect(component.signupResponse()).toBe('error');
    });

    it('should log error when signup fails', () => {
      const consoleSpy = vi
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);
      signupSpy.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 500 }))
      );
      component.signup();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
