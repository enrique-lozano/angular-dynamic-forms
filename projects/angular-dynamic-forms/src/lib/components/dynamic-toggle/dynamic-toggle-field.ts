import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {
  DynamicFormControl,
  DynamicFormControlConstructor
} from '../../models/dynamic-form-control';
import { SelectFormField } from '../dynamic-select-form-field/dynamic-select-field';

/** A field that let you choose only between two options, true or false */
export class ToggleFormField extends DynamicFormControl<boolean> {
  readonly type = 'toggle';

  /** Style of the field
   *
   * @default "slide"
   */
  readonly style: 'checkbox' | 'slide';

  /** Label position compared to its toggle. Defaults to `right` in a checkbox and to `top` in a slide */
  labelPositioning: 'left' | 'right' | 'top' | 'bottom';

  onChange?: (
    ev: MatSlideToggleChange | MatCheckboxChange
  ) => void | Promise<void>;

  private constructor(
    data: DynamicFormControlConstructor<boolean> &
      Partial<Pick<ToggleFormField, 'style' | 'labelPositioning' | 'onChange'>>
  ) {
    super(data);

    this.style = data.style ?? 'slide';
    this.labelPositioning =
      data.labelPositioning ?? (this.style == 'checkbox' ? 'right' : 'top');

    this.onChange = data.onChange;
  }

  static newCheckbox(
    data: DynamicFormControlConstructor<boolean> &
      Partial<Pick<ToggleFormField, 'labelPositioning' | 'onChange'>>
  ) {
    return new ToggleFormField({ ...data, style: 'checkbox' });
  }

  static newSlideToggle(
    data: DynamicFormControlConstructor<boolean> &
      Partial<Pick<ToggleFormField, 'labelPositioning' | 'onChange'>>
  ) {
    return new ToggleFormField({ ...data, style: 'slide' });
  }

  static fromBooleanSelect(
    selectFormField: SelectFormField<boolean | undefined, false>,
    data?: Partial<
      Pick<ToggleFormField, 'style' | 'labelPositioning' | 'onChange'>
    >
  ) {
    return new ToggleFormField({
      label: selectFormField.label,
      hostClass: selectFormField.hostClass,
      disabled: selectFormField.control.disabled,
      initialValue: selectFormField.value ?? false,
      validators: selectFormField.control.validator,
      onChange: data?.onChange
        ? data.onChange
        : (ev) => {
            if (selectFormField.onSelectionChanged)
              selectFormField.onSelectionChanged(ev.checked, selectFormField);
          },
      style: data?.style,
      labelPositioning: data?.labelPositioning
    });
  }

  clone() {
    return new ToggleFormField({
      ...super.objectToBeCloned(),
      labelPositioning: this.labelPositioning,
      style: this.style,
      onChange: this.onChange
    });
  }
}
