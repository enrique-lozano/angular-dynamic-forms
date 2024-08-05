import { DynamicAutocompleteFormField } from '../components/dynamic-autocomplete-form-field/dynamic-autocomplete-field';
import { DateFormField } from '../components/dynamic-date-picker-form-field/dynamic-date-fields';
import { InputFormField } from '../components/dynamic-input/dynamic-input-field';
import { SelectFormField } from '../components/dynamic-select-form-field/dynamic-select-field';
import { TextAreaFormField } from '../components/dynamic-text-area/dynamic-text-area-field';
import { ToggleGroupFormField } from '../components/dynamic-toggle-group/dynamic-toggle-group-field';
import { ToggleFormField } from '../components/dynamic-toggle/dynamic-toggle-field';
import { FieldSeparator } from './fields/dynamic-field-separator';

/** Type that include all the dynamic form types */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyDynamicFormControl<T = any> =
  | FieldSeparator
  | TextAreaFormField
  | ToggleFormField
  | ToggleGroupFormField<T>
  | SelectFormField<T, false>
  | SelectFormField<T, true>
  | DynamicAutocompleteFormField<T, true>
  | DynamicAutocompleteFormField<T, false>
  | DateFormField
  | InputFormField<'text'>
  | InputFormField<'email'>
  | InputFormField<'password'>
  | InputFormField<'tel'>
  | InputFormField<'time'>
  | InputFormField<'number'>;
