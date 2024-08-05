import { BaseEnum } from '../../../../../models/api/data-contracts';
import { HttpResponse } from '../../../../../models/api/http-client';
import { PaginatedObjects } from '../../../../../models/paginator.model';
import { SelectOption } from './select-option';

/** Class to englobe a set of functions to generate options for a select field */
export abstract class SelectOptionsGenerator {
  static empty<T>() {
    return [] as SelectOption<T>[];
  }

  static resetOptionField() {
    return new SelectOption({
      value: undefined,
      displayName: '-- Sin especificar --',
      classes: { 'fw-light': true, 'reset-option': true }
    });
  }

  /** Convert an array with an http response from the API with enum data to an option array (an array with key-name objects).
   *
   * @note This is an alias of `SelectOptionsGenerator.convertHttpResToOptions(httpResponse, 'displayName', 'code')`
   */
  static fromEnumHttpRes(
    httpResponse: HttpResponse<BaseEnum[], void>,
    includeResetOption = true
  ) {
    return SelectOptionsGenerator.fromEnumArray(
      httpResponse.data,
      includeResetOption
    );
  }

  /** Convert an array with enum data to an option array (an array with key-name objects).
   *
   */
  static fromEnumArray(enumArray: BaseEnum[], includeResetOption = true) {
    return [
      ...(includeResetOption ? [this.resetOptionField()] : []),
      ...SelectOptionsGenerator.fromArrayWithKey(
        enumArray,
        'displayName',
        'code'
      ).sort((a, b) => a.displayName.localeCompare(b.displayName))
    ];
  }

  /**
   * Converts an HTTP response from the API into an array of option objects.
   * Each option object has a display attribute that corresponds to a property of the items in the original array.
   * The value of each option is the same as the corresponding item in the original array.
   *
   * @param httpResponse - The HTTP response from the API.
   * @param displayKey - The key of the object to be displayed for the user
   * @returns - An array of option instances.
   */
  static fromHttpPaginatedRes<T, DisplayKey extends keyof T>(
    httpResponse: HttpResponse<PaginatedObjects<T>, void>,
    displayKey: DisplayKey
  ) {
    return SelectOptionsGenerator.fromArray(
      httpResponse.data.content,
      displayKey
    );
  }

  /** Convert an array with an http response from the API to an option array (an array with key-name objects).  In this function, the value of each item will be the same as each item in the original array. */
  static fromHttpPaginatedResWithKey<
    T,
    DisplayKey extends keyof T,
    ValueKey extends keyof T
  >(
    httpResponse: HttpResponse<PaginatedObjects<T>, void>,
    displayKey: DisplayKey,
    valueKey: ValueKey
  ) {
    return SelectOptionsGenerator.fromArrayWithKey(
      httpResponse.data.content,
      displayKey,
      valueKey
    );
  }

  /** Convert an array with any data to an option array (an array with key-name objects)
   *
   * @param data The data to convert
   * @param displayKey The attribute of the object to be presented to the UI
   *
   */
  static fromArrayWithKey<
    T,
    DisplayKey extends keyof T,
    ValueKey extends keyof T
  >(data: T[], displayKey: DisplayKey, valueKey: ValueKey) {
    return data.map(
      (x) =>
        new SelectOption({
          displayName:
            typeof x[displayKey] == 'string'
              ? (x[displayKey] as string)
              : String(x[displayKey]),
          value: x[valueKey]
        })
    );
  }

  /** Convert an array with any data to an option array (an array with key-name objects)
   * This method allows nested keys
   *
   * @param data The data to convert
   * @param displayKey The attribute of the object to be presented to the UI
   *
   */
  static fromArrayWithNestedKey<T>(
    data: T[],
    displayKeyPath: string,
    valueKeyPath: string
  ) {
    return data.map((x) => {
      const displayName = this.getValueAtPath(x, displayKeyPath);
      const value = this.getValueAtPath(x, valueKeyPath);

      return new SelectOption({
        displayName:
          typeof displayName === 'string' ? displayName : String(displayName),
        value: value
      });
    });
  }

  private static getValueAtPath<T>(data: T, path: string): any {
    const pathSegments = path.split('.');
    let value: any = data;

    for (const segment of pathSegments) {
      if (value && typeof value === 'object' && segment in value) {
        value = value[segment];
      } else {
        return undefined;
      }
    }

    return value;
  }

  /** Convert an array with any data to an option array (an array with key-name objects). In this function, the value of each item will be the same as each item in the original array.
   *
   * @param data The data to convert
   * @param displayKey The attribute of the object to be presented to the UI
   */
  static fromArray<T, DisplayKey extends keyof T>(
    data: T[],
    displayKey: DisplayKey
  ) {
    return data.map(
      (x) =>
        new SelectOption({
          displayName:
            typeof x[displayKey] == 'string'
              ? (x[displayKey] as string)
              : String(x[displayKey]),
          value: x
        })
    );
  }
}
