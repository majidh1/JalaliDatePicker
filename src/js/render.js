import defaults from './defaults';
import { createElement } from './utilities';
import { WINDOW } from './constants';

function createJalaliDatePickerElement() {
  if (!this.jalaliDatePickerElement) {
    this.jalaliDatePickerElement = createElement('div', defaults.container);
  }
  return this.jalaliDatePickerElement;
}

export default {
  draw(year, month, day) {
    WINDOW.console.log(year, month, day);
    const jdpEl = createJalaliDatePickerElement();
    jdpEl.innerHTML = defaults.template;
  },
};
