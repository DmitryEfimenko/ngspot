import { InjectionToken, Provider } from '@angular/core';

import { LiteralUnionOrString } from './typings';

export type ShowErrorWhen = LiteralUnionOrString<
  'touched' | 'dirty' | 'touchedAndDirty' | 'formIsSubmitted'
>;

export interface IErrorsConfiguration {
  /**
   * Configures when to display an error for an invalid control. Options that are available by default are listed below. Note, custom options can be provided using CUSTOM_ERROR_STATE_MATCHERS injection token.
   *
   * `'touched'` - *[default]* shows an error when control is marked as touched. For example, user focused on the input and clicked away or tabbed through the input.
   *
   * `'dirty'` - shows an error when control is marked as dirty. For example, when user has typed something in.
   *
   * `'touchedAndDirty'` - shows an error when control is marked as both - touched and dirty.
   *
   * `'formIsSubmitted'` - shows an error when parent form was submitted.
   */
  showErrorsWhenInput?: ShowErrorWhen;

  /**
   * The maximum amount of errors to display per ngxErrors block.
   */
  showMaxErrors?: number | null;
}

export type ErrorsConfiguration = Required<IErrorsConfiguration>;

const defaultConfig: ErrorsConfiguration = {
  showErrorsWhenInput: 'touched',
  showMaxErrors: null,
};

export const ERROR_CONFIGURATION = new InjectionToken<ErrorsConfiguration>(
  'ERROR_CONFIGURATION',
  {
    factory: () => {
      return defaultConfig;
    },
  },
);

function mergeErrorsConfiguration(
  config: IErrorsConfiguration,
): ErrorsConfiguration {
  return { ...defaultConfig, ...config };
}

export function provideNgxErrorsConfig(
  config: IErrorsConfiguration = defaultConfig,
): Provider {
  return {
    provide: ERROR_CONFIGURATION,
    useValue: mergeErrorsConfiguration(config),
  };
}
