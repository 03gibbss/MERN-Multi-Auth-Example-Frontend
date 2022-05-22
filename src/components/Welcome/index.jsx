import React, { useCallback, useContext, useEffect } from "react";
import { UserContext } from "../../context/UserContext";

export default function Welcome() {
  const [userContext, setUserContext] = useContext(UserContext);

  const fetchUserDetails = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/users/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setUserContext((oldValues) => {
          return { ...oldValues, details: data.username };
        });
      } else {
        if (response.status === 401) {
          window.location.reload();
        } else {
          setUserContext((oldValues) => {
            return { ...oldValues, details: null };
          });
        }
      }
    });
  }, [setUserContext, userContext.token]);

  useEffect(() => {
    if (!userContext.details) {
      fetchUserDetails();
    }
  }, [userContext, fetchUserDetails]);

  const logoutHandler = () => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/users/logout`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
      },
    }).then(async (response) => {
      setUserContext((oldValues) => {
        return { ...oldValues, details: undefined, token: null };
      });
      window.localStorage.setItem("logout", Date.now());
    });
  };

  const refetchHandler = () => {
    setUserContext((oldValues) => {
      return { ...oldValues, details: undefined };
    });
  };

  return userContext.details === null ? (
    "Error Loading User details"
  ) : !userContext.details ? (
    <div>Loading...</div>
  ) : (
    <>
      <div>
        <p>
          Welcome&nbsp;
          <strong>{userContext.details}</strong>!
        </p>
      </div>
      <div>
        <button onClick={logoutHandler}>Logout</button>
        <button onClick={refetchHandler}>Refetch</button>
      </div>
    </>
  );
}
