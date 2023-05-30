import styles from "./loading.module.css";
export function Loading() {
  return (
    <div className={"flex flex-col items-center justify-center h-screen w-screen"}>
      <div className="text-center text-xl mb-5">
        {"You are being redirected to"}
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
