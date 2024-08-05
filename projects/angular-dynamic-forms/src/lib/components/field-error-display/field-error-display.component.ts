import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslocoPipe } from '@ngneat/transloco';
import { fieldError } from '../../validations/field-error-types';

@Component({
  standalone: true,
  imports: [CommonModule, TranslocoPipe],
  selector: 'app-field-error-display',
  templateUrl: './field-error-display.component.html',
  styleUrls: ['./field-error-display.component.scss']
})
export class FieldErrorDisplayComponent {
  @Input() control!: AbstractControl;

  getError() {
    let error: fieldError | undefined;

    for (const x of Object.keys(fieldError)) {
      if (this.control?.hasError(fieldError[x])) {
        error = fieldError[x];
        break;
      }
    }

    return error;
  }
}
