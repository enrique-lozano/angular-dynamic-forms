import { FormControl, FormControlOptions, ValidatorFn } from '@angular/forms';
import { Optional } from 'src/app/utils/types';

export type DynamicFormControlConstructor<T> = {
  /** Set to `true` when you want the field disabled at the creation of it */
  disabled?: boolean;

  /** Validator(s) for the control */
  validators?:
    | FormControlOptions
    | ValidatorFn
    | ValidatorFn[]
    | null
    | undefined;
} & Optional<
  Pick<
    DynamicFormControl<T>,
    'label' | 'classList' | 'hostClass' | 'initialValue' | 'id'
  >,
  'classList' | 'initialValue' | 'id' | 'hostClass'
>;

/** A common structure that extends the basic angular control, adding more attributes to it like `label`, `classList`... */
export abstract class DynamicFormControl<T> {
  /** Text label of the form field. Should be an i18n key to be translated  */
  label: string;

  /** Control to bind to the HTML.
   *
   * It's important to try to not call the method of this control if there is a good replacement in the dynamicField. For example, it is recommended to use `this.value instead` of `this.control.value` */
  control: FormControl<T | undefined>;

  /** Class list of the mat-form-field String list separated by a space */
  classList: string;

  /** Utility attribute to apply classes to the host of the component.
   *
   * **WARNING:** This attribute will have no effect outside our dynamic form groups components.
   * So if you use a control separately in the `HTML`, you have to make:
   *
   * ```
   *  <app-dynamic-text-area
   *      [field]="myField"
   *      [key]="'myFieldID'"
   *      [class]="myField.hostClass">
   *  </app-dynamic-text-area>
   * ```
   */
  hostClass: string;

  /** The `id` that the tag that is using the control will have. Will default to a random string starting always
   * by `dynamic-form-control-` (i.e. `dynamic-form-control-jdh6ds83zxd3bn...`)
   *
   * Note that the ID should be unique in all the document
   */
  id: string;

  /** The value that will take the form field when created */
  initialValue?: T;

  constructor(data: DynamicFormControlConstructor<T>) {
    this.label = data.label;

    this.initialValue = data.initialValue;

    this.id =
      data.id ??
      'dynamic-form-control-' + Math.random().toString(36).substring(2, 9);

    this.control = new FormControl(
      { value: data.initialValue, disabled: data.disabled ?? false },
      data.validators
    ) as FormControl<T | undefined>;

    this.hostClass = data.hostClass ?? '';
    this.classList = data.classList ?? '';
  }

  /** Get the current value of this form field */
  get value() {
    return this.control.value;
  }

  /** Set a new value for this form field */
  set value(newValue: T | undefined) {
    this.control.setValue(newValue);
  }

  protected objectToBeCloned(
    override?: Partial<DynamicFormControlConstructor<T>>
  ): DynamicFormControlConstructor<T> {
    return {
      label: this.label,
      id: this.id,
      hostClass: this.hostClass,
      disabled: this.control.disabled,
      initialValue: this.control.value,
      validators: this.control.validator,
      ...override
    };
  }

  /** Set the value of the field back to its original state. Mark the control as `untouched` and `pristine` and update its validity  */
  reset() {
    this.value = this.initialValue;

    this.control.markAsUntouched();
    this.control.markAsPristine();
    this.control.updateValueAndValidity();
  }

  get valueChangesObs() {
    return this.control.valueChanges;
  }

  enableOrDisableIf(
    enable: boolean,
    opt?: {
      resetOnDisabled?: boolean;
      onlySelf?: boolean | undefined;
      emitEvent?: boolean | undefined;
    }
  ) {
    if (enable) {
      this.control.enable({
        onlySelf: opt?.onlySelf,
        emitEvent: opt?.emitEvent
      });

      return;
    }

    if (opt?.resetOnDisabled !== false) this.reset();

    this.control.disable({
      onlySelf: opt?.onlySelf,
      emitEvent: opt?.emitEvent
    });
  }
}
