import { Optional } from 'src/app/utils/types';
import { Except } from 'type-fest';
import { AnyDynamicFormControl } from '../../models/any-dynamic-form-control';
import {
  DynamicFormField,
  DynamicFormFieldConstructor
} from '../../models/dynamic-form-field';
import { DynamicFormFieldWithInput } from '../../models/dynamic-form-field-with-input';
import { DynamicFormGroup } from '../../models/dynamic-form-group';
import { SelectOptionsGenerator } from '../../models/fields/selects/convertToOptions';
import { SelectOption } from '../../models/fields/selects/select-option';
import { ToggleFormField } from '../dynamic-toggle/dynamic-toggle-field';

export type SelectAndAutocompleteCommonConstructor<
  T,
  TIsMultiple extends boolean
> = Partial<
  Pick<
    SelectAndAutocompleteCommon<T, TIsMultiple>,
    'loading' | 'helperText' | 'optionsClasses'
  >
> &
  DynamicFormFieldConstructor<TIsMultiple extends false ? T : T[]>;

export class SelectAndAutocompleteCommon<T, TIsMultiple extends boolean>
  extends DynamicFormField<TIsMultiple extends false ? T : T[]>
  implements Pick<DynamicFormFieldWithInput<'text'>, 'helperText'>
{
  /** __Please, do not modify this variable directly, use the `options` attribute (getter/setter) instead__ */
  _options?: SelectOption<T>[];

  /** True to display a loading indicator as a first option of the select (not selectable). Defaults to `false`
   *
   * The loading will still appear if the options attribute has not been initialized yet. Also, we will set
   * this attribute to `false` when options are setted */
  loading: boolean;

  helperText?: string;

  /** Apply classes to the select options based on his value */
  optionsClasses?: (value: T) => Record<string, boolean>;

  protected constructor(
    data: SelectAndAutocompleteCommonConstructor<T, TIsMultiple>
  ) {
    super(data);

    this.helperText = data.helperText;

    this.loading = data.loading ?? false;
    this.optionsClasses = data.optionsClasses;
  }

  set options(options: SelectOption<T>[] | undefined) {
    this._options = options;

    this.loading = false;
  }

  get options() {
    return this._options;
  }
}

type SelectOptionBuilder<T> =
  | SelectOption<T>[]
  | (() => Promise<SelectOption<T>[]>)
  | (() => SelectOption<T>[]);

type SelectCommonConstructor<
  T,
  TIsMultiple extends boolean
> = SelectAndAutocompleteCommonConstructor<T, TIsMultiple> &
  Optional<
    Pick<
      SelectFormField<T, TIsMultiple>,
      'onSelectionChanged' | 'onValueChanged' | 'compareWith' | 'optionsDef'
    >,
    'compareWith'
  >;

export class SelectFormField<
  T,
  TIsMultiple extends boolean
> extends SelectAndAutocompleteCommon<T, TIsMultiple> {
  readonly type = 'select';

  isMultiple: TIsMultiple;

  /** Function to trigger when the selected value has been changed by the user */
  onSelectionChanged?: (
    selectedOption: T,
    field: SelectFormField<T, TIsMultiple>,
    parent?: DynamicFormGroup<Record<string, AnyDynamicFormControl>>
  ) => void;

  /** Function to trigger when the value has been changed by the user or by the app */
  onValueChanged?: (value: T, field: SelectFormField<T, TIsMultiple>) => void;

  /** Function to compare the option values with the selected values. The first argument is a value from an option. The second is a value from the selection. A boolean should be returned.
   *
   * Defaults to a simple comparator: `((o1, o2) => o1 === o2)`. This is the recommended way of comparing simple data types, but NOT to compare objects
   */
  compareWith: (o1: T, o2: T) => boolean;

  /** The options definition for this field.
   *
   * You can specify a direct variable here or you can call a function to
   * return the options that you want to have. This function can be async,
   * and will be executed when the field is created (in its contructor)
   * or if we call `recalcOptions`, so you can trigger also other actions in this function.
   *
   * If this definition is `undefined`, no options will be shown for this field, that is,
   * the `options` attribute will be an empty array after its calculation
   *
   * __NOTE__: Be carefull when leaving this field to `undefined` or to `[]` in the field constructor
   * because you will most likely lose the automatic types for this field. If this is the case,
   * you may want to specify the types manually
   *  */
  optionsDef?: SelectOptionBuilder<T>;

  private constructor(
    data:
      | Pick<SelectFormField<T, TIsMultiple>, 'isMultiple'> &
          SelectCommonConstructor<T, TIsMultiple>,
    calcOptions = true
  ) {
    super(data);

    this.isMultiple = data.isMultiple;

    this.onSelectionChanged = data.onSelectionChanged;
    this.onValueChanged = data.onValueChanged;

    this.compareWith = data.compareWith ?? ((o1, o2) => o1 === o2);

    this.optionsDef = data.optionsDef;

    if (calcOptions) this.recalcOptions();
  }

  /** Set/recalc the options of this SelectFormField instance, based on the `optionsDef` attribute of this class */
  recalcOptions() {
    this.options = undefined;

    if (typeof this.optionsDef == 'function') {
      const f = this.optionsDef();

      if ('then' in f) {
        f.then((res) => {
          this.options = res;
        });
      } else {
        this.options = f;
      }
    } else {
      this.options = this.optionsDef || [];
    }
  }

  static newSingleSelect<T>(data: SelectCommonConstructor<T, false>) {
    return new SelectFormField({
      ...data,
      isMultiple: false,
      optionsClasses: (value: any) => ({
        invalid: value?.voided,
        ...(data.optionsClasses && data.optionsClasses(value))
      })
    });
  }

  static newMultiSelect<T>(data: SelectCommonConstructor<T, true>) {
    return new SelectFormField({
      ...data,
      isMultiple: true,
      optionsClasses: (value: any) => ({
        invalid: value?.voided,
        ...(data.optionsClasses && data.optionsClasses(value))
      })
    });
  }

  /** Convert a toggle field into a true/false selector */
  static fromToggleField(
    selectFormField: ToggleFormField,
    data?: Partial<
      Pick<
        SelectCommonConstructor<boolean | undefined, false>,
        'optionsClasses' | 'startMatHint' | 'endMatHint'
      >
    >,
    showResetOption = true
  ) {
    return this.newTrueOrFalseSelect(
      selectFormField.label,
      {
        hostClass: selectFormField.hostClass,
        disabled: selectFormField.control.disabled,
        initialValue: selectFormField.value,
        validators: selectFormField.control.validator,
        endMatHint: data?.endMatHint,
        startMatHint: data?.startMatHint,
        optionsClasses: data?.optionsClasses
      },
      showResetOption
    );
  }

  /** Create a select with yes/no options.
   *
   * By default, it will have classes that will make the field smaller and resposive. You will remove this classes if you specify the `classList` attribute  */
  static newTrueOrFalseSelect(
    label: string,
    data?: Except<
      SelectCommonConstructor<boolean | undefined, false>,
      'label' | 'loading' | 'compareWith' | 'optionsDef'
    >,
    showResetOption = true
  ) {
    return SelectFormField.newSingleSelect({
      ...data,
      label: label,
      hostClass: data?.hostClass ?? 'col-12 col-md-6 col-lg-4 col-xl-3',
      optionsDef: [
        ...(showResetOption ? [SelectOptionsGenerator.resetOptionField()] : []),
        new SelectOption({
          displayName: 'Sí',
          value: true
        }),
        new SelectOption({
          displayName: 'No',
          value: false
        })
      ]
    });
  }

  clone() {
    const toReturn = new SelectFormField(
      {
        ...super.objectToBeCloned(),
        optionsDef: this.optionsDef,
        isMultiple: this.isMultiple,
        helperText: this.helperText,
        loading: this.loading,
        optionsClasses: this.optionsClasses,
        onSelectionChanged: this.onSelectionChanged,
        onValueChanged: this.onValueChanged,
        compareWith: this.compareWith
      },
      false
    );

    toReturn.options = this.options;

    return toReturn;
  }
}
