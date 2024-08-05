import { MatHint } from '@angular/material/form-field';
import { Optional } from 'src/app/utils/types';
import { Except } from 'type-fest';

export type DynamicMatHintConstructor<T extends 'start' | 'end'> = Optional<
  DynamicMatHint<T>,
  'id'
>;

export class DynamicMatHint<T extends 'start' | 'end'> extends MatHint {
  innerHTML: string;
  classList?: string[];

  override align: T;

  private constructor(data: DynamicMatHintConstructor<T>) {
    super();

    this.id =
      data.id ?? 'mat-hint-' + Math.random().toString(36).substring(2, 9);

    this.align = data.align;
    this.classList = data.classList;
    this.innerHTML = data.innerHTML;
  }

  /** Create a new `DynamicMatHint` aligned to the start */
  static newStartHint(
    data: Except<DynamicMatHintConstructor<'start'>, 'align'>
  ) {
    return new DynamicMatHint({ ...data, align: 'start' });
  }

  /** Create a new `DynamicMatHint` aligned to the start */
  static newEndHint(data: Except<DynamicMatHintConstructor<'end'>, 'align'>) {
    return new DynamicMatHint({ ...data, align: 'end' });
  }
}
