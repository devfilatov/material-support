const getCookie = (name) => {
  const c = document.cookie.match(
    `(?:(?:^|.*; *)${name} *= *([^;]*).*$)|^.*$`
  )[1];
  if (c) return decodeURIComponent(c);
};

const setCookie = (name, value, opts = {}) => {
  if (opts.days) {
    opts["max-age"] = opts.days * 60 * 60 * 24;
    delete opts.days;
  }
  opts = Object.entries(opts).reduce(
    (accumulatedStr, [k, v]) => `${accumulatedStr}; ${k}=${v}`,
    ""
  );
  document.cookie = name + "=" + encodeURIComponent(value) + opts;
};

const deleteCookie = (name, opts) => {
  setCookie(name, "", { "max-age": -1, ...opts });
};

export default {
  get: getCookie,
  set: setCookie,
  delete: deleteCookie,
};
