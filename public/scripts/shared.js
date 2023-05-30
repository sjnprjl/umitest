//utils
export const createListElement = (title = "", value = "") => {
  const li = document.createElement("li");
  li.classList.add(
    "flex",
    "justify-between",
    "items-center",
    "py-3",
    "text-sm",
    "border-b",
    "border-gray-200"
  );
  const p1 = document.createElement("p");
  p1.classList.add("text-ui-gray");
  const p2 = document.createElement("p");

  p1.textContent = title;
  p2.textContent = value;

  li.appendChild(p1);
  li.appendChild(p2);

  return li;
};

/**
 * @description Get remaining approve request time in milliseconds if the difference in time is greater than 0 else return false
 * @returns number | false
 * @param null
 */
export const getApproveTimerInMilliSeconds = () => {
  const subscriptionValidUpto = new Date(localStorage.getItem("subscription_valid_upto"));
  const approveStartDateAddedTime = new Date(localStorage.getItem('approve_start_date'));
  approveStartDateAddedTime.setMinutes(approveStartDateAddedTime.getMinutes() + 15);
  
  // Comparing time against indian standard time
  const currentDateTime = new Date(new Date().toString());
  const currentDateTimeIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }).toString());
  
  if (!subscriptionValidUpto || !approveStartDateAddedTime) return false;

  const differenceInMilliSecondsUsingSubscriptionTime = 
    Math.floor(subscriptionValidUpto - currentDateTimeIST);
  
  const differenceInMilliSecondsUsingApproveStartTime = Math.floor(approveStartDateAddedTime - currentDateTime);

  // If approve_start_date is used previously
  if(localStorage.getItem('used_approve_timer')){
    if(differenceInMilliSecondsUsingApproveStartTime < 0) return false;
    return differenceInMilliSecondsUsingApproveStartTime;
  }

  // Giving Maximum of 15 minutes for approve time
  if(differenceInMilliSecondsUsingSubscriptionTime > 15 * 60000){
    localStorage.setItem('used_approve_timer', true);
    if(differenceInMilliSecondsUsingApproveStartTime < 0) return false;
    return differenceInMilliSecondsUsingApproveStartTime;
  }else{
    if(differenceInMilliSecondsUsingSubscriptionTime < 0) return false;
    return differenceInMilliSecondsUsingSubscriptionTime;
  }
};

export const getSearchDataFromUrl = (key) => {
  const url = new URLSearchParams(window.location.search);
  if(!url.get(key)) return null;
  const encodedSearchData = atob(url.get(key));
  const decoded = decodeURIComponent(encodedSearchData || "");
  let value= {};
  try {
    value = JSON.parse(decoded);
  } catch (error) {
    console.error(error);
  }
  return value;
};

export const stringifyForUrl = (data) => {
  return btoa(encodeURIComponent(JSON.stringify((data))));
};