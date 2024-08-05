import { TSIValidators } from './app-validators';

export abstract class CommonPatternValidations {
  static cias = TSIValidators.patternWithMessage(
    '\\d{10}[A-Z]$',
    'Introduce 10 números seguidos de una mayúscula'
  );
}
