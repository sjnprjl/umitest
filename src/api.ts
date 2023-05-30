export async function verifyUpiID() {
  return pSetTimeout(() => true, 5000);
}

function pSetTimeout(cb, time) {
  return new Promise((res, _) => {
    setTimeout(() => {
      res(cb());
    }, time);
  });
}
