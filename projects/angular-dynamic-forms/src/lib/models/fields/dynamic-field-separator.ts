import {
  DynamicFormControl,
  DynamicFormControlConstructor
} from '../dynamic-form-control';

export class FieldSeparator extends DynamicFormControl<null> {
  readonly type = 'separator';

  constructor(
    data: Pick<DynamicFormControlConstructor<null>, 'label' | 'classList'>
  ) {
    super({
      label: data.label,
      classList: data.classList
    });
  }

  clone() {
    return new FieldSeparator(super.objectToBeCloned());
  }
}
