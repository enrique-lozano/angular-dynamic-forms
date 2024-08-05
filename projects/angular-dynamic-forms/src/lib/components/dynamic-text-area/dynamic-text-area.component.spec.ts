import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTextAreaComponent } from './dynamic-text-area.component';

describe('DynamicTextAreaComponent', () => {
  let component: DynamicTextAreaComponent;
  let fixture: ComponentFixture<DynamicTextAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DynamicTextAreaComponent]
    });
    fixture = TestBed.createComponent(DynamicTextAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
