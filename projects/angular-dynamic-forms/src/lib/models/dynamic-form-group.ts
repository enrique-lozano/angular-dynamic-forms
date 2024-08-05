import {
  AbstractControlOptions,
  AsyncValidatorFn,
  FormGroup,
  ValidatorFn
} from '@angular/forms';
import { Subject } from 'rxjs';
import { ReadonlyDeep } from 'type-fest';
import { DateFormField } from '../components/dynamic-date-picker-form-field/dynamic-date-fields';
import { AnyDynamicFormControl } from './any-dynamic-form-control';
import { DynamicFormControl } from './dynamic-form-control';

type FormFieldValueType<T extends AnyDynamicFormControl> =
  T['value'] extends infer R ? R : never;

/* --------

To extend the angular FormGroup:

  extends FormGroup<{
    [key in keyof T]: FormControl<FormFieldValueType<T[key]>>;
  }>

---------- */

export class DynamicFormGroup<
  T extends Record<string, AnyDynamicFormControl> = any
> {
  fields: T;

  layout?: Partial<Record<keyof T, string>>;

  numberOfControlChanged: Subject<void>;

  /** Emitted each time one of the form changes */
  readonly formChanged: Subject<void>;

  /** Global validator for all the dynamic form group. The group will be valid if all the controls are valid and this function returns a null (or it's undefined) */
  validator?: (fields: T) => string | null;

  constructor(
    fields: T,
    validator?: (fields: T) => string | null
    /* layout?: Partial<Record<keyof T, string>> */
  ) {
    this.numberOfControlChanged = new Subject();
    this.formChanged = new Subject();

    this.fields = {} as T;
    // this.layout = layout;

    this.validator = validator;

    Object.keys(fields).forEach((formControlName) => {
      this.addControl(formControlName, fields[formControlName]);
    });
  }

  generateFormGroup(
    validatorOrOpts?:
      | ValidatorFn
      | ValidatorFn[]
      | AbstractControlOptions
      | null
      | undefined,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null | undefined
  ) {
    //TODO: Get from current validators
    return new FormGroup(
      this.allFieldsArray.map((x) => x[1].control),
      validatorOrOpts,
      asyncValidator
    );
  }

  patchValue(newValues: Partial<{ [K in keyof T]: FormFieldValueType<T[K]> }>) {
    Object.keys(newValues).forEach((key) => {
      if (this.fields[key]) this.fields[key].value = newValues[key];
    });
  }

  /** Returns an object that represent the current state/value of all the fields in the form */
  get formValue(): { [K in keyof T]: FormFieldValueType<T[K]> } {
    const toReturn: { [K in keyof T]: FormFieldValueType<T[K]> } = {} as any;

    this.allFieldsKeys.forEach(
      (key) => (toReturn[key] = this.fields[key].value)
    );

    return toReturn;
  }

  /** Gets a value on a field. This is an alias of `fields[fieldId].value` */
  getFieldValue<K extends keyof T>(
    fieldId: K
  ): T[K] extends AnyDynamicFormControl
    ? ReadonlyDeep<FormFieldValueType<T[K]>>
    : never {
    return this.fields[fieldId].value;
  }

  /** Sets a value on a field. This is an alias of `fields[fieldId].value = newValue` */
  setFieldValue<K extends keyof T>(
    fieldId: K,
    newValue: T[K] extends AnyDynamicFormControl
      ? FormFieldValueType<T[K]>
      : never
  ) {
    if (this.fields[fieldId] instanceof DateFormField) {
      (this.fields[fieldId] as DateFormField).setValueFromAttr(newValue as any);

      return;
    }

    this.fields[fieldId].value = newValue;
  }

  /** Function to retrieve the current result of the global form groups validators, withou taken into
   * account the individual control validations. */
  get globalValidatorRes() {
    return this.validator ? this.validator(this.fields) : null;
  }

  /** Return true if one or more fields of the form is invalid or if the group validator is defined and returns an error */
  get isInvalid() {
    return (
      this.globalValidatorRes != null ||
      Object.keys(this.fields).some((key) => this.fields[key].control.invalid)
    );
  }

  /** Get if all the fields in the form are valid */
  get isValid() {
    return !this.isInvalid;
  }

  /** Return true if one or more fields has been touched */
  get isTouched() {
    return this.allFieldsKeys.some((key) => this.fields[key].control.touched);
  }

  /** Mark all the form fields in the structure as touched by the user */
  markAllAsTouched() {
    return Object.keys(this.fields).some((key) =>
      this.fields[key].control.markAllAsTouched()
    );
  }

  /** Mark all the form fields in the structure as untouched by the user */
  markAllAsUntouched() {
    return Object.keys(this.fields).some((key) =>
      this.fields[key].control.markAsUntouched()
    );
  }

  /** Iterable array with all the dynamic fields */
  get allFieldsArray() {
    return Object.entries(this.fields);
  }

  /** Return all the IDs/Keys of the fields in this form */
  get allFieldsKeys() {
    return Object.keys(this.fields) as (keyof T)[];
  }

  /** Remove a control by its ID */
  removeControl<K extends keyof T>(name: K) {
    delete this.fields[name];

    this.numberOfControlChanged.next();
  }

  /** Adds a control to the form group. No effect if the specified ID already exists */
  addControl<K>(id: string, field: AnyDynamicFormControl<K>) {
    if (!(field instanceof DynamicFormControl)) {
      throw new Error(
        'Each form field should be an instance of a dynamic form field'
      );
    }

    if (this.fields[id]) return;

    this.fields[id as keyof T] = field as T[keyof T];

    this.fields[id].control.valueChanges.subscribe(() => {
      this.formChanged.next();
    });

    this.numberOfControlChanged.next();
  }

  /** Disable a set of controls. The status of the form recalculates based on its value and its validators.
   *
   * @param controls The keys of the controls to disable. If not specified, it will disable all controls in the group
   * @param mode Specify the value of the form fields after the field is disabled. Defaults to `reset`, that reset the field to its initial value.
   * @param emitEvent When true, both the statusChanges and valueChanges observables emit events with the latest status and value when the control is disabled. When false or undefined, no events are emitted. Defaults to false
   */
  disableControls(
    controls?: (keyof T)[] | readonly (keyof T)[],
    mode: 'reset' | 'setUndefined' | 'keepValue' = 'reset',
    emitEvent = false
  ) {
    const keysToDisable = controls ?? this.allFieldsKeys;

    keysToDisable.forEach((key) => {
      if (mode == 'reset') this.fields[key].reset();
      else if (mode == 'setUndefined') this.fields[key].value = undefined;

      this.fields[key].control.disable({ emitEvent });
    });
  }

  /** Reset a set of controls
   *
   * @param controls The keys of the controls to disable. If not specified, it will reset all controls in the group
   */
  resetControls(controls?: (keyof T)[] | readonly (keyof T)[]) {
    const keysToDisable = controls ?? this.allFieldsKeys;

    keysToDisable.forEach((key) => {
      this.fields[key].reset();
    });
  }

  /** Enable/Disable a set of forms based on a value function. Will toggle between disabled and enabled when the value of the function change.
   *
   * @param onControl The control that toggles the behaviour
   * @param value Function to toggle the enabled/disabled when change. The function receives the form value when it changes as a param
   * @param controls Controls affected by the toggle
   * @param whenValue Action to trigger when the value of the function is `true`. By default it will enable the controls, so the controls will be disabled on `false`
   * @param mode Specify the value of the form fields after the field is disabled. Defaults to `reset`, that reset the field to its initial value.
   * @param emitEvent When true, both the statusChanges and valueChanges observables emit events with the latest status and value when the control is disabled. When false or undefined, no events are emitted. Defaults to false
   *
   * @returns A subscription that will listen to changes in the `onControl` field and make the required changes.
   */
  enableDisableOnValue<K extends keyof T>(
    onControl: K,
    value: T[K] extends AnyDynamicFormControl
      ? (value: FormFieldValueType<T[K]>) => boolean
      : never,
    controls?: (keyof T)[] | readonly (keyof T)[],
    whenValue: 'enable' | 'disable' = 'enable',
    disableMode: 'reset' | 'setUndefined' | 'keepValue' = 'reset',
    emitEvent = false
  ) {
    return this.fields[onControl].control.valueChanges.subscribe((res) => {
      if (value(res)) {
        if (whenValue == 'enable') this.enableControls(controls, emitEvent);
        else if (whenValue == 'disable')
          this.disableControls(controls, disableMode, emitEvent);
      } else {
        if (whenValue == 'disable') this.enableControls(controls, emitEvent);
        else if (whenValue == 'enable')
          this.disableControls(controls, disableMode, emitEvent);
      }
    });
  }

  /** Enable a set of controls. The status of the form recalculates based on its value and its validators.
   *
   * @param controls The keys of the controls to enable. If not specified, it will enable all controls in the group
   * @param emitEvent When true, both the statusChanges and valueChanges observables emit events with the latest status and value when the control is enabled. When false or undefined, no events are emitted. Defaults to false
   */
  enableControls(
    controls?: (keyof T)[] | readonly (keyof T)[],
    emitEvent = false
  ) {
    const keysToDisable = controls ?? this.allFieldsKeys;

    keysToDisable.forEach((key) =>
      this.fields[key].control.enable({ emitEvent })
    );
  }

  /** Add a synchronous validator or validators to a set of controls, without affecting other validators in other fields.
   *
   * @param validators The validator or validators to add to the fields controls
   * @param controls The keys of the controls to add the validator(s). If not specified, it will add the validator(s) all controls in the group
   * @param updateValueAndValidity If defined, update the value and the validity of the specified controls, using the specified params. Leave this param to `{}` to use the default angular params
   * */
  addValidatorsToControls(
    validators: ValidatorFn | ValidatorFn[],
    controls?: (keyof T)[] | readonly (keyof T)[],
    updateValueAndValidity:
      | {
          onlySelf?: boolean | undefined;
          emitEvent?: boolean | undefined;
        }
      | undefined = {}
  ) {
    const controlsToTrigger = controls ?? this.allFieldsKeys;

    controlsToTrigger.forEach((key) => {
      const field = this.fields[key];

      if (!field) return;

      field.control.addValidators(validators);

      if (updateValueAndValidity !== undefined)
        field.control.updateValueAndValidity(updateValueAndValidity);
    });
  }

  /** Remove a synchronous validator or validators to a set of controls, without affecting other validators in other fields.
   *
   * @param validators The validator or validators to remove to the fields controls
   * @param controls The keys of the controls to remove the validator(s). If not specified, it will remove the validator(s) all controls in the group
   * @param updateValueAndValidity If defined, update the value and the validity of the specified controls, using the specified params. Leave this param to `{}` to use the default angular params
   *  */
  removeValidatorsOfControls(
    validators: ValidatorFn | ValidatorFn[],
    controls?: (keyof T)[] | readonly (keyof T)[],
    updateValueAndValidity:
      | {
          onlySelf?: boolean | undefined;
          emitEvent?: boolean | undefined;
        }
      | undefined = {}
  ) {
    const controlsToTrigger = controls ?? this.allFieldsKeys;

    controlsToTrigger.forEach((key) => {
      const field = this.fields[key];

      if (!field) return;

      field.control.removeValidators(validators);

      if (updateValueAndValidity !== undefined)
        field.control.updateValueAndValidity(updateValueAndValidity);
    });
  }

  /** Creates a new instance of the dynamic form that is exactly the same as it was at the time this function was called. Unlike a normal assignment, when calling `clone()`, if you change the value of a form field this value will not change in the original form */
  clone(): DynamicFormGroup<T> {
    const formToReturn = new DynamicFormGroup(
      {} as T,
      this.validator
    ) as DynamicFormGroup<T>;

    this.allFieldsArray.forEach((field) => {
      formToReturn.addControl(field[0], field[1].clone());
    });

    return formToReturn as DynamicFormGroup<T>;
  }
}
