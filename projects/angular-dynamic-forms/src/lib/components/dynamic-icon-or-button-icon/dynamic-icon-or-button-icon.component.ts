import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AngularMaterialModule } from 'src/app/core/modules/angular-material.module';

export class IconOrButtonIcon {
  /**
   * Function to trigger when this button icon is clicked. If not specified, the component will
   * render a `mat-icon` directly instead of a `button` with a `mat-icon` inside
   */
  onClicked?: () => void;

  /**
   * The icon to display, a string identificator
   * from [Google Fonts](https://fonts.google.com/icons?icon.set=Material+Icons)
   *  */
  icon: string;

  constructor(data: IconOrButtonIcon) {
    this.onClicked = data.onClicked;
    this.icon = data.icon;
  }
}

@Component({
  selector: 'app-dynamic-icon-or-button-icon',
  standalone: true,
  imports: [AngularMaterialModule, CommonModule],
  template: `
    <mat-icon *ngIf="!buttonIcon.onClicked" class="material-icons-filled">
      {{ buttonIcon.icon }}
    </mat-icon>

    <button
      *ngIf="buttonIcon.onClicked"
      type="button"
      [disabled]="disabled"
      (click)="buttonIcon.onClicked!()"
      mat-icon-button
      [attr.data-cy]="dataCySelector + '-button-icon'"
    >
      <mat-icon class="material-icons-filled">
        {{ buttonIcon.icon }}
      </mat-icon>
    </button>
  `
})
export class DynamicIconOrButtonIconComponent {
  @Input() buttonIcon!: IconOrButtonIcon;
  @Input() disabled!: boolean;
  @Input() dataCySelector!: string;
}
