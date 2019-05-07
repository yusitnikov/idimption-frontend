import { getState, callApi, setUser } from "./storeProxy";
import { getRowById } from "./EntityHelper";

export function getUserId() {
  return getState().userId;
}

export function getUser() {
  return getRowById("user", getUserId());
}

export function isUserVerified() {
  const user = getUser();
  // noinspection JSUnresolvedVariable,EqualityComparisonWithCoercionJS
  return user ? user.verifiedEmail : false;
}

export function isUserAdmin() {
  const user = getUser();
  // noinspection JSUnresolvedVariable,EqualityComparisonWithCoercionJS
  return user ? user.verifiedEmail && user.isAdmin : false;
}

export function canUserEditUsersData(userId) {
  return isUserAdmin() || (isUserVerified() && getUserId() === userId);
}

export function sendVerificationEmail(email, resetPassword) {
  return callApi("/auth/sendVerificationEmail.php", { email, resetPassword });
}

export async function verifyEmail(code) {
  try {
    const response = await callApi("/auth/verifyEmail.php", { code }, true);
    const { userId, verifiedNow } = response;
    setUser(userId);
    return { userId, verifiedNow };
  } catch (exception) {
    return null;
  }
}
