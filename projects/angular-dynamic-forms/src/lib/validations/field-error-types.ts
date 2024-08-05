export enum fieldError {
  // Field errors by priority order:

  required = 'required',
  minlength = 'minlength',
  min = 'min',
  max = 'max',
  pattern = 'pattern',
  maxlength = 'maxlength',
  /** Angular default email validator */ email = 'email',
  /** Angular default username validator */ username = 'username',

  matDatepickerMax = 'matDatepickerMax',
  matDatepickerMin = 'matDatepickerMin',

  minTime = 'minTime',
  maxTime = 'maxTime',

  /* -------- CUSTOM VALIDATORS ------- */
  equal = 'equal',
  requireUpperAndLowerCase = 'requireUpperAndLowerCase',
  requireDigit = 'requireDigit',
  dniNotAvailable = 'dniNotAvailable',
  invalidNifNie = 'invalidNifNie',
  affiliationNumberInvalid = 'affiliationNumberInvalid'
}
