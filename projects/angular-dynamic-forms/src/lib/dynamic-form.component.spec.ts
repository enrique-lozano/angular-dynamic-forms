import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularMaterialModule } from '../../../core/modules/angular-material.module';
import { ComponentTestModule } from '../../../core/modules/testing/component.testing.module';
import { DynamicFormComponent } from './dynamic-form.component';

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularMaterialModule, ComponentTestModule],
      declarations: [DynamicFormComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
