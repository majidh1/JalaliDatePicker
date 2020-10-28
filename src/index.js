import {
  NAMESPACE,
} from './js/constants';
import JalaliDatepicker from './js/jalaliDatepicker';

const datepicker = new JalaliDatepicker(element, options);
window.console.warn(NAMESPACE, datepicker);
