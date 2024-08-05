import { Validators } from '@angular/forms';
import { AppInjector } from 'src/app/app.module';
import { ApiService } from 'src/app/core/services/api/api.service';
import { CommonDialogsService } from 'src/app/core/services/utils/common-dialogs.service';
import {
  ActivityTypeDTO,
  BasicZoneStDTO,
  CenterDTO
} from 'src/app/shared/models/api/data-contracts';
import { calculateAffiliationNumber } from 'src/app/utils/affiliationNumber';
import { getCompletedNIFNIE } from 'src/app/utils/nifNie';
import { DynamicAutocompleteFormField } from '../components/dynamic-autocomplete-form-field/dynamic-autocomplete-field';
import { IconOrButtonIcon } from '../components/dynamic-icon-or-button-icon/dynamic-icon-or-button-icon.component';
import {
  InputFormField,
  InputFormFieldConstructorParams
} from '../components/dynamic-input/dynamic-input-field';
import { SelectFormField } from '../components/dynamic-select-form-field/dynamic-select-field';
import { SelectOptionsGenerator } from '../models/fields/selects/convertToOptions';
import { TSIValidators } from '../validations/app-validators';
export abstract class CommonFieldsGenerator {
  /**
   * A selector that is usually used to toggle a boolean voided param.
   *
   * The value of the options will be:
   * - `true` if we select to return only the historical/voided items
   * - `false` if we select to return only the active/not voided items
   * - `undefined` if we select to return all
   * */
  static historicalSelectorField(classList = 'col-12 col-md-6 col-lg-4') {
    return SelectFormField.newSingleSelect({
      hostClass: classList,
      initialValue: false,
      label: 'Registros a incluir',
      optionsDef: [
        {
          displayName: 'Todos los registros',
          value: '' as unknown as boolean
        },
        {
          displayName: 'Solo registros activos',
          value: false
        },
        {
          displayName: 'Solo registros históricos',
          value: true
        }
      ]
    });
  }

  /** Creates a field to select a single center */
  static singleCenterSelection(
    params: {
      label: string;
      classList?: string;
      onValueChanged?: (
        value: CenterDTO,
        field: DynamicAutocompleteFormField<CenterDTO, true>
      ) => void;
    } = { label: 'Centro', classList: 'col-6 col-md-4' }
  ) {
    return DynamicAutocompleteFormField.newFieldWithSuffixSelector({
      label: params.label,
      hostClass: params.classList,
      initialValue: undefined as CenterDTO | undefined,
      displayWith: (el) => el?.name ?? '',
      onValueChanged: params.onValueChanged,
      suffixIconOrButton: (field) =>
        new IconOrButtonIcon({
          icon: 'search',
          onClicked: () => {
            AppInjector.get(CommonDialogsService)
              .openCenterSelector({
                data: {
                  isMultiple: false,
                  preselectedCenters: field.value ? [field.value] : undefined
                }
              })
              .then((res) => {
                if (res) field.value = res.at(0);
              });
          }
        })
    });
  }

  /**
   * An input with a suffix that opens the map selector.
   * This selector will allow multiple selections and the field
   * value will hold only the items that are basic zones, filtering
   * the rest of selected options
   *
   * @param label The string label of the input
   * */
  static selectBasicZonesField(
    label: string,
    classList = 'col-12',
    disableChildNodes?: boolean,
    nodeLevel?: number
  ) {
    return DynamicAutocompleteFormField.newFieldWithSuffixSelector({
      label,
      hostClass: classList,
      initialValue: [] as BasicZoneStDTO[],
      displayWith: (field) => {
        return field?.map((e) => e.name).join(', ') ?? '';
      },
      suffixIconOrButton: (field) =>
        new IconOrButtonIcon({
          icon: 'search',
          onClicked: async () => {
            const x = await AppInjector.get(
              CommonDialogsService
            ).openSearchMapDialog({
              data: {
                preselectedNodes: field.value?.map((x) => x.uuid!),
                selectMultiple: true,
                disableChildNodes: disableChildNodes
              }
            });

            await new Promise((r) => setTimeout(r, 1));

            if (x) {
              const nodeLvl = nodeLevel ? nodeLevel : 2;
              field.value = x
                .filter((node) => node.level === nodeLvl)
                .map((x) => x.item!) as BasicZoneStDTO[];
            }
          }
        })
    });
  }

  /**
   * This selector contains activity types
   * @param classList The string classList of the input
   * @returns
   */
  static selectActivityType(classList = 'col-12 col-md-4') {
    return new DynamicAutocompleteFormField<ActivityTypeDTO | undefined, true>({
      label: 'Tipo de actividad',
      hostClass: classList,
      requireSelection: true,
      optionsDef: async (value, field) => {
        const apiRes = await ApiService.getActivityTypes({
          name: value,
          fields: 'name,code,uuid',
          sortBy: 'name',
          size: (field.page + 1) * 10
        });

        return [
          ...SelectOptionsGenerator.fromHttpPaginatedRes(apiRes, 'name'),
          ...field.buildShowLoadMoreButtonIf(
            apiRes.data.page + 1 < apiRes.data.totalPages,
            value
          )
        ];
      },
      displayWith: (selectedEl) => selectedEl?.name ?? ''
    });
  }

  /**
   * An input with a suffix that opens the center selector.
   * @param label The string label of the input
   * @param classList The string classList of the input
   * @returns
   */
  static selectCenter(label = 'Centro', classList = 'col-12 col-md-4') {
    return DynamicAutocompleteFormField.newFieldWithSuffixSelector({
      hostClass: classList,
      label,
      initialValue: undefined as undefined | CenterDTO,
      displayWith: (field) => field?.name ?? '',
      suffixIconOrButton: (field) =>
        new IconOrButtonIcon({
          icon: 'search',
          onClicked: () => {
            AppInjector.get(CommonDialogsService)
              .openCenterSelector({
                data: {
                  isMultiple: false,
                  preselectedCenters: field.value ? [field.value] : []
                }
              })
              .then((selCenters) => {
                if (selCenters) {
                  field.value = selCenters.at(0);
                }
              });
          }
        })
    });
  }

  static dni({
    label = 'NIF / NIE',
    hostClass = 'col-12 col-md-4',
    ...rest
  }: Omit<InputFormFieldConstructorParams<'text'>, 'inputType'>) {
    const field = InputFormField.newTextInput({
      label,
      hostClass,
      validators: [
        Validators.minLength(9),
        Validators.maxLength(9),
        TSIValidators.nifNieValidator()
      ],
      ...rest
    });

    field.onBlur = () => {
      if (!field.value) return;
      field.value = getCompletedNIFNIE(field.value);
    };

    return field;
  }

  static affiliationNumber({
    label = 'Número de afiliación',
    hostClass = 'col-12 col-md-4',
    ...rest
  }: Omit<InputFormFieldConstructorParams<'text'>, 'inputType'>) {
    const field = InputFormField.newTextInput({
      label,
      hostClass,
      validators: [TSIValidators.affiliationNumberValidator()],
      maskOptions: {
        mask: [/\d/, /\d/, '/', ...Array(8).fill(/\d/), '/', /\d/, /\d/]
      },
      ...rest
    });

    field.onBlur = (event) => {
      const inputValue = (event.target as HTMLInputElement).value;

      if (inputValue.length >= 11) {
        const newAffNumber = calculateAffiliationNumber(
          inputValue.replaceAll('/', '')
        );
        field.value = newAffNumber;
      }
    };

    return field;
  }

  static passport({
    label = 'Pasaporte',
    hostClass = 'col-12 col-md-4',
    ...rest
  }: Omit<InputFormFieldConstructorParams<'text'>, 'inputType'>) {
    return InputFormField.newTextInput({
      label,
      hostClass,
      validators: [Validators.minLength(15), Validators.maxLength(15)],
      ...rest
    });
  }
}
