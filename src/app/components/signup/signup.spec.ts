import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { Signup } from './signup';
import { Api } from '../../services/api';


describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let apiService: Api;
  let signupSpy: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [Api],
    }).compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    apiService = TestBed.inject(Api);
    signupSpy = vi.spyOn(apiService, 'signup');
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the form with empty values', () => {
      expect(component.signupForm.get('email')?.value).toBe('');
      expect(component.signupForm.get('password')?.value).toBe('');
      expect(component.signupForm.get('name')?.value).toBe('');
      expect(component.signupForm.get('surname')?.value).toBe('');
      expect(component.signupForm.get('birthday')?.value).toBe('');
    });

    it('should initialize the form as invalid', () => {
      expect(component.signupForm.invalid).toBeTruthy();
    });

    it('should initialize signupReponse as empty string', () => {
      expect(component.signupReponse).toBe('');
    });
  });

  describe('Email Validation', () => {
    it('should mark email as invalid when empty', () => {
      const emailControl = component.signupForm.get('email');
      emailControl?.markAsTouched();
      expect(emailControl?.hasError('required')).toBeTruthy();
    });

    it('should mark email as invalid when not in email format', () => {
      const emailControl = component.signupForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();
      expect(emailControl?.hasError('email')).toBeTruthy();
    });

    it('should mark email as valid with proper email format', () => {
      const emailControl = component.signupForm.get('email');
      emailControl?.setValue('test@example.com');
      expect(emailControl?.hasError('email')).toBeFalsy();
      expect(emailControl?.valid).toBeTruthy();
    });
  });

  describe('Password Validation', () => {
    it('should mark password as invalid when empty', () => {
      const passwordControl = component.signupForm.get('password');
      passwordControl?.markAsTouched();
      expect(passwordControl?.hasError('required')).toBeTruthy();
    });

    it('should mark password as invalid when less than 6 characters', () => {
      const passwordControl = component.signupForm.get('password');
      passwordControl?.setValue('short');
      passwordControl?.markAsTouched();
      expect(passwordControl?.hasError('minlength')).toBeTruthy();
    });

    it('should mark password as valid with 6 or more characters', () => {
      const passwordControl = component.signupForm.get('password');
      passwordControl?.setValue('password123');
      expect(passwordControl?.valid).toBeTruthy();
    });
  });

  describe('Name Validation', () => {
    it('should mark name as invalid when empty', () => {
      const nameControl = component.signupForm.get('name');
      nameControl?.markAsTouched();
      expect(nameControl?.hasError('required')).toBeTruthy();
    });

    it('should mark name as valid when filled', () => {
      const nameControl = component.signupForm.get('name');
      nameControl?.setValue('Maria');
      expect(nameControl?.valid).toBeTruthy();
    });
  });

  describe('Surname Validation', () => {
    it('should mark surname as invalid when empty', () => {
      const surnameControl = component.signupForm.get('surname');
      surnameControl?.markAsTouched();
      expect(surnameControl?.hasError('required')).toBeTruthy();
    });

    it('should mark surname as valid when filled', () => {
      const surnameControl = component.signupForm.get('surname');
      surnameControl?.setValue('Doe');
      expect(surnameControl?.valid).toBeTruthy();
    });
  });

  describe('Birthday Validation', () => {
    it('should mark birthday as invalid when empty', () => {
      const birthdayControl = component.signupForm.get('birthday');
      birthdayControl?.markAsTouched();
      expect(birthdayControl?.hasError('required')).toBeTruthy();
    });

    it('should mark birthday as valid when filled', () => {
      const birthdayControl = component.signupForm.get('birthday');
      birthdayControl?.setValue('1998-01-01');
      expect(birthdayControl?.valid).toBeTruthy();
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.signupForm.patchValue({
        email: 'user@test.com',
        password: 'password123',
        name: 'Maria',
        surname: 'Doe',
        birthday: '1998-01-01',
      });
    });

    it('should not submit when form is invalid', () => {
      component.signupForm.get('email')?.setValue('');
      component.signup();
      expect(signupSpy).not.toHaveBeenCalled();
    });

    it('should call apiService.signup with form data when form is valid', () => {
      signupSpy.mockReturnValue(of({ status: 201 }));
      component.signup();

      expect(signupSpy).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: 'password123',
        name: 'Maria',
        surname: 'Doe',
        birthday: '1998-01-01',
      });
    });

    it('should set signupReponse to "accepted" on successful signup', () => {
      signupSpy.mockReturnValue(of({ status: 201 }));
      component.signup();

      expect(component.signupReponse).toBe('accepted');
    });

    it('should set signupReponse to "error" on signup failure', () => {
      signupSpy.mockReturnValue(throwError(() => new Error('')));
      component.signup();

      expect(component.signupReponse).toBe('error');
    });

    it('should log error when signup fails', () => {
      const consoleSpy = vi.spyOn(console, 'log');
      signupSpy.mockReturnValue(throwError(() => new Error('')));
      component.signup();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
