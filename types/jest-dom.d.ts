/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveValue(value: string | number | string[]): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeChecked(): R;
      toHaveFocus(): R;
      toHaveStyle(style: string | object): R;
      toBeInvalid(): R;
      toBeValid(): R;
      toBeEmptyDOMElement(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(htmlText: string): R;
      toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R;
      toBePartiallyChecked(): R;
      toHaveDescription(text?: string | RegExp): R;
    }
  }
}
