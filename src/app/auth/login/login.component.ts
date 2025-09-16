// Angular imports
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core'; // Component decorator and lifecycle hook
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../core/services/auth.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { NotificationService } from '../../shared/services/notification.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isLoading = false;


  constructor(
    private fb: FormBuilder, // form builder
    private authService: AuthService,  // authentication service
    private notificationService: NotificationService,  // service for showing messages
    private router: Router  // angular's router for navigation
  ) {
    this.loginForm = this.createForm();  // Initialize the form
  }

  ngOnInit(): void {
    console.log('LoginComponent: Component initialized');

    // if user is already logged in, redirect them
    if (this.authService.isAuthenticated()) {
      console.log('LoginComponent: User is already logged in, redirecting to dashboard');
      this.router.navigate(['/dashboard']);
    }
  }

  // create the login form with validation rules
  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // handle form submission
  onSubmit(): void {
    console.log('LoginComponent: Form submitted');

    // if form is valid and not already loading
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      console.log('LoginComponent: Starting login process...');

      // get form data
      const credentials: LoginRequest = {
        email: this.loginForm.get('email')?.value?.trim(),
        password: this.loginForm.get('password')?.value
      };

      // call the auth service
      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('LoginComponent: Login successful:', response);

          if (response.status === 200 && response.data) {
            this.notificationService.showSuccess('Login Successful', 'Welcome back!');
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.log('LoginComponent: Login failed:', error);
          this.notificationService.showError('Login Failed', error.message || 'Invalid credentials');
        }
      });
    } else {
      console.log('LoginComponent: Form is invalid, marking fields as touched');
      this.markFormGroupTouched();
    }
  }

  // mark all form fields as touched to show validation errors
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // get error message for a specific form field
  getFieldError(fieldName: string): string {
    const control = this.loginForm.get(fieldName);

    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        return 'Password must be at least 6 characters long';
      }
    }
    return '';
  }

  // check if a field is invalid and has been touched
  isFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }
}
