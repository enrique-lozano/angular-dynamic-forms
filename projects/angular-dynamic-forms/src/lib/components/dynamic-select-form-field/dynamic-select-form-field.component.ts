import { Component, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AnyDynamicFormControl } from '../../models/any-dynamic-form-control';
import { DynamicFormGroup } from '../../models/dynamic-form-group';
import { SelectOption } from '../../models/fields/selects/select-option';
import { DynamicAutocompleteFormField } from '../dynamic-autocomplete-form-field/dynamic-autocomplete-field';
import { SelectFormField } from './dynamic-select-field';

export class ComponentWithOptions<T> {
  getMatOptionClasses(
    field: AnyDynamicFormControl<T>,
    option: SelectOption<T>
  ): Record<string, boolean> | '' {
    if (
      !(field instanceof DynamicAutocompleteFormField) &&
      !(field instanceof SelectFormField)
    )
      return '';

    if (!field.optionsClasses && !option.classes) return '';

    const optionDynamicClasses =
      (field.optionsClasses && field.optionsClasses(option.value)) ?? {};

    return { ...optionDynamicClasses, ...(option.classes ?? {}) };
  }
}

@Component({
  selector: 'app-dynamic-select-form-field',
  template: `
    <mat-form-field
      class="dynamic-control dynamic-select"
      [class]="field.classList"
      [appearance]="field.appearance"
      [floatLabel]="field.floatLabel"
      *transloco="let t"
    >
      <mat-label>
        {{ t(field.label) }}
      </mat-label>

      <mat-select
        [id]="field.id"
        [placeholder]="field.helperText ? t(field.helperText) : ''"
        [formControl]="field.control"
        #selectField
        [multiple]="field.isMultiple"
        [attr.data-cy]="key"
        (selectionChange)="
          field.onSelectionChanged &&
            field.onSelectionChanged(
              $any(field.value),
              $any(field),
              $any(group)
            )
        "
        (ngModelChange)="
          field.onValueChanged && field.onValueChanged($event, $any(field))
        "
        [compareWith]="field.compareWith"
      >
        <!---- Select all check ---->

        <mat-checkbox
          *ngIf="
            field.isMultiple &&
            !(
              field.loading ||
              field.options === null ||
              field.options === undefined
            )
          "
          class="select-all-mat-checkbox px-1 mat-mdc-option mdc-list-item mat-mdc-option-multiple"
          [checked]="
            field.control.value &&
            field.control.value.length > 0 &&
            field.control.value.length === field.options.length
          "
          [indeterminate]="
            field.control.value &&
            field.options &&
            field.control.value.length > 0 &&
            field.control.value.length < field.options.length
          "
          (click)="$event.stopPropagation()"
          (change)="toggleSelectAllOptions($event, field)"
        >
          {{ 'Seleccionar todo' }}
        </mat-checkbox>

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

        <!---- Options ---->

        <mat-option
          *ngFor="let option of field.options"
          [ngClass]="getMatOptionClasses(field, option)"
          [value]="option.value"
          [disabled]="option.disabled"
        >
          {{ option.displayName }}
        </mat-option>
      </mat-select>

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
export class DynamicSelectFormFieldComponent<
  T
> extends ComponentWithOptions<T> {
  @Input() field!: SelectFormField<T, true> | SelectFormField<T, false>;

  @Input() group?: DynamicFormGroup = undefined;

  @Input() key!: string;

  toggleSelectAllOptions(
    checkbox: MatCheckboxChange,
    field: SelectFormField<any, true>
  ) {
    if (checkbox.checked) {
      field.control.setValue(field.options?.map((e) => e.value));
    } else {
      field.control.setValue([]);
    }
  }
}
