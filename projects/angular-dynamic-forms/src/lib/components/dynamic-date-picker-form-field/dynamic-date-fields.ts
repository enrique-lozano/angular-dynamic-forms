import {
  DynamicFormFieldWithInput,
  DynamicFormFieldWithInputConstructor
} from '../../models/dynamic-form-field-with-input';
import { newDateOrUndefined } from './dateOrUndefined';

export class DateFormField extends DynamicFormFieldWithInput<'text', Date> {
  readonly type = 'date';

  /** Minimum date that the user can pick in the date-picker. Defaults to: current_year - 140 */
  minDate?: Date;

  /** Maximum date that the user can pick in the date-picker. By default it will be the current date */
  maxDate?: Date;

  _initialMinDate?: Date;
  _initialMaxDate?: Date;

  constructor(
    data: Partial<Pick<DateFormField, 'maxDate' | 'minDate'>> &
      Omit<DynamicFormFieldWithInputConstructor<'text', Date>, 'inputType'>
  ) {
    super({ ...data, inputType: 'text' });

    this.maxDate = data.maxDate ?? new Date();
    this.minDate = data.minDate ?? new Date(new Date().getFullYear() - 140, 0);

    this._initialMaxDate = this.maxDate;
    this._initialMinDate = this.minDate;
  }

  clone() {
    return new DateFormField({
      ...super.objectToBeCloned(),
      maxDate: this.maxDate,
      minDate: this.minDate
    });
  }

  override reset(): void {
    this.maxDate = this._initialMaxDate;
    this.minDate = this._initialMinDate;

    super.reset();
  }

  /** Set a new date value to the control from any variable type (string, number or date) */
  setValueFromAttr(newValue?: string | Date | number) {
    this.value = newDateOrUndefined(newValue);
  }
}
