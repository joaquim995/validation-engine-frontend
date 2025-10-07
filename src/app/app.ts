import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WorkOrderForm } from './components/work-order-form/work-order-form';
import { Admin } from './components/admin/admin';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, WorkOrderForm, Admin],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Validation Rule Engine');
  currentView = 'work-order';

  showWorkOrderForm() {
    this.currentView = 'work-order';
  }

  showAdmin() {
    this.currentView = 'admin';
  }
}
