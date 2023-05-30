import { fetchJSONWithToken, parseErrorMessage } from "./api.js";
import { ObservableStore } from "./observer.js";
import {  getApproveTimerInMilliSeconds, stringifyForUrl } from "./shared.js";
import { toast } from "./toast.js";

const timer = document.querySelector("#timer");
const progressBar = document.querySelector("#progress");
const auth_request_id = localStorage.getItem("auth_request_id");
const vpaElement = document.querySelector("#vpa");

if (!auth_request_id) {
  window.location.href = "/index";
}else {
  if(getApproveTimerInMilliSeconds() < 10000){
    toast("Autopay request sent successfully.")
  }
}

const MILLISECONDS = getApproveTimerInMilliSeconds() ?? 0;

const formatMilliSeconds = (milliseconds = 0) => {
  const minutes = Math.floor(milliseconds / 1000 / 60);
  const seconds = Math.floor((milliseconds / 1000) % 60);
  //padd seconds with 0
  const paddedSeconds = String(seconds).padStart(2, "0");
  return `${minutes} : ${paddedSeconds}`;
};

const millisecondsStore = new ObservableStore(MILLISECONDS);
const vpa = localStorage.getItem("vpa");
vpaElement.textContent = `Sent to ${vpa}`;

let intervalId = null;

const redirectUrl = localStorage.getItem("redirectUrl");
const source = localStorage.getItem("source");
const trackingId = localStorage.getItem("trackingId");

const poll = () => {
  fetchJSONWithToken(
    `/mandate-auth-request-status?auth_request_id=${auth_request_id}`
  )
    .then((res) => {
      const data = typeof res === "object" && "data" in res ? res.data : null;
      if (!data) {
        throw new Error("Invalid response");
      }
      const state = res?.data?.transaction_details?.transaction_state;
      if (!state) {
        throw new Error("Invalid response");
      }
      
      switch (state) {
        case "COMPLETED":
          localStorage.setItem('subscription_id', res?.data?.subscription_details?.subscription_id);
          localStorage.setItem('redirect_url', res?.data?.redirect_url);
          localStorage.removeItem('subscription_valid_upto');
          localStorage.removeItem('approve_start_date');
          localStorage.removeItem('used_approve_timer');
          window.location.href = `${redirectUrl}?status=success&tracking_id=${trackingId}&source=${source}`;
          break;
        case "FAILED":
          localStorage.setItem('subscription_id', res?.data?.subscription_details?.subscription_id);
          localStorage.setItem('redirect_url', res?.data?.redirect_url);
          localStorage.removeItem('subscription_valid_upto');
          localStorage.removeItem('approve_start_date');
          localStorage.removeItem('used_approve_timer');
          window.location.href = `${redirectUrl}?status=failure&tracking_id=${trackingId}&source=${source}`;
          break;
        default:
          setTimeout(poll, 3 * 1000);
          break;
      }
    })
    .catch((err) => { 
      if(err?.code === 4015 || err instanceof NetworkError){
        setTimeout(poll, 3 * 1000);
      }else{
        window.location.href = `${redirectUrl}?status=failure&tracking_id=${trackingId}&source=${source}`;
      }
    });
};

poll();

const startTimer = () => {
  intervalId = setInterval(() => {
    millisecondsStore.setState((state) => state - 1000);
  }, 1000);
};

const stopTimer = () => {
  clearInterval(intervalId);
};

const render = () => {
  const time = millisecondsStore.getState();
  const formattedTime = formatMilliSeconds(time);
  timer.textContent = formattedTime;
  progressBar.style.width = `${(time / MILLISECONDS) * 100}%`;
};

millisecondsStore.subscribe(render);
millisecondsStore.subscribe((state) => {
  if (state <= 0) {
    stopTimer();
    localStorage.removeItem('approve_start_date');
    window.location.href = `${redirectUrl}?status=failure&tracking_id=${trackingId}&source=${source}`;
  }
});

startTimer();

if(window.history && history.pushState){ // check for history api support
	window.addEventListener('load', function(){
		// create history states
		history.pushState(-1, null); // back state
		history.pushState(0, null); // main state
		history.pushState(1, null); // forward state
		history.go(-1); // start in main state
				
		this.addEventListener('popstate', function(event, state){
			// check history state and fire custom events
			if(state = event.state){
	
				event = document.createEvent('Event');
				event.initEvent(state > 0 ? 'next' : 'previous', true, true);
				this.dispatchEvent(event);
				
				// reset state
				history.go(-state);
			}
		}, false);
	}, false);
}

window.addEventListener('previous', function(){
  millisecondsStore.subscribe((state) => {
    if(state > 0){
      window.location.href = `/redirect?token=${localStorage.getItem("token")}`;
    }else{
      stopTimer();
      localStorage.removeItem('approve_start_date');
      window.location.href = `${redirectUrl}?status=failure&tracking_id=${trackingId}&source=${source}`;
    }
  });
}, false);