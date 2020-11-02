import { findElement, createItems } from './utilities';
import { DATA_ATTR_YEARS, DATA_ATTR_MONTHS, DATA_ATTR_DAYS } from './constants';

export default {
  render() {
    this.renderYears();
    this.renderMonths();
    this.renderDays();
  },
  renderYears() {
    createItems(
      findElement(this.getJalaliDatePickerElement(), DATA_ATTR_YEARS),
      this.getMinYear(),
      this.getMaxYear(),
      this.options.itemTagname,
      this.getYear(),
    );
  },
  renderMonths() {
    createItems(
      findElement(this.getJalaliDatePickerElement(), DATA_ATTR_MONTHS),
      this.getMinMonth(),
      this.getMaxMonth(),
      this.options.itemTagname,
      this.getMonth(),
      this.options.months,
    );
  },
  renderDays() {
    createItems(
      findElement(this.getJalaliDatePickerElement(), DATA_ATTR_DAYS),
      1,
      31,
      this.options.itemTagname,
      this.getDay(),
    );
  },
};
