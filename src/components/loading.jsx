import { fetchJSONWithToken } from "../api";
import { useEffect, useMemo } from "react";
import { getApproveTimerInMilliSeconds, setAppUrlParamsToLs } from "../utils";
import { getAppUrlParamsFromUrl } from "../utils";
import styles from "./loading.module.css";
import { SharedStorage } from "../utils/SharedStorage";
import { toast } from "react-toastify";

export function Loading(props) {
  const { setCurrentRoute } = props;
  const sharedStorage = useMemo(() => new SharedStorage(), []);

  useEffect(() => {
    const appUrlParams = getAppUrlParamsFromUrl();

    if (
      appUrlParams.token &&
      appUrlParams.redirectUrl &&
      appUrlParams.source &&
      appUrlParams.trackingId
    ) {

      const storageToken = sharedStorage.getToken();
      if (storageToken && storageToken !== appUrlParams.token) {
        localStorage.clear();
      }

      setAppUrlParamsToLs({
        token: appUrlParams.token,
        redirectUrl: appUrlParams.redirectUrl,
        source: appUrlParams.source,
        trackingId: appUrlParams.trackingId,
      });

      fetchJSONWithToken("/get-subscription-details")
        .then((data) => {
          if (!data.data) {
            throw new Error("Invalid data");
          }
          const details = data.data;
          if (typeof details !== "object") {
            throw new Error("Invalid data");
          }

          sharedStorage.setSubscriptionValidUpto(
            details["subscription_valid_upto"]
          );

          setTimeout(function () {
            if (
              getApproveTimerInMilliSeconds() < 15 * 60000 &&
              sharedStorage.getApproveStartDate()
            ) {
              setCurrentRoute("approve-request");
            } else {
              setCurrentRoute("form");
            }
          }, 2000);
        })
        .catch(() => {
          window.location.href = `${appUrlParams.redirectUrl}?status=failure&tracking_id=${appUrlParams.trackingId}&source=${appUrlParams.source}`;
        });
    } else {
        toast("Invalid URL Entered!");
    }
  }, [setCurrentRoute, sharedStorage]);

  return (
    <div
      className={
        "flex flex-col items-center justify-center h-screen w-screen " +
        styles["container"]
      }
    >
      <div className="text-center text-xl mb-5">
        {"You are being redirected to "}
        <span className="font-bold">{"LenDenClub's"}</span>
        <p>{"website for AutoPay Setup"}</p>
      </div>
      <div className={styles["loader"]}></div>
      <div className="flex justify-center mt-5 text-xl">
        <div className="text-center font-bold">
          {"Please do not close or leave this page"}
        </div>
      </div>
    </div>
  );
}
