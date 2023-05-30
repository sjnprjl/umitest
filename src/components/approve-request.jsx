import { useEffect } from "react";
import { useCountdown } from "../hooks/useCountdown";
import { formatTime } from "../utils";

const MAX_COUNTDOWN = 15 * 60; // 15 minutes
export function ApproveRequest() {
  const { time, setIsActive } = useCountdown(MAX_COUNTDOWN);
  useEffect(() => {
    setIsActive(true);
  }, [setIsActive]);

  useEffect(() => {
    if (time <= 0) setIsActive(false);
  }, [time, setIsActive]);

  return (
    <div className="rounded-2xl bg-transparent-black p-9 shadow-lg max-w-md">
      <header>
        <h1 className="text-lg font-semibold text-black">Approve Request</h1>
        <h2 className="mt-3 text-ui-gray text-sm">
          An Autopay request is sent to the UPI app. Please approve to get
          started with Loan Repayment
        </h2>
      </header>
      <section className="mt-4">
        <header className="flex gap-x-2">
          <div className="pt-1">
            <img src="icons/green-check.svg" alt="green-check" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-black">
              Autopay Request
            </h2>
            <p id="vpa" className="text-ui-gray text-xs font-normal">
              Sent to
            </p>
          </div>
        </header>
      </section>
      <section className="mt-8">
        <div className="bg-white rounded-t-xl">
          <h3 className="py-2 px-4 font-semibold text-sm text-ui-gray">
            Steps to approve
          </h3>
          <ul className="px-4 bg-gray-100 bg-opacity-50 text-sm font-normal">
            <li className="px-2 py-4 gap-x-2 flex">
              <span className="w-6 h-6 mr-3 inline-grid place-items-center bg-ui-light rounded-full">
                1
              </span>
              <div className="w-64">
                Open <span className="font-bold">UPI APP</span> on your phone
              </div>
            </li>
            <li className="px-2 py-4 gap-x-2 flex">
              <span className="w-6 h-6 mr-3 inline-grid place-items-center bg-ui-light rounded-full">
                2
              </span>
              <div className="w-64">
                Tap on <span className="font-bold">Notifications</span>
              </div>
            </li>
            <li className="px-2 py-4 gap-x-2 flex">
              <span className="w-6 h-6 mr-3 inline-grid place-items-center bg-ui-light rounded-full">
                3
              </span>
              <div className="w-64">
                Approve the pending Autopay request from{" "}
                <span className="font-bold">LenDenClub</span>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <footer className="mt-8">
        <div className="w-full h-1 bg-ui-gray rounded-full">
          <div
            id="progress"
            style={{ width: (time / MAX_COUNTDOWN) * 100 + "%" }}
            className="h-full bg-ui-primary transition-all"
          ></div>
        </div>
        <div className="mt-4 text-sm font-normal text-center">
          <span>Time Remaining: {formatTime(time)}</span>
          <span id="timer"></span>
        </div>
      </footer>
    </div>
  );
}
