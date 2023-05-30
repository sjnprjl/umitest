import { ObservableStore } from "./observer.js";
import { createListElement } from "./shared.js";
import { fetchJSONWithToken, parseErrorMessage } from "./api.js";
import { toast } from "./toast.js";
import { Loader } from "./loader.js";

const detailsElement = document.getElementById("details");
const nextLinkElement = document.getElementById("next");

const link = `${localStorage?.getItem?.(
  "redirect_url"
)}?subscription_id=${localStorage?.getItem?.(
  "subscription_id"
)}&status=success&type=upi_mandate`;
nextLinkElement.setAttribute("href", link);

const detailsListState = new ObservableStore([]);

detailsListState.subscribe((state) => {
  detailsElement.innerHTML = "";
  state.forEach((item) => {
    const listElement = createListElement(item.label, item.value);
    detailsElement.appendChild(listElement);
  });
});

// detailsListState.setState(DATA);
const loader = new Loader();
loader.show();
fetchJSONWithToken("/get-subscription-details")
  .then((data) => {
    if (!"data" in data) {
      throw new Error("Invalid data");
    }
    const details = data.data;
    if (typeof details !== "object") {
      throw new Error("Invalid data");
    }
    const toDisplay = [];
    if ("first_deduction_amount" in details) {
      toDisplay.push({
        label: "Installment Amount",
        value: "₹ " + details.first_deduction_amount / 100,
      });
    }
    if ("frequency" in details) {
      toDisplay.push({
        label: "Installment Type",
        value: details.frequency,
      });

      if (details.frequency !== "ON_DEMAND") {
        if ("recurring_count" in details) {
          toDisplay.push({
            label: "Installment Count",
            value: details.recurring_count,
          });
        }
      }
    }

    if ("max_amount" in details) {
      toDisplay.push({
        label: "Maximum Amount",
        value: "₹ " + details.max_amount / 100,
      });
    }
    detailsListState.setState(toDisplay);
  })
  .catch((err) => {
    toast(parseErrorMessage(err));
  })
  .finally(() => {
    loader.hide();
  });
