import AsyncStorage from "@react-native-async-storage/async-storage";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOG_OUT = "LOG_OUT";

let timer;
const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

export const authenticate = (token, userId, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({
      type: AUTHENTICATE,
      token: token,
      userId: userId,
    });
  };
};
const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
        }
      );

      if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        console.log(errorId);
        let message = "Something went wrong with logging in!";
        if (errorId === "EMAIL_NOT_FOUND") {
          message = "This email could not be found!";
        } else if (errorId === "INVALID_PASSWORD") {
          message = "This password is not valid!";
        }
        throw new Error(message);
      }
      const resData = await response.json(); 
      console.log("resData.expiresIn", resData.expiresIn);

      dispatch(
        authenticate(
          resData.idToken,
          resData.localId,
          parseInt(resData.expiresIn) * 1000
        )
      );
      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expiresIn) * 1000
      );
      saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    } catch (error) {
      throw error;
    }
  };
};

export const signup = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = "Something went wrong with logging in!";
      if (errorId === "EMAIL_EXISTS") {
        message = "This email already exists!";
      }
      throw new Error(message);
    }

    const resData = await response.json(); 
    dispatch(
      authenticate(
        resData.idToken,
        resData.localId,
        parseInt(resData.expiresIn) * 1000
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, expirationDate);
  };
};
export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOG_OUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};
