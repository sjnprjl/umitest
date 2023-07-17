import { useEffect, useMemo, useState } from "react";
import { fetchJSONWithToken, parseErrorMessage } from "../api";
import { Loader } from "./loader";
import { getAppUrlParamsFromLs } from "../utils";
import { SharedStorage } from "../utils/SharedStorage";
import { toast } from "react-toastify";

export function Form(props) {
  const [upiId, setUpiId] = useState("");
  const [upiIdMessage, setUpiIdMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allowAutoPayRequest, setAutoPayRequest] = useState(false);
  const [disableVerifyButton, setDisableVerifyButton] = useState(true);

  useEffect(() => {
    if (upiId.length > 0) {
      setDisableVerifyButton(false);
    } else {
      setDisableVerifyButton(true);
    }
  }, [upiId]);

  const appUrlParams = getAppUrlParamsFromLs();
  const sharedStorage = useMemo(() => new SharedStorage(), []);

  function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    fetchJSONWithToken(`/mandate-vpa-verify/?vpa=${upiId}`)
      .then(() => {
        setVerified(true);
        setAutoPayRequest(true);

        setUpiIdMessage("A payment request will be sent to this UPI ID");
      })
      .catch((data) => {
        if (data.code === "4005") {
          window.location.href = `${appUrlParams.redirectUrl}?status=failure&tracking_id=${appUrlParams.trackingId}&source=${appUrlParams.source}&reason=token_expired`;
          return;
        }

        setVerified(false);
        setAutoPayRequest(false);

        setUpiIdMessage(data.message);
        toast(parseErrorMessage(data));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleAutoPayRequest() {
    setLoading(true);

    fetchJSONWithToken("/set-mandate/", {
      body: JSON.stringify({
        vpa: upiId,
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (typeof res !== "object") {
          throw new Error("Invalid response");
        }
        if (!res.data) {
          throw new Error("Invalid response");
        }
        if (!res.data["auth_request_id"]) {
          throw new Error("Invalid response");
        }

        const currentDate = new Date();
        sharedStorage.setAuthRequestId(res.data.auth_request_id);
        sharedStorage.setVpa(upiId);
        sharedStorage.setApproveStartDate(currentDate.toString());

        setLoading(false);
        props.setCurrentRoute("approve-request");
      })
      .catch((err) => {
        if (err.code === "4005") {
          window.location.href = `${appUrlParams.redirectUrl}?status=failure&tracking_id=${appUrlParams.trackingId}&source=${appUrlParams.source}&reason=token_expired`;
          return;
        }
        
        setLoading(false);
        toast(parseErrorMessage(err));
      });
  }

  return (
    <>
      {loading && <Loader />}
      <div className="rounded-2xl bg-transparent-black p-9 shadow-lg max-w-md">
        <header>
          <h1 className="text-lg font-semibold text-black">Autopay Setup</h1>
          <h2 className="mt-3 text-ui-gray text-sm">
            Please setup Autopay for your{" "}
            {appUrlParams.source === "sip"
              ? "Systematic Investment"
              : "Loan Repayment"}{" "}
            with UPI.
          </h2>
        </header>
        <section className="mt-6">
          <form onSubmit={handleSubmit}>
            <div>
              <div className="relative mb-4">
                <h3 className="text-ui-gray text-sm pb-2">UPI ID</h3>
                <input
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  id="upiIdInput"
                  className="peer/upiIdInput w-9/12 bg-transparent hover:border-none border-none active:border-none focus:border-none hover:outline-none active:outline-none focus:outline-none"
                />
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  {verified ? (
                    <img
                      id="verifiedIcon"
                      className="px-4"
                      src="icons/green-check.svg"
                      alt="green check"
                    />
                  ) : (
                    <button
                      id="verifyUPIButton"
                      disabled={disableVerifyButton}
                      className="px-4 py-2 btn block w-full text-sm font-bold"
                    >
                      Verify
                    </button>
                  )}
                </div>
                <div className="absolute top-[110%] right-0 left-0 h-[2px] bg-ui-gray peer-focus/upiIdInput:bg-blue-500"></div>
              </div>
              <div className="text-ui-gray text-xs mt-1" id="upiIdMessage">
                {upiIdMessage
                  ? upiIdMessage
                  : "A payment request will be sent to this UPI ID"}
              </div>
            </div>
          </form>
        </section>
        <footer className="mt-11">
          <button
            disabled={!allowAutoPayRequest}
            onClick={handleAutoPayRequest}
            id="autopayButton"
            className="btn block mt-4 w-full py-3"
          >
            Send AutoPay Request
          </button>
        </footer>
      </div>
    </>
  );
}
