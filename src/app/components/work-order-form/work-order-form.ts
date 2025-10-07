import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidationRuleService, ValidationRequest } from '../../services/validation-rule';
import { ValidationErrorDisplay } from '../validation-error-display/validation-error-display';

@Component({
  selector: 'app-work-order-form',
  imports: [CommonModule, FormsModule, ValidationErrorDisplay],
  templateUrl: './work-order-form.html',
  styleUrl: './work-order-form.css'
})
export class WorkOrderForm {
  formData = {
    Priority: '',
    Estimated_Cost: 0,
    Start_Date: '',
    End_Date: '',
    Status: 'Open',
    Description: ''
  };

  validationErrors: string[] = [];
  showValidationErrors = false;
  isSubmitting = false;

  constructor(private validationService: ValidationRuleService, private cdr: ChangeDetectorRef) {}

  onSubmit() {
    if (this.isSubmitting) {
      return;
    }

    this.showValidationErrors = false;
    this.validationErrors = [];
    this.isSubmitting = false;
    

    const clientValidationErrors = this.validateFormClientSide();
    
    if (clientValidationErrors.length > 0) {
      this.validationErrors = clientValidationErrors;
      this.showValidationErrors = true;
      this.isSubmitting = false;
      this.cdr.detectChanges();
      return;
    }
    
    const request: ValidationRequest = {
      object_type: 'WorkOrder',
      form_data: this.formData
    };

    this.validationService.validateForm(request).subscribe({
      next: (response) => {
        if (!response.success && response.errors.length > 0) {
          this.validationErrors = [...response.errors];
          this.showValidationErrors = true;
          this.isSubmitting = false;
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        } else {
          this.saveWorkOrder();
        }
      },
      error: (error) => {
        console.error('Validation error:', error);
        
        if (error.error && error.error.errors && Array.isArray(error.error.errors)) {
          this.validationErrors = [...error.error.errors];
        } else {
          this.validationErrors = ['An error occurred during validation.'];
        }
        
        this.showValidationErrors = true;
        this.isSubmitting = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  private validateFormClientSide(): string[] {
    const errors: string[] = [];

    if (!this.formData.Priority || this.formData.Priority.trim() === '') {
      errors.push('Priority is required.');
    }

    if (!this.formData.Estimated_Cost || this.formData.Estimated_Cost <= 0) {
      errors.push('Estimated Cost must be greater than 0.');
    }

    if (!this.formData.Start_Date) {
      errors.push('Start Date is required.');
    } else {
      const startDate = new Date(this.formData.Start_Date);
      const today = new Date();
      if (startDate < today) {
        errors.push('Start date cannot be in the past.');
      }
    }

    if (!this.formData.End_Date) {
      errors.push('End Date is required.');
    }

    if (this.formData.Start_Date && this.formData.End_Date) {
      const startDate = new Date(this.formData.Start_Date);
      const endDate = new Date(this.formData.End_Date);
      
      if (startDate >= endDate) {
        errors.push('End Date must be after Start Date.');
      }
    }

    if (!this.formData.Status || this.formData.Status.trim() === '') {
      errors.push('Status is required.');
    }

    return errors;
  }

  private saveWorkOrder() {
    alert('Work Order saved successfully!');
    this.resetForm();
    this.isSubmitting = false;
  }

  resetForm() {
    this.formData = {
      Priority: '',
      Estimated_Cost: 0,
      Start_Date: '',
      End_Date: '',
      Status: 'Open',
      Description: ''
    };
    this.showValidationErrors = false;
    this.validationErrors = [];
  }
}
