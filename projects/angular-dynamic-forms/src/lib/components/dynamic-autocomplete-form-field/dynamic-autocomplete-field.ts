import { Optional } from 'src/app/utils/types';
import { Except, SetRequired } from 'type-fest';
import {
  DynamicFormFieldWithInput,
  DynamicFormFieldWithInputConstructor
} from '../../models/dynamic-form-field-with-input';
import { itemArrayOrEmpty } from '../../models/fields/selects/itemArrayOrEmpty';
import { SelectOption } from '../../models/fields/selects/select-option';
import { SelectAndAutocompleteCommon } from '../dynamic-select-form-field/dynamic-select-field';

type SelectOptionBuilder<T, RequireSelection extends boolean> =
  | SelectOption<T>[]
  | ((
      autocompleteValue: string | undefined,
      field: DynamicAutocompleteFormField<unknown, RequireSelection>
    ) => Promise<SelectOption<T>[]>)
  | ((
      autocompleteValue: string | undefined,
      field: DynamicAutocompleteFormField<unknown, RequireSelection>
    ) => SelectOption<T>[]);

/** Returns type `T` if selection are required and `T | string` otherwise */
type AutocompleteValueType<
  T,
  RequireSelection extends boolean
> = RequireSelection extends true ? T : T | string;

type DynamicAutocompleteFormFieldConstructor<
  T,
  RequireSelection extends boolean
> = Optional<
  Pick<
    DynamicAutocompleteFormField<T, RequireSelection>,
    | 'displayWith'
    | 'optionsDef'
    | 'onOptionSelected'
    | 'onValueChanged'
    | 'onPanelClosed'
    | 'onPanelOpened'
    | 'requireSelection'
    | 'optionsClasses'
    | 'loading'
  >,
  'displayWith' | 'loading'
> &
  Omit<
    DynamicFormFieldWithInputConstructor<
      'text',
      AutocompleteValueType<T, RequireSelection>
    >,
    'inputType'
  >;

export class DynamicAutocompleteFormField<T, RequireSelection extends boolean>
  extends DynamicFormFieldWithInput<
    'text',
    AutocompleteValueType<T, RequireSelection>
  >
  implements SelectAndAutocompleteCommon<any, false>
{
  readonly type = 'autocomplete';

  /** How to display the selected item of the list */
  displayWith: (
    selectedEl: AutocompleteValueType<T, RequireSelection>
  ) => string;

  requireSelection: RequireSelection;

  /** Function to trigger when a new option from the selection list is checked */
  onOptionSelected?: (
    selectedOption: T,
    field: DynamicAutocompleteFormField<T, RequireSelection>
  ) => void;

  /** Function to trigger when the value has been changed by the user or by the app */
  onValueChanged?: (
    value: T,
    field: DynamicAutocompleteFormField<T, RequireSelection>
  ) => void;

  /** Function to trigger when the autocomplete panel is closed */
  onPanelClosed?: (
    field: DynamicAutocompleteFormField<T, RequireSelection>
  ) => void;

  /** Function to trigger when the autocomplete panel is opened */
  onPanelOpened?: (
    field: DynamicAutocompleteFormField<T, RequireSelection>
  ) => void;

  /* --- Implemented from SelectAndAutocompleteCommon --- */

  optionsClasses?: (value: T) => Record<string, boolean>;
  loading: boolean;

  /* --- Options --- */

  page: number;

  /** The options definition for this field.
   *
   * You can specify a direct variable here or you can call a function to
   * return the options that you want to have. This function can be async,
   * and will be executed when the field is created (in its contructor)
   * or if we call `reinitializeOptions`, so you can trigger also other actions in this function.
   *
   * If this definition is `undefined`, no options will be shown for this field, that is,
   * the `options` attribute will be an empty array after its calculation.
   *
   * __NOTE__: Be carefull when leaving this field to `undefined` or to `[]` in the field constructor
   * because you will most likely lose the automatic types for this field. If this is the case,
   * you may want to specify the types manually
   *  */
  optionsDef?: SelectOptionBuilder<T, RequireSelection>;

  _options?: SelectOption<T>[];

  set options(options: SelectOption<T>[] | undefined) {
    this._options = options;
    this.loading = false;
  }

  get options() {
    return this._options;
  }

  onInput(event: Event) {
    if (!event.target) throw Error('Event target was not found');

    this.getOptionsFromDef(event.target['value']).then((res) => {
      this.options = res;
    });
  }

  /**
   * Calculate the array of options based on the `optionsDef` specified in
   * the field constructor. This function is called at the creation of the field
   * instance and when the user type in the autocomplete input
   *  */
  async getOptionsFromDef(value?: string) {
    // this.options = undefined;

    if (typeof this.optionsDef == 'function') {
      const f = this.optionsDef(
        value,
        this as DynamicAutocompleteFormField<unknown, RequireSelection>
      );

      return f;
    } else {
      return this.optionsDef || [];
    }
  }

  /** Initialize or re-initialize the options to their initial value (i.e. parting of the `optionsDef`) */
  reinitializeOptions(params?: { onSuccess?: () => void }) {
    this.getOptionsFromDef().then((res) => {
      this.options = res;

      if (params?.onSuccess) params.onSuccess();
    });
  }

  constructor(
    data: DynamicAutocompleteFormFieldConstructor<T, RequireSelection>,
    calcOptions = true
  ) {
    super({ ...data, inputType: 'text' });

    this.page = 0;

    this.loading = data.loading ?? false;

    this.displayWith =
      data.displayWith ??
      ((selectedEl) => {
        if (typeof selectedEl == 'string' || typeof selectedEl == 'undefined')
          return selectedEl as string;
        else return '{Object}';
      });

    this.onOptionSelected = data.onOptionSelected;

    this.onValueChanged = data.onValueChanged;

    // TODO: Require selection will not work until update Angular:
    // See -> https://github.com/angular/components/issues/28113

    this.requireSelection = data.requireSelection;

    this.optionsClasses = (value: any) => ({
      invalid: value?.voided,
      ...(data.optionsClasses && data.optionsClasses(value))
    });
    this.onPanelClosed = data.onPanelClosed;
    this.onPanelOpened = data.onPanelOpened;

    this.optionsDef = data.optionsDef;
    if (calcOptions) this.reinitializeOptions();
  }

  static newFieldWithSuffixSelector<T>(
    data: SetRequired<
      Except<
        DynamicAutocompleteFormFieldConstructor<T, true>,
        'optionsDef' | 'readOnly' | 'requireSelection'
      >,
      'suffixIconOrButton'
    >
  ) {
    return new DynamicAutocompleteFormField({
      helperText: 'Pulsa el botón de la derecha para seleccionar',
      requireSelection: true,
      optionsDef: [],
      readOnly: true,
      ...data
    });
  }

  /**
   * Adds options to the existing options array.
   *
   * @param toAdd An array of `SelectOption` instances to be added.
   */
  addOptions(toAdd: SelectOption<T>[]) {
    if (!this.options) this.options = toAdd;

    this.options = [...this.options, ...toAdd];
  }

  /**
   * Pops the last option (if any), and adds new options to the existing options array.
   * Optionally moves the popped item to the end of the array.
   *
   * @param toAdd An array of `SelectOption` instances to be added.
   * @param movePoppedItemToTheEnd If `true`, moves the popped item to the end. Defaults to `false`
   */
  popAndAddOptions(toAdd: SelectOption<T>[], movePoppedItemToTheEnd = false) {
    if (!this.options || this.options.length === 0) this.options = toAdd;

    this.options = [
      ...this.options.slice(0, -1),
      ...toAdd,
      ...itemArrayOrEmpty(this.options.at(-1)!, movePoppedItemToTheEnd)
    ];
  }

  buildShowLoadMoreButtonIf(condition: boolean, searchValue?: string) {
    return itemArrayOrEmpty(
      SelectOption.showLoadMoreButton(async () => {
        // Get scroll position to not loose the scroll position after (only if the options attribute is reassigned)
        const optionList = document.getElementsByClassName(
          'mat-mdc-autocomplete-panel'
        )[0] as HTMLDivElement;
        const currentScroll = optionList.scrollTop;

        this.page += 1;

        /* --- Recalculate the options --- */

        // Implementation if you are resetting all the options (usually increasing the size of the result)
        this.options = await this.getOptionsFromDef(searchValue);
        // Implementation if you are appending the options (usually increasing the page to return)
        // -> this.popAndAddOptions(await this.getOptionsFromDef(value));

        // Reset scroll position (only if the options attribute is reassigned):
        await new Promise((r) => setTimeout(r, 1));
        document
          .getElementsByClassName('mat-mdc-autocomplete-panel')[0]
          .scrollTo({ top: currentScroll });
      }),
      condition
    );
  }

  clone() {
    const toReturn = new DynamicAutocompleteFormField(
      {
        ...super.objectToBeCloned(),
        optionsDef: this.optionsDef,
        optionsClasses: this.optionsClasses,
        requireSelection: this.requireSelection,
        helperText: this.helperText,
        onPanelClosed: this.onPanelClosed,
        onPanelOpened: this.onPanelOpened,
        onOptionSelected: this.onOptionSelected,
        onValueChanged: this.onValueChanged,
        displayWith: this.displayWith
      },
      false
    );

    toReturn.options = this.options;

    return toReturn;
  }
}
