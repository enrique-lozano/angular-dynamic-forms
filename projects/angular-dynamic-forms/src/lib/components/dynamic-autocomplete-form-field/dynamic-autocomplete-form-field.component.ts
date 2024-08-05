import { Component, Input } from '@angular/core';
import { ComponentWithOptions } from '../dynamic-select-form-field/dynamic-select-form-field.component';
import { DynamicAutocompleteFormField } from './dynamic-autocomplete-field';

@Component({
  selector: 'app-dynamic-autocomplete-form-field',
  template: `
    <mat-form-field
      #autocompleteField
      class="dynamic-control dynamic-autocomplete"
      [class]="field.classList"
      [appearance]="field.appearance"
      [floatLabel]="field.floatLabel"
      *transloco="let t"
    >
      <mat-label>
        {{ t(field.label) }}
      </mat-label>

      <input
        type="text"
        matInput
        *ngIf="!field.maskOptions"
        [id]="field.id"
        [placeholder]="field.helperText ? t(field.helperText) : ''"
        (input)="handleInput($event)"
        [formControl]="field.control"
        [readonly]="field.readOnly"
        [matAutocomplete]="autoGroup"
        [attr.data-cy]="key"
        (blur)="field.onBlur && field.onBlur($event, $any(field))"
        (focus)="field.onFocus && field.onFocus($event, $any(field))"
        (ngModelChange)="
          field.onValueChanged && field.onValueChanged($event, $any(field))
        "
      />
      <input
        type="text"
        matInput
        *ngIf="field.maskOptions"
        [maskito]="field.maskOptions"
        [id]="field.id"
        [placeholder]="field.helperText ? t(field.helperText) : ''"
        [formControl]="field.control"
        [readonly]="field.readOnly"
        [matAutocomplete]="autoGroup"
        [attr.data-cy]="key"
        (blur)="field.onBlur && field.onBlur($event, $any(field))"
        (focus)="field.onFocus && field.onFocus($event, $any(field))"
        (ngModelChange)="
          field.onValueChanged && field.onValueChanged($event, $any(field))
        "
      />

      <mat-autocomplete
        #autoGroup="matAutocomplete"
        [displayWith]="field.displayWith"
        (optionSelected)="
          field.onOptionSelected &&
            field.onOptionSelected($any(field.value), $any(field))
        "
        (closed)="field.onPanelClosed && field.onPanelClosed($any(field))"
        (opened)="field.onPanelOpened && field.onPanelOpened($any(field))"
        [requireSelection]="field.requireSelection"
      >
        <mat-option
          class="loading-bar"
          *ngIf="
            field.loading ||
            field.options === null ||
            field.options === undefined
          "
          disabled
        >
          <div class="w-100">
            <mat-progress-bar mode="indeterminate"></mat-progress-bar>
          </div>
        </mat-option>

        <mat-option
          *ngFor="let option of field.options"
          [ngClass]="getMatOptionClasses(field, option)"
          [value]="option.value"
          [disabled]="option.disabled"
          (click)="option.onClicked && option.onClicked()"
        >
          {{ option.displayName }}
        </mat-option>
      </mat-autocomplete>

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
export class DynamicAutocompleteFormFieldComponent<
  T
> extends ComponentWithOptions<T> {
  @Input() field!:
    | DynamicAutocompleteFormField<T, true>
    | DynamicAutocompleteFormField<T, false>;

  @Input() key!: string;

  handleInput(event) {
    if (event.target.value.length > 2) this.field.onInput(event);
  }
}
