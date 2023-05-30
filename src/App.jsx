import { Loading } from "./components/loading";
import { ApproveRequest } from "./components/approve-request";
import { Form } from "./components/form";
import { useEffect, useState } from "react";

function App() {
  const [currentRoute, setCurrentRoute] = useState("loading");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentRoute("form");
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);
  function handleSuccess() {
    setCurrentRoute("approve-request");
  }

  return (
    <>
      <div className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center px-8 py-4">
          <img
            src="icons/new-logo-ldc.png.webp"
            alt="Logo"
            className="h-5 md:h-7"
          />
        </div>
      </div>
      <div
        className="bg-gradient w-full min-h-screen py-8 flex justify-center items-center"
        style={{ minHeight: "calc(100vh - 60px)" }}
      >
        {currentRoute === "loading" ? (
          <Loading />
        ) : currentRoute === "form" ? (
          <Form onAutoPayRequest={handleSuccess} />
        ) : currentRoute === "approve-request" ? (
          <ApproveRequest />
        ) : undefined}
      </div>
    </>
  );
}

export default App;
