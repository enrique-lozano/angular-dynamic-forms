import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicAutocompleteFormFieldComponent } from './dynamic-autocomplete-form-field.component';

describe('DynamicAutocompleteFormFieldComponent', () => {
  let component: DynamicAutocompleteFormFieldComponent;
  let fixture: ComponentFixture<DynamicAutocompleteFormFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicAutocompleteFormFieldComponent]
    });
    fixture = TestBed.createComponent(DynamicAutocompleteFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
