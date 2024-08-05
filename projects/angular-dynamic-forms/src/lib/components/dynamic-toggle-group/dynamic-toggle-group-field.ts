import { Optional } from 'src/app/utils/types';
import {
  DynamicFormControl,
  DynamicFormControlConstructor
} from '../../models/dynamic-form-control';
import { SelectOption } from '../../models/fields/selects/select-option';

/** A group of fields that let the user choose for only one options.
 *
 * Multiple selection inside a group is not supported by the moment. For that, you can use multiple `ToggleFormField` components or a multiple `selectFormField` instead of this component. */
export class ToggleGroupFormField<T> extends DynamicFormControl<T> {
  readonly type = 'toggle-group';

  options: SelectOption<T>[];

  /** Style of the field
   *
   * @default "button-toggle"
   */
  readonly style: 'radio' | 'button-toggle';

  /** Whether the options of this group should be displayed vertically or not
   *
   * @default false
   */
  readonly vertical: boolean;

  constructor(
    data: Optional<
      Pick<ToggleGroupFormField<T>, 'options' | 'style' | 'vertical'>,
      'style' | 'vertical'
    > &
      DynamicFormControlConstructor<T>
  ) {
    super(data);

    this.options = data.options;
    this.style = data.style ?? 'button-toggle';
    this.vertical = data.vertical ?? false;
  }

  clone() {
    return new ToggleGroupFormField({
      ...super.objectToBeCloned(),
      style: this.style,
      options: this.options,
      vertical: this.vertical
    });
  }
}
