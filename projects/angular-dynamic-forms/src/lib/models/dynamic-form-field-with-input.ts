import { MaskitoOptions } from '@maskito/core';
import { Optional } from 'src/app/utils/types';
import {
  DynamicFormField,
  DynamicFormFieldConstructor
} from './dynamic-form-field';
import { MatInputType } from './mat-input-type';

/** Type to determine the type of the control value of this input */
export type InputValueType<TInputType extends MatInputType> =
  TInputType extends 'number'
    ? number
    : TInputType extends 'time'
    ? `${number}:${number}`
    : string;

/* ---------------- */

export type DynamicFormFieldWithInputConstructor<
  TInputType extends MatInputType,
  FormControlType = InputValueType<TInputType>
> = Optional<
  Pick<
    DynamicFormFieldWithInput<TInputType, FormControlType>,
    | 'helperText'
    | 'readOnly'
    | 'inputType'
    | 'maskOptions'
    | 'onBlur'
    | 'onFocus'
  >,
  'readOnly'
> &
  DynamicFormFieldConstructor<FormControlType>;

/** A dynamic `mat-form-field`, with a `DynamicControl` and a `matInput` inside. According to the docs, only `input` and
 * `text-area` tags can have a the `matInput` directive
 */
export class DynamicFormFieldWithInput<
  TInputType extends MatInputType,
  FormControlType = InputValueType<TInputType>
> extends DynamicFormField<FormControlType> {
  /** Type of the `matInput` directive. Only a few of all the inputs types are avalaible by the moment.
   *
   * @see {@link https://material.angular.io/components/input/overview | Angular matInput types} All the allowed types of `matInput`
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types | MDN documentation} for more information on input types.
   */
  inputType: TInputType;

  /** Attribute for mask configuration. You can specify mask and use other functions like 'preprocessors' and 'postprocessors' */
  maskOptions?: MaskitoOptions;

  /** Placeholder/Helper-text to show when the input is focus */
  helperText?: string;

  /** If `true` the user can not type in this input, but it will be still have a enabled style.
   *
   * @default false
   */
  readOnly: boolean;

  /** Called when the input loose the focus */
  onBlur?: (
    ev: FocusEvent,
    field: DynamicFormFieldWithInput<TInputType, FormControlType>
  ) => void | Promise<void>;

  /** Called when the input get focused */
  onFocus?: (
    ev: FocusEvent,
    field: DynamicFormFieldWithInput<TInputType, FormControlType>
  ) => void | Promise<void>;

  constructor(
    obj: DynamicFormFieldWithInputConstructor<TInputType, FormControlType>
  ) {
    super(obj);

    this.inputType = obj.inputType;

    this.helperText = obj.helperText;
    this.readOnly = obj.readOnly ?? false;

    this.maskOptions = obj.maskOptions;

    this.onFocus = obj.onFocus;
    this.onBlur = obj.onBlur;
  }

  protected override objectToBeCloned(
    override?: Partial<
      DynamicFormFieldWithInputConstructor<TInputType, FormControlType>
    >
  ): DynamicFormFieldWithInputConstructor<TInputType, FormControlType> {
    return {
      ...super.objectToBeCloned(override),
      inputType: this.inputType,
      maskOptions: this.maskOptions,
      helperText: this.helperText,
      readOnly: this.readOnly,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      ...override
    };
  }
}
