import moment from "moment";
import csv from "csvtojson";

import CommonStore from "../store/common";
import UsersStore from "../store/users";

export const DEFAULT_VALUE = "—";

export const ROLES = ["admin", "manager", "student"];

export const MS_TYPES = {
  a: "other",
  b: "nonresident",
  c: "social",
  d: "emergency",
};

const logoutHandler = () => {
  CommonStore.reset();
  UsersStore.reset();
};

const formatAmount = (amount) => {
  const floatAmount = parseFloat(amount);
  return floatAmount ? `${floatAmount.toFixed(2)} RUB` : DEFAULT_VALUE;
};

const formatDate = (date) => {
  if (date) return moment(new Date(date)).format("DD.MM.YYYY");
  return DEFAULT_VALUE;
};

const parseCsv = (str) => {
  return csv().fromString(str);
};

export default {
  logoutHandler,
  formatAmount,
  formatDate,
  parseCsv,
};
