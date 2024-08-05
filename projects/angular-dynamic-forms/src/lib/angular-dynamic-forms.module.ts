import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaskitoModule } from '@maskito/angular';
import { AngularMaterialModule } from './angular-material.module';
import { DynamicAutocompleteFormFieldComponent } from './components/dynamic-autocomplete-form-field/dynamic-autocomplete-form-field.component';
import { DynamicDatePickerFormFieldComponent } from './components/dynamic-date-picker-form-field/dynamic-date-picker-form-field.component';
import { DynamicIconOrButtonIconComponent } from './components/dynamic-icon-or-button-icon/dynamic-icon-or-button-icon.component';
import { DynamicInputComponent } from './components/dynamic-input/dynamic-input.component';
import { DynamicSelectFormFieldComponent } from './components/dynamic-select-form-field/dynamic-select-form-field.component';
import { DynamicTextAreaComponent } from './components/dynamic-text-area/dynamic-text-area.component';
import { DynamicToggleGroupComponent } from './components/dynamic-toggle-group/dynamic-toggle-group.component';
import { DynamicToggleComponent } from './components/dynamic-toggle/dynamic-toggle.component';
import { FieldErrorDisplayComponent } from './components/field-error-display/field-error-display.component';
import { DynamicFormComponent } from './dynamic-form.component';

// Standalone components to import and export to the rest of the app
const standaloneComponents = [
  FieldErrorDisplayComponent,
  DynamicIconOrButtonIconComponent,
];

const DynamicFormFieldsComponents = [
  DynamicFormComponent,
  DynamicTextAreaComponent,
  DynamicInputComponent,
  DynamicSelectFormFieldComponent,
  DynamicToggleGroupComponent,
  DynamicToggleComponent,
  DynamicDatePickerFormFieldComponent,
  DynamicAutocompleteFormFieldComponent,
];

@NgModule({
  declarations: [...DynamicFormFieldsComponents],
  imports: [
    CommonModule,
    AngularMaterialModule,
    MaskitoModule,
    ReactiveFormsModule,
    ...standaloneComponents,
  ],
  exports: [...standaloneComponents],
})
export class AngularDynamicFormsModule {}
