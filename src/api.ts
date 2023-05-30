export async function verifyUpiID() {
  return new Promise((res, _) => {
    setTimeout(() => {
      res(true);
    }, 5000);
  });
}
