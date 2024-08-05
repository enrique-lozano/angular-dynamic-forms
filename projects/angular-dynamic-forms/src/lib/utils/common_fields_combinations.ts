import { Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api/api.service';
import { clmRegionUUID } from 'src/app/features/population/pages/population/constants';
import { DateFormField } from 'src/app/shared/components/dynamic-form/components/dynamic-date-picker-form-field/dynamic-date-fields';
import { MunicipalityStDTO } from 'src/app/shared/models/api/data-contracts';
import { DynamicAutocompleteFormField } from '../components/dynamic-autocomplete-form-field/dynamic-autocomplete-field';
import { InputFormField } from '../components/dynamic-input/dynamic-input-field';
import { SelectFormField } from '../components/dynamic-select-form-field/dynamic-select-field';
import { SelectOptionsGenerator } from '../models/fields/selects/convertToOptions';
import { CommonFieldsGenerator } from './common_fields_generator';

export abstract class CommonFieldsCombination {
  static voidedWithOperatorAndDates() {
    return {
      voided: CommonFieldsGenerator.historicalSelectorField(),
      startVoidedDate: new DateFormField({
        disabled: true,
        label: 'Fecha de borrado desde',
        hostClass: 'col-12 col-md-6 col-lg-4'
      }),
      endVoidedDate: new DateFormField({
        disabled: true,
        label: 'Fecha de borrado hasta',
        hostClass: 'col-12 col-md-6 col-lg-4'
      }),
      voidedBy: new InputFormField({
        disabled: true,
        label: 'COMMON.FIELDS.operator',
        inputType: 'text',
        hostClass: 'col-12 col-md-6 col-lg-4'
      })
    };
  }

  static historicUserInfo() {
    return {
      codSns: new InputFormField({
        label: 'Código SNS',
        inputType: 'text',
        validators: [Validators.maxLength(16)],
        hostClass: 'col-6 col-md-3'
      }),
      cip: new InputFormField({
        label: 'CIP',
        inputType: 'text',
        validators: [Validators.maxLength(16)],
        hostClass: 'col-6 col-md-3'
      }),
      ...this.userMainData()
    };
  }

  static userMainData() {
    return {
      firstName: InputFormField.newTextInput({
        label: 'COMMON.FIELDS.name',
        hostClass: 'col-6 col-md-2'
      }),
      lastName: InputFormField.newTextInput({
        label: 'COMMON.FIELDS.surname_1',
        hostClass: 'col-6 col-md-2'
      }),
      lastName2: InputFormField.newTextInput({
        label: 'COMMON.FIELDS.surname_2',
        hostClass: 'col-6 col-md-2'
      })
    };
  }

  static addressData() {
    const addressFields = {
      province: new DynamicAutocompleteFormField({
        label: 'COMMON.FIELDS.province',
        requireSelection: true,
        hostClass: 'col-12 col-md-4',
        optionsDef: async (value, field) => {
          const apiRes = await ApiService.getProvinces({
            name: value,
            regionUuid: clmRegionUUID,
            sortBy: 'name',
            size: (field.page + 1) * 10
          });

          return [
            ...SelectOptionsGenerator.fromHttpPaginatedRes(apiRes, 'name'),
            ...field.buildShowLoadMoreButtonIf(
              apiRes.data.page + 1 < apiRes.data.totalPages &&
                (field.page + 2) * 10 <= 50,
              value
            )
          ];
        },
        displayWith: (selectedEl) =>
          selectedEl && selectedEl.name ? selectedEl.name : ''
      }),
      municipality: new DynamicAutocompleteFormField<
        MunicipalityStDTO | undefined,
        true
      >({
        label: 'COMMON.FIELDS.town',
        requireSelection: true,
        disabled: true,
        hostClass: 'col-12 col-md-4',
        displayWith: (selectedEl) =>
          selectedEl && selectedEl.name ? selectedEl.name : ''
      }),
      addressType: SelectFormField.newSingleSelect({
        label: 'COMMON.FIELDS.road_type',
        hostClass: 'col-md-4 col-12',
        disabled: true,
        optionsDef: async () => {
          const data = await ApiService.getAddressTypes();

          return SelectOptionsGenerator.fromArrayWithKey(
            data.data,
            'description',
            'code'
          );
        }
      }),
      roadName: InputFormField.newTextInput({
        label: 'COMMON.FIELDS.road',
        disabled: true,
        hostClass: 'col-md-4 col-12'
      }),
      addressNum: new InputFormField({
        inputType: 'number',
        label: 'COMMON.FIELDS.road_number',
        disabled: true,
        validators: [Validators.maxLength(4), Validators.min(0)],
        hostClass: 'col-md-2 col-12'
      }),
      postalCode: new InputFormField({
        inputType: 'text',
        label: 'COMMON.FIELDS.postal_code_short',
        disabled: true,
        hostClass: 'col-md-2 col-12',
        maskOptions: {
          mask: [...Array(5).fill(/\d/)]
        },
        validators: [Validators.maxLength(5), Validators.minLength(5)]
      }),
      otherData: InputFormField.newTextInput({
        label: 'COMMON.FIELDS.other_data',
        disabled: true,
        hostClass: 'col-md-4 col-12'
      })
    };

    addressFields.province.onValueChanged = (res) => {
      addressFields.municipality.value = undefined;
      addressFields.addressType.value = undefined;
      addressFields.roadName.value = undefined;
      addressFields.postalCode.value = undefined;
      addressFields.otherData.value = undefined;
      addressFields.addressNum.value = undefined;
      if (!res || res === undefined) {
        addressFields.municipality.control.disable();
        addressFields.municipality.options = [];
        return;
      }

      addressFields.municipality.reinitializeOptions();
      addressFields.municipality.control.enable();
    };

    addressFields.municipality.optionsDef = async (value, field) => {
      if (!addressFields?.province.value) {
        field.control.disable({ emitEvent: false });
        return [];
      }

      field.control.enable({ emitEvent: false });
      const apiRes = await ApiService.getMunicipalities({
        provinceUuid: addressFields.province?.value?.uuid,
        name: value,
        sortBy: 'name',
        size: (field.page + 1) * 10
      });

      return [
        ...SelectOptionsGenerator.fromHttpPaginatedRes(apiRes, 'name'),
        ...field.buildShowLoadMoreButtonIf(
          apiRes.data.page + 1 < apiRes.data.totalPages &&
            (field.page + 2) * 10 <= 50,
          value
        )
      ];
    };

    addressFields.municipality.control.valueChanges.subscribe((res) => {
      if (res !== undefined) {
        addressFields.addressType.control.enable();
        addressFields.roadName.control.enable();
        addressFields.addressNum.control.enable();
        addressFields.postalCode.control.enable();
        addressFields.otherData.control.enable();
      } else {
        addressFields.addressType.control.disable();
        addressFields.roadName.control.disable();
        addressFields.addressNum.control.disable();
        addressFields.postalCode.control.disable();
        addressFields.otherData.control.disable();
      }
    });

    return addressFields;
  }
}
