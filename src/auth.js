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
  return user ? user.verifiedEmail == 1 : false;
}

export function isUserAdmin() {
  const user = getUser();
  // noinspection JSUnresolvedVariable,EqualityComparisonWithCoercionJS
  return user ? user.verifiedEmail == 1 && user.isAdmin == 1 : false;
}

export function canUserEditUsersData(userId) {
  return isUserAdmin() || (isUserVerified() && getUserId() === userId);
}

export function sendVerificationEmail(userId, resetPassword) {
  return callApi("/auth/sendVerificationEmail.php", { userId, resetPassword });
}

export async function verifyEmail(code) {
  try {
    const response = await callApi("/auth/verifyEmail.php", { code }, true);
    const { userId } = response;
    setUser(userId);
    return userId;
  } catch (exception) {
    return null;
  }
}
