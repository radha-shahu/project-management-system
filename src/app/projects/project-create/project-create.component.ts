import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProjectService, CreateProjectRequest } from '../services/project.service';
import { NotificationService } from '../../shared/services/notification.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    HeaderComponent,
    SidebarComponent,
    LoaderComponent
  ],
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.scss'
})
export class ProjectCreateComponent implements OnInit {
  projectForm: FormGroup;
  isLoading = false;
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  constructor() {
    this.projectForm = this.createForm();
  }

  ngOnInit(): void {
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthStr = nextMonth.toISOString().split('T')[0];

    this.projectForm.patchValue({
      startDate: today,
      endDate: nextMonthStr
    });

    // Listen for start date changes to update end date min
    this.projectForm.get('startDate')?.valueChanges.subscribe(startDate => {
      if (startDate) {
        const endDateControl = this.projectForm.get('endDate');
        const currentEndDate = endDateControl?.value;

        // If current end date is before new start date, clear it
        if (currentEndDate && new Date(currentEndDate) < new Date(startDate)) {
          endDateControl?.setValue('');
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(1000)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    }, { validators: this.dateRangeValidator });
  }

  private dateRangeValidator(form: FormGroup) {
    const startDate = form.get('startDate')?.value;
    const endDate = form.get('endDate')?.value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return { dateRange: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.projectForm.valid && !this.isLoading) {
      this.isLoading = true;

      const projectData: CreateProjectRequest = {
        name: this.projectForm.get('name')?.value?.trim(),
        description: this.projectForm.get('description')?.value?.trim() || undefined,
        startDate: this.projectForm.get('startDate')?.value,
        endDate: this.projectForm.get('endDate')?.value
      };

      this.projectService.createProject(projectData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.status === 201 && response.data) {
            this.notificationService.showSuccess('Project Created', `Project "${response.data.name}" has been created successfully!`);
            this.router.navigate(['/projects']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.notificationService.showError('Creation Failed', error.message || 'Failed to create project');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.projectForm.controls).forEach(key => {
      const control = this.projectForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.projectForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (control.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['maxlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must not exceed ${control.errors['maxlength'].requiredLength} characters`;
      }
    }

    // Check for form-level errors
    if (fieldName === 'endDate' && this.projectForm.errors?.['dateRange'] && this.projectForm.get('endDate')?.touched) {
      return 'End date must be on or after start date';
    }

    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.projectForm.get(fieldName);
    return !!(control?.invalid && control.touched);
  }

  getMinEndDate(): string {
    const startDate = this.projectForm.get('startDate')?.value;
    return startDate || new Date().toISOString().split('T')[0];
  }

  isFormInvalid(): boolean {
    return this.projectForm.invalid;
  }

  getFormError(): string {
    if (this.projectForm.errors?.['dateRange']) {
      return 'End date must be on or after start date';
    }
    return '';
  }
}
