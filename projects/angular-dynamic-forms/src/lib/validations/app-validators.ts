import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { AppInjector } from 'src/app/app.module';
import { ApiService } from 'src/app/core/services/api/api.service';

import { validateControlDigits } from 'src/app/utils/affiliationNumber';
import { ruleNIE, ruleNIF } from 'src/app/utils/nifNie';
import { AnyDynamicFormControl } from '../models/any-dynamic-form-control';
import { DynamicFormControl } from '../models/dynamic-form-control';

/** Class that wraps a list of callable custom validators for this app */
export class TSIValidators {
  static fieldsChangedValidatorMsgByLabel<
    T extends Record<string, AnyDynamicFormControl>
  >(fields: T, startMsg = 'Debes de modificar uno de los siguientes campos') {
    const t = AppInjector.get(TranslocoService);

    return `${t.translate(startMsg)}: ${Object.values(fields)
      .map((fieldData) => t.translate(fieldData.label))
      .join(', ')}`;
  }

  /** Returns an error text if none of the passed fields have changed their original value. Return `null` otherwise (no error) */
  static fieldsChangedValidator<
    T extends Record<string, AnyDynamicFormControl>
  >(fields: T, msg = 'Realiza una búsqueda por al menos un campo') {
    if (!Object.entries(fields).some((x) => x[1].value !== x[1].initialValue)) {
      return msg;
    }

    return null;
  }

  static equalsValidator<T>(baseField: DynamicFormControl<T>): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.touched && control.value == baseField.value) {
        return {
          equal: `The value of this field should match ${baseField.value}`
        };
      }

      return null;
    };
  }

  /** Set errors to the fields in the array that are no-equal to the specific value
   *
   * @param baseField The field that contains the value that you want to compare with the rest of the fields
   * @param fieldsToCompare The fields that should match with the baseField value
   */
  static validateEquals<T>(
    baseField: DynamicFormControl<T>,
    fieldsToCompare: DynamicFormControl<T>[]
  ) {
    if (fieldsToCompare.length == 0)
      throw new Error('The fields array can not be empty');

    fieldsToCompare.forEach((field) => {
      if (field.control.touched && field.value !== baseField.value) {
        // Add the error if the field is touched
        field.control.setErrors({
          ...(field.control.errors || {}),
          equal: `The value of this field should match ${baseField.value}`
        });
      } else if (field.control.hasError('equal')) {
        // No error for this validation. Remove the error if exists.

        delete field.control.errors!['equal'];
        if (
          field.control.errors &&
          Object.keys(field.control.errors).length == 0
        )
          field.control?.setErrors(null);
      }
    });

    return null;
  }

  static dniAvailableValidator(dniToExclude?: string): AsyncValidatorFn {
    return async (
      control: AbstractControl
    ): Promise<ValidationErrors | null> => {
      if (!control.value || control.pristine || control.value.length < 3) {
        return null;
      } else {
        const prof = await ApiService.getProfessionalByDni(control.value);

        if (prof && prof.data.dni != dniToExclude) {
          return { dniNotAvailable: true };
        }

        return null;
      }
    };
  }

  /** Like the `Validators.pattern` from Angular but with a custom error message
   *
   * @param pattern The regular expression pattern or string against which to validate the control's value.
   * @param message The custom error message to be displayed if the validation fails.
   * @param extraOpt Additional options for the validator function (optional).
   * @param extraOpt.inverseMatch If set to `true`, the validation will pass when the pattern does not match (optional).
   *
   * @example
   *
   * // Create a validator for email pattern with a custom error message
   * const emailPatternValidator = MyValidators.patternWithMessage(
   *   /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
   *   'Please enter a valid email address'
   * );
   *   */
  static patternWithMessage = (
    pattern: string | RegExp,
    message: string,
    extraOpt?: { inverseMatch?: boolean }
  ): ValidatorFn => {
    const delegateFn = Validators.pattern(pattern);

    return (control) => {
      const valRes = delegateFn(control);

      if (extraOpt?.inverseMatch === true) {
        if (new RegExp(pattern).test(control.value)) {
          return {
            pattern: {
              requiredPattern: pattern,
              actualValue: control.value
            },
            patternErrorMsg: message
          };
        }

        return null;
      }

      return valRes === null ? null : { ...valRes, patternErrorMsg: message };
    };
  };

  /** Return the result of the specified validator if the passed condition returns `true`, and return no error otherwise
   *
   * __NOTE__: Using this with `Validators.required` may not display the form field label asterisk when
   * the condition is `true` since Angular internally compare the instances to display it and the validators
   * function instances are not equal (`Validators.required != conditionalValidator`).
   *
   * To display this asterisk correctly, use `.addValidators` instead. You can use the `toggleValidators` function also
   */
  static conditionalValidator(
    condition: (control?: AbstractControl) => boolean,
    validator: ValidatorFn
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (condition(control) === true) {
        return validator(control);
      }

      return null;
    };
  }

  /**
   * Validator that adds other specific validators to the control if a condition is
   * `true` and remove this validators from it otherwise
   *
   * This validator does not make any other validation and will return always no error, so it is
   * not a validator by itself. Is only in charge of adding/removing other validators
   * */
  static toggleValidator(
    addValidatorsIf: (control?: AbstractControl) => boolean,
    validators: ValidatorFn[] | ValidatorFn
  ): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (addValidatorsIf(control) === true) {
        control.addValidators(validators);

        return null;
      }

      control.removeValidators(validators);

      return null;
    };
  }

  /** Check that the value of the control (usually a time input) is after a specific time */
  static minTimeValidator(minTime?: `${number}:${number}`): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlValue = control.value;

      if (!controlValue || control.pristine || !minTime) {
        return null;
      }

      if (controlValue < minTime) {
        return { minTime };
      }

      return null;
    };
  }

  /** Check that the value of the control (usually a time input) is before a specific time */
  static maxTimeValidator(maxTime?: `${number}:${number}`): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const controlValue = control.value;

      if (!controlValue || control.pristine || !maxTime) {
        return null;
      }

      if (controlValue > maxTime) {
        return { maxTime };
      }

      return null;
    };
  }

  /**
   * Checks if a control value meets with the requirements specified in the back-end.
   * Only pattern criteria will be taken into account here,
   * leaving aside others such as maximum and minimum length.
   * */
  static passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let returnValue: ValidationErrors | null = null;

      let regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z]).{1,}$');
      if (!regex.test(control.value)) {
        returnValue = {
          ...(returnValue || {}),
          requireUpperAndLowerCase: true
        };
      }

      regex = new RegExp('^(?=.*?[0-9]).{1,}$');
      if (!regex.test(control.value)) {
        returnValue = { ...(returnValue || {}), requireDigit: true };
      }

      return returnValue;
    };
  }

  /** Check that the value of the control is a valid NIF or NIE */
  static nifNieValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let returnValue: ValidationErrors | null = null;
      if (control.value) {
        if (ruleNIF(control.value) || ruleNIE(control.value)) {
          returnValue = null;
        } else {
          returnValue = {
            ...(returnValue || {}),
            invalidNifNie: true
          };
        }
      }
      return returnValue;
    };
  }

  static affiliationNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let returnValue: ValidationErrors | null = null;

      if (control.value) {
        if (validateControlDigits(control.value.replace('/', ''))) {
          returnValue = null;
        } else {
          returnValue = {
            ...(returnValue || {}),
            affiliationNumberInvalid: true
          };
        }
      }

      return returnValue;
    };
  }

  static maxConsecutiveConsonats(
    maxNumberOfConsecutiveConsonants: number
  ): ValidatorFn {
    return TSIValidators.patternWithMessage(
      `[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]{${maxNumberOfConsecutiveConsonants},}`,
      `No más de ${maxNumberOfConsecutiveConsonants} consonantes seguidas`,
      { inverseMatch: true }
    );
  }

  static hasNoSpecialCharacters(): ValidatorFn {
    return TSIValidators.patternWithMessage(
      /^[a-zA-Z\s-ñÑ]*$/,
      'Sin caracteres especiales ni números'
    );
  }
}
