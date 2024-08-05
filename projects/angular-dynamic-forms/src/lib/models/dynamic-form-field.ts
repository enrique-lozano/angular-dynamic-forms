import {
  FloatLabelType,
  MatFormFieldAppearance
} from '@angular/material/form-field';
import { IconOrButtonIcon } from '../components/dynamic-icon-or-button-icon/dynamic-icon-or-button-icon.component';
import {
  DynamicFormControl,
  DynamicFormControlConstructor
} from './dynamic-form-control';
import { DynamicMatHint } from './dynamic-mat-hint';

export type DynamicFormFieldConstructor<T> = Partial<
  Pick<
    DynamicFormField<T>,
    | 'floatLabel'
    | 'appearance'
    | 'startMatHint'
    | 'endMatHint'
    | 'suffixIconOrButton'
    | 'prefix'
  >
> &
  DynamicFormControlConstructor<T>;

/** A dynamic `mat-form-field`, with a `DynamicControl` inside */
export class DynamicFormField<T> extends DynamicFormControl<T> {
  /** Whether the label should always float or float as the user types.
   *
   * @default
   * "auto"
   */
  floatLabel: FloatLabelType;

  /** The appearance of the `mat-form-field`. For more info see: https://material.angular.io/components/form-field/overview#form-field-appearance-variants
   *
   * @default
   * "fill"
   */
  appearance: MatFormFieldAppearance;

  /** Hint text to be shown underneath the form field control, at the start of the line. */
  startMatHint?: DynamicMatHint<'start'>;

  /** Hint text to be shown underneath the form field control, at the end of the line. */
  endMatHint?: DynamicMatHint<'end'>;

  prefix?: boolean;

  suffixIconOrButton?:
    | ((field: DynamicFormField<T>) => IconOrButtonIcon)
    | null;

  constructor(obj: DynamicFormFieldConstructor<T>) {
    super(obj);

    this.floatLabel = obj.floatLabel ?? 'auto';
    this.appearance = obj.appearance ?? 'fill';

    this.startMatHint = obj.startMatHint;
    this.endMatHint = obj.endMatHint;

    this.prefix = obj.prefix;

    this.suffixIconOrButton = obj.suffixIconOrButton;
  }

  protected override objectToBeCloned(
    override?: Partial<DynamicFormFieldConstructor<T>>
  ): DynamicFormFieldConstructor<T> {
    return {
      ...super.objectToBeCloned(override),
      startMatHint: this.startMatHint,
      endMatHint: this.endMatHint,
      floatLabel: this.floatLabel,
      appearance: this.appearance,
      suffixIconOrButton: this.suffixIconOrButton,
      ...override
    };
  }
}
