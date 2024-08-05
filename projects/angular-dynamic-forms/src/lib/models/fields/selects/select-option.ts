/** Options for a select/autocomplete field */
export class SelectOption<T> {
  /** The display name of the option */
  displayName: string;

  /** The value that this option return */
  value: T;

  /** Class/classes to bind to the `mat-option` */
  classes?: Record<string, boolean>;

  /** Determines if the option is disabled or not */
  disabled?: boolean;

  onClicked?: () => void;

  constructor(data: SelectOption<T>) {
    this.displayName = data.displayName;
    this.value = data.value;

    this.classes = data.classes;
    this.disabled = data.disabled;
    this.onClicked = data.onClicked;
  }

  static showLoadMoreButton(onClicked: () => void) {
    return new SelectOption({
      displayName: 'Cargar mas',
      value: undefined,
      disabled: true,
      classes: { 'show-load-more': true },
      onClicked
    });
  }
}
