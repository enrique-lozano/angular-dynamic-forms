import { normaliseValue } from 'src/app/utils/input.utils';
import {
  DynamicFormFieldWithInput,
  DynamicFormFieldWithInputConstructor,
  InputValueType
} from '../../models/dynamic-form-field-with-input';
import { MatInputType } from '../../models/mat-input-type';

export type InputFormFieldConstructorParams<TInputType extends MatInputType> =
  Pick<
    InputFormField<TInputType>,
    'suffixIconOrButton' | 'maskOptions' | 'min' | 'max'
  > &
    DynamicFormFieldWithInputConstructor<TInputType>;

export class InputFormField<
  TInputType extends MatInputType
> extends DynamicFormFieldWithInput<TInputType> {
  readonly type = 'input';

  /** In time inputs, the minimum selectable value. Usually, this should be accompanied by the `minTimeValidator` */
  min?: TInputType extends 'time' ? string : never;

  /** In time inputs, the maximum selectable value. Usually, this should be accompanied by the `maxTimeValidator` */
  max?: TInputType extends 'time' ? string : never;

  override get value() {
    // * To fix https://github.com/angular/angular/issues/13243 we should override the value attribute
    return (
      this.control.value == ''
        ? undefined
        : this.inputType == 'number' && this.control.value != undefined
        ? Number(this.control.value)
        : this.control.value
    ) as InputValueType<TInputType> | undefined;
  }

  override set value(newValue: InputValueType<TInputType> | undefined) {
    this.control.setValue(newValue);
  }

  constructor(data: InputFormFieldConstructorParams<TInputType>) {
    super(data);

    this.max = data.max;
    this.min = data.min;
  }

  static newTextInput(
    data: Omit<InputFormFieldConstructorParams<'text'>, 'inputType'>
  ) {
    return new InputFormField({
      ...data,
      inputType: 'text',
      onBlur: (event, field) => {
        normaliseValue(event, field);
      }
    });
  }

  clone() {
    return new InputFormField({
      ...super.objectToBeCloned(),
      max: this.max,
      min: this.min
    });
  }
}
