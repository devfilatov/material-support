import CommonStore from "../store/common";

const SERVER_URL = "http://127.0.0.1:8000";
const PERFORM_DELAY = 1000;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const logRequest = (url, method, body) => (status, data) => {
  console.groupCollapsed("[HTTP]", url);
  console.log("Method", method);
  console.log("Body", body);
  console.log("Status", status);
  console.log("Response", data);
  console.groupEnd();
};

const perform = async (url, method, body) => {
  const { token } = CommonStore.getState();
  const logger = logRequest(url, method, body);
  const options = {
    method,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Auth-Token": token,
    },
    body: JSON.stringify(body),
  };

  await sleep(PERFORM_DELAY);
  const response = await fetch(`${SERVER_URL}/${url}`, options);
  const json = await response.json();
  logger(response.status, json);

  if (json.success) return json.data;
  else throw new Error(json.error);
};

const make = (method) => (url, body) => {
  return perform(url, method, body);
};

export default {
  get: make("GET"),
  post: make("POST"),
  put: make("PUT"),
  delete: make("DELETE"),
};
