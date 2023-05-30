const storageKeys = {
  token: "token",
  redirectUrl: "redirect_url",
  source: "source",
  trackingId: "tracking_id",
  subscriptionValidUpto: "subscription_valid_upto",
  approveStartDate: "approve_start_date",
  authRequestId: "auth_request_id",
  vpa: "vpa",
  usedApproveTimer: "used_approve_timer",
};

export class SharedStorage {
  getToken() {
    return localStorage.getItem(storageKeys.token);
  }
  setToken(token) {
    localStorage.setItem(storageKeys.token, token);
  }

  getRedirectUrl() {
    return localStorage.getItem(storageKeys.redirectUrl) ?? "";
  }
  setRedirectUrl(redirectUrl) {
    localStorage.setItem(storageKeys.redirectUrl, redirectUrl);
  }

  getSource() {
    return localStorage.getItem(storageKeys.source);
  }
  setSource(source) {
    localStorage.setItem(storageKeys.source, source);
  }

  getTrackingId() {
    return localStorage.getItem(storageKeys.trackingId);
  }
  setTrackingId(trackingId) {
    localStorage.setItem(storageKeys.trackingId, trackingId);
  }

  getSubscriptionValidUpto() {
    return localStorage.getItem(storageKeys.subscriptionValidUpto);
  }
  setSubscriptionValidUpto(subscriptionValidUpto) {
    localStorage.setItem(storageKeys.subscriptionValidUpto, subscriptionValidUpto);
  }

  getApproveStartDate() {
    return localStorage.getItem(storageKeys.approveStartDate);
  }
  setApproveStartDate(approveStartDate) {
    localStorage.setItem(storageKeys.approveStartDate, approveStartDate);
  }

  getAuthRequestId() {
    return localStorage.getItem(storageKeys.authRequestId);
  }
  setAuthRequestId(authRequestId) {
    localStorage.setItem(storageKeys.authRequestId, authRequestId);
  }

  getVpa() {
    return localStorage.getItem(storageKeys.vpa);
  }
  setVpa(vpa) {
    localStorage.setItem(storageKeys.vpa, vpa);
  }

  getUsedApproveTimer() {
    return localStorage.getItem(storageKeys.usedApproveTimer);
  }
  setUsedApproveTimer(usedApproveTimer) {
    localStorage.setItem(storageKeys.usedApproveTimer, usedApproveTimer);
  }

  clear() {
    localStorage.clear();
  }
}
