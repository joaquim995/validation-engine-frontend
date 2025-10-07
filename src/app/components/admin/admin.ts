import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidationRuleService, ValidationRuleData } from '../../services/validation-rule';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;
  rules: ValidationRuleData[] = [];
  selectedRule: ValidationRuleData | null = null;
  showForm = false;
  editing = false;
  private isLoading = false;

  newRule: ValidationRuleData = {
    object_type: '',
    expression: '',
    error_message: '',
    is_active: true
  };

  objectTypes = ['WorkOrder', 'Contact', 'Asset'];

  constructor(private validationService: ValidationRuleService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadRules();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible'] && changes['isVisible'].currentValue === true) {
        this.loadRules();
    }
  }

  loadRules() {
    if (this.isLoading) {
      return;
    }
    
    this.isLoading = true;
    
    this.validationService.getRules().subscribe({
      next: (data) => {
        this.rules = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading rules:', error);
        this.isLoading = false;
      }
    });
  }

  addRule() {
    console.log('addRule() called, current rules count:', this.rules.length);
    this.editing = false;
    this.newRule = {
      object_type: '',
      expression: '',
      error_message: '',
      is_active: true
    };
    this.showForm = true;
  }

  editRule(rule: ValidationRuleData) {
    this.editing = true;
    this.newRule = { ...rule };
    this.showForm = true;
  }

  saveRule() {
    if (this.editing && this.newRule.id) {
      this.validationService.updateRule(this.newRule.id, this.newRule).subscribe({
        next: () => {
          this.loadRules();
          this.cancelForm();
        },
        error: (error) => {
          console.error('Error updating rule:', error);
        }
      });
    } else {
      this.validationService.createRule(this.newRule).subscribe({
        next: () => {
          this.loadRules();
          this.cancelForm();
        },
        error: (error) => {
          console.error('Error creating rule:', error);
        }
      });
    }
  }

  deleteRule(rule: ValidationRuleData) {
    if (rule.id && confirm('Are you sure you want to delete this rule?')) {
      this.validationService.deleteRule(rule.id).subscribe({
        next: () => {
          this.loadRules();
        },
        error: (error) => {
          console.error('Error deleting rule:', error);
        }
      });
    }
  }

  cancelForm() {
    this.showForm = false;
    this.editing = false;
    this.selectedRule = null;
  }

  toggleRule(rule: ValidationRuleData) {
    if (rule.id) {
      const updatedRule = { ...rule, is_active: !rule.is_active };
      this.validationService.updateRule(rule.id, updatedRule).subscribe({
        next: () => {
          this.loadRules();
        },
        error: (error) => {
          console.error('Error toggling rule:', error);
        }
      });
    }
  }

}
