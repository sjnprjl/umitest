import { fetchJSONWithToken, parseErrorMessage } from "./api.js";
import { getApproveTimerInMilliSeconds, stringifyForUrl } from "./shared.js";

//seach param token
const urlParams = new URLSearchParams(
  window.location.search.replace("?source", "&source")
);
const token = urlParams.get("token");
const redirectUrl = urlParams.get("redirect_url");
const source = urlParams.get("source");
const trackingId = urlParams.get("tracking_id");
const localStorageToken = localStorage.getItem("token");

console.log(token, redirectUrl, source, trackingId, localStorageToken);

if ((token || localStorageToken) && redirectUrl && source && trackingId) {
  // ! Store/Change token in LC
  if (token) {
    if (localStorageToken && localStorageToken !== token) {
      localStorage.clear();
    }
    localStorage.setItem("token", token);
  }

  localStorage.setItem("redirectUrl", redirectUrl);
  localStorage.setItem("source", source);
  localStorage.setItem("trackingId", trackingId);

  fetchJSONWithToken("/get-subscription-details")
    .then((data) => {
      if (!"data" in data) {
        throw new Error("Invalid data");
      }
      const details = data.data;
      if (typeof details !== "object") {
        throw new Error("Invalid data");
      }

      localStorage.setItem(
        "subscription_valid_upto",
        details["subscription_valid_upto"]
      );

      setTimeout(function () {
        if (
          getApproveTimerInMilliSeconds() < 15 * 60000 &&
          localStorage.getItem("approve_start_date")
        ) {
          window.location.href = "/approve-request";
        } else {
          window.location.href = `/index?token=${localStorage.getItem(
            "token"
          )}`;
        }
      }, 2000);
    })
    .catch((err) => {
      window.location.href = `${redirectUrl}?status=failure&tracking_id=${trackingId}&source=${source}`;
    });
} else {
  if (
    getApproveTimerInMilliSeconds() < 15 * 60000 &&
    localStorage.getItem("approve_start_date")
  ) {
    setTimeout(function () {
      window.location.href = "/approve-request";
    }, 2000);
  } else {
    window.location.href = `${redirectUrl}?status=failure&tracking_id=${trackingId}&source=${source}`;
  }
}
