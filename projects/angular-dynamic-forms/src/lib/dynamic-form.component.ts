import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AnyDynamicFormControl } from './models/any-dynamic-form-control';
import { DynamicFormGroup } from './models/dynamic-form-group';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[contentBetweenFormFields]'
})
export class MarkerDirective {}

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent<
  T extends Record<string, AnyDynamicFormControl> = any
> implements OnChanges, OnDestroy, AfterViewInit
{
  // Query for marked templates as a list of TemplateRefs.
  @ContentChildren(MarkerDirective, { read: TemplateRef })
  templates?: TemplateRef<any>[];

  @ContentChild('contentBetweenFields', { static: true })
  headerTemplateRef?: TemplateRef<any>;

  @Input() structure?: DynamicFormGroup<T>;

  formFields?: [string, AnyDynamicFormControl][];

  subscr?: Subscription;

  viewInit = false;

  constructor(
    private changeDet: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnChanges() {
    if (!this.structure) return;

    // TODO: For some reason if we put structure.allFieldsArray directly in the template, the app gets frozen
    this.formFields = this.structure.allFieldsArray;

    this.subscr = this.structure.numberOfControlChanged.subscribe(() => {
      this.formFields = this.structure?.allFieldsArray;
    });

    if (this.viewInit) this.addItemsBeforeFields();
  }

  ngAfterViewInit(): void {
    this.viewInit = true;
    setTimeout(() => {
      this.addItemsBeforeFields();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.subscr) this.subscr.unsubscribe();
  }

  shouldDisplayAfterIndexOrKey(
    template: TemplateRef<unknown>,
    index: number,
    key: string
  ) {
    if (!this.viewContainerRef) return false;

    const ref = this.viewContainerRef.createEmbeddedView(template);

    const rootNode = ref.rootNodes.at(0) as HTMLElement;

    if (
      !rootNode ||
      ref.rootNodes.length > 1 ||
      !(rootNode instanceof HTMLElement)
    ) {
      ref.destroy();

      throw Error(
        'This directive can only by referenced in a single HTMLElement instance'
      );
    }

    ref.destroy();

    return (
      rootNode.classList.contains(`after-field-at-${index}`) ||
      rootNode.classList.contains(`after-field-with-key-${key}`)
    );
  }

  addItemsBeforeFields() {
    const embView = this.headerTemplateRef?.createEmbeddedView(
      this.headerTemplateRef!
    );

    if (!embView) return;

    const placeholderElements = Array.from(
      document.querySelectorAll(
        '[id^="content-after-field-"],[id*=" content-after-field-"]'
      )
    );

    if (placeholderElements.length == 0) {
      setTimeout(() => {
        this.addItemsBeforeFields();
      }, 20);
      return;
    }

    Array.from(
      document.querySelectorAll(
        '[id^="content-after-field-"],[id*=" content-after-field-"]'
      )
    ).forEach((x) => {
      const index = x.id.split('content-after-field-')[1];

      Array.from(x.children).forEach((element) => {
        if (!element.classList.contains(`after-field-${index}`)) {
          element.remove();
        }
      });
    });

    this.changeDet.detectChanges();
  }
}
