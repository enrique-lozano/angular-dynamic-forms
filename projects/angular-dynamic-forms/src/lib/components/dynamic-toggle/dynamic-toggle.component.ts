import { Component, Input } from '@angular/core';
import { ToggleFormField } from './dynamic-toggle-field';

@Component({
  selector: 'app-dynamic-toggle',
  template: `
    <div
      class="dynamic-control d-flex align-items-center"
      [class]="field.classList + (' label-' + field.labelPositioning)"
      *transloco="let t"
    >
      <mat-slide-toggle
        *ngIf="field.style === 'slide'"
        (change)="field.onChange && field.onChange($event)"
        [formControl]="field.control"
        [id]="field.id"
        [attr.data-cy]="key"
        color="primary"
      >
        {{ t(field.label) }}
      </mat-slide-toggle>

      <mat-checkbox
        *ngIf="field.style === 'checkbox'"
        (change)="field.onChange && field.onChange($event)"
        [formControl]="field.control"
        [id]="field.id"
        [attr.data-cy]="key"
        color="primary"
      >
        {{ t(field.label) }}
      </mat-checkbox>
    </div>
  `,
  styleUrls: []
})
export class DynamicToggleComponent {
  @Input() field!: ToggleFormField;

  @Input() key!: string;
}
