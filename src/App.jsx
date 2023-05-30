import { Loading } from "./components/loading";
import { ApproveRequest } from "./components/approve-request";
import { Form } from "./components/form";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [currentRoute, setCurrentRoute] = useState("loading");

  function handleSuccess() {
    setCurrentRoute("approve-request");
  }

  return (
    <div>
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
          <Loading setCurrentRoute={setCurrentRoute} />
        ) : currentRoute === "form" ? (
          <Form onAutoPayRequest={handleSuccess} />
        ) : currentRoute === "approve-request" ? (
          <ApproveRequest />
        ) : undefined}
      </div>
      <ToastContainer hideProgressBar autoClose={3000} closeOnClick closeButton={false}/>
    </div>
  );
}

export default App;
