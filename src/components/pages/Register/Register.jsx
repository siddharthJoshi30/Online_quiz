import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/Axios/Axios";
import { MDBContainer, MDBCol, MDBRow, MDBInput } from "mdb-react-ui-kit";

const initState = {
  username: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const [state, setState] = useState(initState);
  const [message, setMessage] = useState("");
  const { username, password, confirmPassword } = state;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(username)) {
      return setMessage("Invalid email address!");
    }

    if (password !== confirmPassword) {
      return setMessage("Passwords must be the same!");
    }

    try {
      const { data } = await axiosInstance.post("/auth/register", {
        username,
        password,
      });
      if (data.response && data.response._id && data.response.token) {
        setMessage("");
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
        navigate("/");
      }
    } catch (err) {
      console.log(err.response.data?.message);
      setMessage(err.response.data?.message);
    }
  };

  return (
    <MDBContainer fluid className="p-3 my-5">
      <MDBRow>
        <MDBCol col="10" md="6">
          <img
            src="https://images.unsplash.com/photo-1620428268482-cf1851a36764?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=809&q=80"
            className="img-fluid"
            alt="phone"
          />
        </MDBCol>

        <MDBCol col="4" md="6">
          <Form onSubmit={handleSubmit}>
            <MDBInput
              wrapperClass="mb-4"
              placeholder="Email address"
              id="formControlLg"
              type="email"
              size="lg"
              value={username}
              style={{ border: "2px solid black", borderRadius: "10px" }}
              onChange={(e) => setState({ ...state, username: e.target.value })}
            />
            <MDBInput
              wrapperClass="mb-4"
              placeholder="Password"
              id="formControlLg"
              type="password"
              size="lg"
              value={password}
              style={{ border: "2px solid black", borderRadius: "10px" }}
              onChange={(e) => setState({ ...state, password: e.target.value })}
            />
            <MDBInput
              wrapperClass="mb-4"
              placeholder="Confirm Password"
              id="formControlLg"
              type="password"
              size="lg"
              style={{ border: "2px solid black", borderRadius: "10px" }}
              value={confirmPassword}
              onChange={(e) =>
                setState({ ...state, confirmPassword: e.target.value })
              }
            />

            <div style={{ color: "red" }}>{message}</div>

            <Button className="mb-4 w-100" size="lg" onClick={handleSubmit}>
              <span style={{ fontSize: "21px" }}>Register</span>
            </Button>
            <p>
              Already have an account ?{" "}
              <NavLink
                to="/login"
                style={{ color: "red", textDecoration: "none" }}
              >
                LOGIN
              </NavLink>
            </p>
          </Form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Register;
