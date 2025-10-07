import { Component, Input, ChangeDetectorRef, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validation-error-display',
  imports: [CommonModule],
  templateUrl: './validation-error-display.html',
  styleUrl: './validation-error-display.css'
})
export class ValidationErrorDisplay implements OnChanges, OnInit {
  @Input() errors: string[] = [];
  @Input() show: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['errors'] || changes['show']) {
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      
      Promise.resolve().then(() => {
        this.cdr.detectChanges();
      });
    }
  }
}
