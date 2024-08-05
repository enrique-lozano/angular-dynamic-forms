import { Component, Input } from '@angular/core';
import { MatInputType } from '../../models/mat-input-type';
import { InputFormField } from './dynamic-input-field';

@Component({
  selector: 'app-dynamic-input',
  template: ` <mat-form-field
    class="dynamic-control dynamic-input"
    [class]="field.classList"
    [appearance]="field.appearance"
    [floatLabel]="field.floatLabel"
    *transloco="let t"
  >
    <mat-label>
      {{ t(field.label) }}
    </mat-label>

    <span *ngIf="field.prefix" matTextPrefix>+</span>

    <ng-container>
      <input
        *ngIf="field.maskOptions"
        [id]="field.id"
        [type]="field.inputType"
        matInput
        [maskito]="field.maskOptions"
        [formControl]="field.control"
        [readonly]="field.readOnly"
        [placeholder]="field.helperText ? t(field.helperText) : ''"
        [attr.data-cy]="key"
        [min]="field.min"
        [max]="field.max"
        (blur)="field.onBlur && field.onBlur($event, field)"
        (focus)="field.onFocus && field.onFocus($event, field)"
      />

      <input
        *ngIf="!field.maskOptions"
        [id]="field.id"
        [type]="field.inputType"
        matInput
        [formControl]="field.control"
        [readonly]="field.readOnly"
        [placeholder]="field.helperText ? t(field.helperText) : ''"
        [attr.data-cy]="key"
        [min]="field.min"
        [max]="field.max"
        (blur)="field.onBlur && field.onBlur($event, field)"
        (focus)="field.onFocus && field.onFocus($event, field)"
      />
    </ng-container>

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
  styles: []
})
export class DynamicInputComponent<TInputType extends MatInputType> {
  @Input() field!: InputFormField<TInputType>;

  @Input() key!: string;
}
