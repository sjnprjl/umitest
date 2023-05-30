import { getSearchDataFromUrl } from "./shared.js";

// elements
const title = document.getElementById("err-title");
const subtitle = document.getElementById("err-subtitle");
const retryBtn = document.getElementById("retry");
const nextBtn = document.getElementById("next");

const errData = getSearchDataFromUrl("err");
const successData = getSearchDataFromUrl("success");

const redirectUrl = localStorage.getItem("redirectUrl");
const source = localStorage.getItem("source");
const trackingId = localStorage.getItem("trackingId");

if (errData) {
  nextBtn.classList.add("hidden");

  let link;
  if(errData.redirect){
    link = `/redirect?token=${localStorage.getItem("token")}`;
  }else{
    link = `${redirectUrl}?status=failure&tracking_id=${trackingId}&source=${source}`
    // link = `${localStorage?.getItem?.('redirect_url')}?subscription_id=${localStorage?.getItem?.('subscription_id')}&status=failure&type=upi_mandate`;
  }
  retryBtn.setAttribute("href", link);
  
  title.innerText = errData.title ?? "Error";
  subtitle.innerText = errData.subtitle ?? "Some Error Occured";
}

if(successData){
  retryBtn.classList.add("hidden");

  title.innerText = successData.title ?? "Success";
  subtitle.innerText = successData.subtitle ?? "Operation Completed Sucessfully";
  nextBtn.setAttribute("href", successData.link);
}