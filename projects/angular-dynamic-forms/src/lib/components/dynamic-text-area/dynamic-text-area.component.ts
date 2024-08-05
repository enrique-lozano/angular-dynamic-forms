import { Component, Input } from '@angular/core';
import { TextAreaFormField } from './dynamic-text-area-field';

@Component({
  selector: 'app-dynamic-text-area',

  template: ` <mat-form-field
    class="dynamic-control dynamic-textarea"
    [class]="field.classList"
    [appearance]="field.appearance"
    [floatLabel]="field.floatLabel"
    *transloco="let t"
  >
    <mat-label>
      {{ t(field.label) }}
    </mat-label>

    <textarea
      *ngIf="!field.maskOptions"
      matInput
      [id]="field.id"
      [type]="field.inputType"
      [readonly]="field.readOnly"
      [placeholder]="field.helperText ? t(field.helperText) : ''"
      [rows]="field.rows"
      [formControl]="field.control"
      [attr.data-cy]="key"
      (blur)="field.onBlur && field.onBlur($event, field)"
      (focus)="field.onFocus && field.onFocus($event, field)"
    ></textarea>

    <textarea
      *ngIf="field.maskOptions"
      matInput
      [id]="field.id"
      [type]="field.inputType"
      [maskito]="field.maskOptions"
      [readonly]="field.readOnly"
      [placeholder]="field.helperText ? t(field.helperText) : ''"
      [rows]="field.rows"
      [formControl]="field.control"
      [attr.data-cy]="key"
      (blur)="field.onBlur && field.onBlur($event, field)"
      (focus)="field.onFocus && field.onFocus($event, field)"
    ></textarea>

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
  </mat-form-field>`,
  styles: [``]
})
export class DynamicTextAreaComponent {
  @Input() field!: TextAreaFormField;

  @Input() key!: string;
}
