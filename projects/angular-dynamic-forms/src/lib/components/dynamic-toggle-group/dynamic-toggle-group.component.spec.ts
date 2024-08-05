import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicToggleGroupComponent } from './dynamic-toggle-group.component';

describe('DynamicToggleGroupComponent', () => {
  let component: DynamicToggleGroupComponent;
  let fixture: ComponentFixture<DynamicToggleGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicToggleGroupComponent]
    });
    fixture = TestBed.createComponent(DynamicToggleGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
