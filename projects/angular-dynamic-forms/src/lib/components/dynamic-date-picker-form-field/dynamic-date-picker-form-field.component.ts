import { Component, Input } from '@angular/core';
import { DateFormField } from './dynamic-date-fields';

@Component({
  selector: 'app-dynamic-date-picker-form-field',
  template: `
    <mat-form-field
      class="dynamic-control dynamic-date-input"
      [class]="field.classList"
      [appearance]="field.appearance"
      [floatLabel]="field.floatLabel"
      *transloco="let t"
    >
      <mat-label>
        {{ t(field.label) }}
      </mat-label>

      <input
        matInput
        *ngIf="!field.maskOptions"
        [id]="field.id"
        [type]="field.inputType"
        [min]="field.minDate ?? null"
        [max]="field.maxDate ?? null"
        [formControl]="field.control"
        [attr.data-cy]="key"
        [matDatepicker]="picker"
        [readonly]="field.readOnly"
        [placeholder]="field.helperText ? t(field.helperText) : ''"
        (blur)="field.onBlur && field.onBlur($event, field)"
        (focus)="picker.open(); field.onFocus && field.onFocus($event, field)"
      />

      <input
        matInput
        *ngIf="field.maskOptions"
        [maskito]="field.maskOptions"
        [id]="field.id"
        [type]="field.inputType"
        [min]="field.minDate ?? null"
        [max]="field.maxDate ?? null"
        [formControl]="field.control"
        [attr.data-cy]="key"
        [matDatepicker]="picker"
        [readonly]="field.readOnly"
        [placeholder]="field.helperText ? t(field.helperText) : ''"
        (blur)="field.onBlur && field.onBlur($event, field)"
        (focus)="picker.open(); field.onFocus && field.onFocus($event, field)"
      />

      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>

      <mat-error>
        <app-field-error-display
          [control]="field.control"
        ></app-field-error-display>
      </mat-error>

      <div matSuffix *ngIf="field.suffixIconOrButton">
        <app-dynamic-icon-or-button-icon
          [buttonIcon]="field.suffixIconOrButton($any(field))"
          [dataCySelector]="key"
          [disabled]="field.control.disabled"
        >
        </app-dynamic-icon-or-button-icon>
      </div>

      <mat-hint
        *ngIf="field.startMatHint && field.startMatHint.innerHTML"
        [innerHTML]="field.startMatHint.innerHTML"
        align="start"
        [classList]="field.startMatHint.classList"
      >
      </mat-hint>
      <mat-hint
        *ngIf="field.endMatHint && field.endMatHint.innerHTML"
        [innerHTML]="field.endMatHint.innerHTML"
        align="end"
        [classList]="field.endMatHint.classList"
      >
      </mat-hint>
    </mat-form-field>
  `,
  styleUrls: []
})
export class DynamicDatePickerFormFieldComponent {
  @Input() field!: DateFormField;

  @Input() key!: string;
}
