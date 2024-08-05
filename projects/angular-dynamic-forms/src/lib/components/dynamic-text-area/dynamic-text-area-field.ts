import {
  DynamicFormFieldWithInput,
  DynamicFormFieldWithInputConstructor
} from '../../models/dynamic-form-field-with-input';

export class TextAreaFormField extends DynamicFormFieldWithInput<'text'> {
  readonly type = 'textArea';

  /**
   * Rows of the textarea. Should be between 1 and 9
   *
   * @default "4" */
  rows?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' = '4';

  constructor(
    data: Pick<TextAreaFormField, 'rows'> &
      Omit<DynamicFormFieldWithInputConstructor<'text'>, 'inputType'>
  ) {
    super({ ...data, inputType: 'text' });

    this.rows = data.rows;
  }

  clone() {
    return new TextAreaFormField({
      ...super.objectToBeCloned(),
      rows: this.rows
    });
  }
}
