// eslint-disable-next-line
export function validateEmail(email) {
  const re = /.+@.+\..+/i;
  return re.test(String(email).toLowerCase());
}
