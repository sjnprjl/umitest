import { useState } from "react";
import { verifyUpiID } from "../api";
import { Loader } from "./loader";
export function Form(props) {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allowAutoPayRequest, setAutoPayRequest] = useState(false);
  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    verifyUpiID().then(
      (res) => (setVerified(res), setAutoPayRequest(true), setLoading(false))
    );
  }

  function handleAutoPayRequest() {
    setLoading(true);
    verifyUpiID().then(
      (res) => (setLoading(false), props?.onAutoPayRequest?.(true))
    );
  }

  return (
    <>
      {loading && <Loader />}
      <div className="rounded-2xl bg-transparent-black p-9 shadow-lg max-w-md">
        <header>
          <h1 className="text-lg font-semibold text-black">Autopay Setup</h1>
          <h2 className="mt-3 text-ui-gray text-sm">
            Please setup Autopay for your Loan Repayment with UPI
          </h2>
        </header>
        <section className="mt-6">
          <form onSubmit={handleSubmit}>
            <div>
              <div className="relative mb-4">
                <h3 className="text-ui-gray text-sm pb-2">UPI ID</h3>
                <input
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
                      className="px-4 py-2 btn block w-full text-sm font-bold"
                    >
                      Verify
                    </button>
                  )}
                </div>
                <div className="absolute top-[110%] right-0 left-0 h-[2px] bg-ui-gray peer-focus/upiIdInput:bg-blue-500"></div>
              </div>
              <div className="text-ui-gray text-xs mt-1" id="upiIdMessage">
                A payment request will be sent to this UPI ID
              </div>
            </div>
          </form>
        </section>
        <footer className="mt-11">
          <div className="flex items-center gap-x-3 hidden">
            <input
              type="checkbox"
              name="autopay"
              id="autopay"
              className="accent-ui-primary scale-150 translate-x-1 mr-2"
            />
            <label htmlFor="autopay" className="text-ui-gray text-sm">
              You are setting up a UPI AutoPay Mandate creation.
            </label>
          </div>
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
