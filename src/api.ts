import { SharedStorage } from "./utils/SharedStorage";

export async function verifyUpiID() {
  return pSetTimeout(() => true, 5000);
}

function pSetTimeout(cb, time) {
  return new Promise((res, _) => {
    setTimeout(() => {
      res(cb());
    }, time);
  });
}

//@ts-check

// const BASEURL = `${window.location.origin}/apis/v1`;
const BASEURL = `https://umitesting.lendenclub.com/apis/v1`;

/**
 * @param {string} url
 * @param {RequestInit=} options
 */
export const fetchJSON = async (url, options) => {
  try {
    const response = await fetch(BASEURL + url, options);
    if (!String(response.status).startsWith("2")) {
      throw response;
    }
    return response.json();
  } catch (error) {
    if (error instanceof Response) {
      const data = await error.json();
      throw data;
    }
    throw error;
  }
};

/**
 * @param {string} url
 * @param {RequestInit=} options
 */
export const fetchJSONWithToken = (url, options) => {
  const sharedStorage = new SharedStorage();
  const OPTIONS = {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Token ${sharedStorage.getToken()}`,
    },
  };
  return fetchJSON(url, OPTIONS);
};

export const parseErrorMessage = error => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }
  return "Something went wrong";
};
