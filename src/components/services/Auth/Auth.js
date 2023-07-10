import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Axios/Axios";

const useLoggedUser = () => {
  const reduxUser = useSelector((store) => store.user);
  const localUser = JSON.parse(localStorage.getItem("QUIZETH"));
  const [user, setUser] = React.useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function getUserById() {
    try {
      const { data } = await axiosInstance.get(`/user/${localUser.id}`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("QUIZETH")).token
          }`,
        },
      });
      if (data.response) {
        dispatch({
          type: "SAVE_USER_DETAILS",
          payload: data.response,
        });
        localStorage.setItem(
          "QUIZETH",
          JSON.stringify({
            id: data.response._id,
            token: data.response.token,
            ...(data.response.role && { role: data.response.role }),
          })
        );
        setUser(data.response);
      }
    } catch (err) {
      console.log(err.response);
      navigate("/login");
    }
  }

  React.useEffect(() => {
    if (reduxUser?._id && reduxUser?.token) {
      setUser(reduxUser);
    } else if (localUser?.id && localUser?.token) {
      getUserById();
    } else {
      navigate("/login");
    }
  }, []);

  return { user, getUserById };
};

export default useLoggedUser;
