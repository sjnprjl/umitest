//imports
import { fetchJSON, fetchJSONWithToken, parseErrorMessage } from "./api.js";
import { ObservableStore } from "./observer.js";
import { createListElement, stringifyForUrl } from "./shared.js";
import { toast } from "./toast.js";
import { Loader } from "./loader.js";

//elements
const upiIdForm = document.getElementById("upiId");
const details = document.getElementById("details");
const autoPayCheckbox = document.getElementById("autopay");
const autoPayButton = document.getElementById("autopayButton");
const verifyUPIButton = document.getElementById("verifyUPIButton");
const verifiedIcon = document.getElementById("verifiedIcon");
const upiIdInput = document.getElementById("upiIdInput");
// const upiIdSelect = document.getElementById("upiIdSelect");
const upiIdMessage = document.getElementById("upiIdMessage");
// const upiIdDiv = document.getElementById("upiIdDiv");
const installmentAmountElement = document.getElementById("installmentAmount");

//initial setters
autoPayCheckbox.checked = false;
autoPayButton.setAttribute("disabled", "true");
verifiedIcon.classList.add("hidden");
autoPayCheckbox.setAttribute("disabled", "true");
if(!upiIdInput.value){
  verifyUPIButton.classList.add("cursor-not-allowed");
  verifyUPIButton.setAttribute("disabled", "true");
}

//seach param token
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");
localStorage.setItem("token", token);

const redirectUrl = localStorage.getItem("redirectUrl");
const source = localStorage.getItem("source");
const trackingId = localStorage.getItem("trackingId");

//stores
const verifiedState = new ObservableStore(false);
const upiIdState = new ObservableStore("");
// const vpaHandleState = new ObservableStore("@ybl");
const autoPayState = new ObservableStore(false);
const detailsListData = new ObservableStore([]);

//subscribers
verifiedState.subscribe((state) => {
  if (state) {
    verifiedIcon.classList.remove("hidden");
    verifyUPIButton.classList.add("hidden");
    autoPayCheckbox.removeAttribute("disabled");
    return;
  }
  verifiedIcon.classList.add("hidden");
  verifyUPIButton.classList.remove("hidden");
  autoPayCheckbox.checked = false;
  autoPayButton.setAttribute("disabled", "true");
});

//event handlers
const handleUPIIdChange = (e) => {
  verifyUPIButton.classList.remove("hidden");
  upiIdState.setState(e.target.value);
  autoPayState.setState(false);
};

// const handleVpaHandleChange = (e) => {
//   vpaHandleState.setState(e.target.value);
//   autoPayState.setState(false);
// }

const handleUpiIdSubmit = (e) => {
  e.preventDefault();
  if(!upiIdInput.value){
    return;
  }

  const initialText = verifyUPIButton.innerText;
  const loader = new Loader();
  verifyUPIButton.innerText = "Verifying...";
  loader.show();
  fetchJSONWithToken(`/mandate-vpa-verify?vpa=${upiIdState.getState()}`)
    .then(() => {
      verifiedState.setState(true);
      autoPayState.setState(true);
      // upiIdDiv.classList.remove('border-red-400')
      // upiIdDiv.classList.add('border-white')
      upiIdMessage.classList.remove('text-red-400')
      upiIdMessage.classList.add('text-ui-gray')
      upiIdMessage.innerText = "A payment request will be sent to this UPI ID"
    })
    .catch((data) => {
      if(data.code === "4005"){
        window.location.href = `${redirectUrl}?status=failure&tracking_id=${trackingId}&source=${source}`;
        return;
      }

      verifiedState.setState(false);
      autoPayState.setState(false);
      // upiIdDiv.classList.remove('border-white')
      // upiIdDiv.classList.add('border-red-400')
      upiIdMessage.classList.remove('text-ui-gray')
      upiIdMessage.classList.add('text-red-400')
      upiIdMessage.innerText = data.message
      toast(parseErrorMessage(data));
    })
    .finally(() => {
      verifyUPIButton.innerText = initialText;
      loader.hide();
    });
};
const handleAutoPayChange = (e) => {
  autoPayState.setState(e.target.checked);
};
const handleAutoPayClick = (e) => {
  const loader = new Loader();
  loader.show();
  fetchJSONWithToken("/set-mandate/", {
    body: JSON.stringify({
      vpa: upiIdState.getState() /*+ vpaHandleState.getState()*/,
    }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!typeof res === "object") {
        throw new Error("Invalid response");
      }
      if (!"data" in res) {
        throw new Error("Invalid response");
      }
      if (!"auth_request_id" in res.data) {
        throw new Error("Invalid response");
      }
      const currentDate = new Date();

      localStorage.setItem("auth_request_id", res.data.auth_request_id);
      localStorage.setItem("vpa", upiIdState.getState());
      localStorage.setItem("approve_start_date", currentDate.toString());
      loader.hide();
      window.location.href = "/approve-request";
    })
    .catch((err) => {
      if(err.code === "4005"){
        window.location.href = `${redirectUrl}?status=failure&tracking_id=${trackingId}&source=${source}`;
        return;
      }

      loader.hide();
      toast(parseErrorMessage(err));
    });
};

//ui listeners
upiIdInput.addEventListener("input", handleUPIIdChange);
// upiIdSelect.addEventListener("input", handleVpaHandleChange);
upiIdForm.addEventListener("submit", handleUpiIdSubmit);
autoPayCheckbox.addEventListener("change", handleAutoPayChange);
autoPayButton.addEventListener("click", handleAutoPayClick);

//binders
autoPayState.subscribe((state) => {
  autoPayCheckbox.checked = state;
});
upiIdState.subscribe((state) => {
  upiIdInput.value = state;
});

//state listeners
upiIdState.subscribe((state) => {
  if (state.length > 0) {
    verifyUPIButton.classList.remove("cursor-not-allowed");
    verifyUPIButton.classList.add("cursor-pointer");
    verifyUPIButton.removeAttribute("disabled");
    verifiedIcon.classList.add("hidden");
    return;
  }
  verifyUPIButton.classList.remove("cursor-pointer");
  verifyUPIButton.classList.add("cursor-not-allowed");
  verifyUPIButton.setAttribute("disabled", "true");
  verifiedIcon.classList.add("hidden");
});

verifiedState.subscribe((state) => {
  if (state) {
    verifyUPIButton.classList.add("hidden");
    verifiedIcon.classList.remove("hidden");
    return;
  }
  verifyUPIButton.classList.remove("hidden");
  verifiedIcon.classList.add("hidden");
});

autoPayState.subscribe((state) => {
  if (state) {
    autoPayButton.removeAttribute("disabled");
    return;
  }
  autoPayButton.setAttribute("disabled", "true");
});

detailsListData.subscribe((state) => {
  details.innerHTML = "";
  state.forEach((item) => {
    const li = createListElement(item.label, item.value);
    details.appendChild(li);
  });
});

//external data setters (preferably from API)
// detailsListData.setState(DATA);
const loader = new Loader();
loader.show();
fetchJSON("/get-subscription-details", {
  headers: {
    Authorization: `Token ${token}`,
  },
})
  .then((data) => {
    if (!"data" in data) {
      throw new Error("Invalid data");
    }
    const details = data.data;
    if (typeof details !== "object") {
      throw new Error("Invalid data");
    }
    // const toDisplay = [];
    // if ("first_deduction_amount" in details) {
    //   toDisplay.push({
    //     label: "Instalment Amount",
    //     value: "₹ " + details.first_deduction_amount,
    //   });
    //   installmentAmountElement.textContent =
    //     "₹ " + details.first_deduction_amount;
    // }
    // if ("frequency" in details) {
    //   toDisplay.push({
    //     label: "Installment Type",
    //     value: details.frequency,
    //   });
    // }
    // if ("recurring_count" in details) {
    //   toDisplay.push({
    //     label: "Installment Count",
    //     value: details.recurring_count,
    //   });
    // }
    // if ("created_dtm" in details) {
    //   toDisplay.push({
    //     label: "Start Date",
    //     value: new Date(details.created_dtm).toLocaleDateString("en-IN"),
    //   });
    // }
    // if ("max_amount" in details) {
    //   toDisplay.push({
    //     label: "Maximum Amount",
    //     value: "₹ " + details.max_amount,
    //   });
    // }
    // detailsListData.setState(toDisplay);
    // upiIdState.setState(details.contact_number)
  })
  .catch((err) => {
    toast(parseErrorMessage(err));
  })
  .finally(() => {
    loader.hide();
  });
