import React from "react";
import "./header.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Container, NavLink } from "react-bootstrap";
import { FaSignOutAlt, FaTrophy } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { _id, role = "" } = useSelector((store) => store.user || {});
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch({
      type: "RESET_USER_DETAILS",
    });
    localStorage.removeItem("QUIZETH");
    navigate("/login");
  };
  return (
    <header>
      <Navbar
        bg="black"
        variant="dark"
        expand="md"
        collapseOnSelect
        className="navbar"
      >
        <Container className="p-0">
          <LinkContainer to="/">
            <Navbar.Brand>
              <span style={{ fontSize: "30px", color: "lime" }}>QUIZETH</span>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="">
            {_id ? (
              <Nav className="justify-content-end" style={{ flex: 1 }}>
                <LinkContainer
                  exact
                  to="/"
                  style={{ marginRight: "1.0rem", fontSize: "20px" }}
                >
                  <Nav.Link active={location.pathname === "/"}>
                    <span>Home</span>{" "}
                  </Nav.Link>
                </LinkContainer>
                {role?.toUpperCase() === "ADMIN" && (
                  <LinkContainer
                    exact
                    to="/quiz/new-update"
                    style={{ marginRight: "1.0rem", fontSize: "20px" }}
                  >
                    <Nav.Link active={location.pathname === "/quiz/new-update"}>
                      Quiz <FaEdit />
                    </Nav.Link>
                  </LinkContainer>
                )}
                <LinkContainer
                  exact
                  to="/leaderboard"
                  style={{ marginRight: "1.0rem", fontSize: "20px" }}
                >
                  <Nav.Link active={location.pathname === "/leaderboard"}>
                    <span>Rank </span>
                    <FaTrophy />
                  </Nav.Link>
                </LinkContainer>
                <NavLink
                  onClick={handleLogout}
                  style={{ marginRight: "1.0rem", fontSize: "20px" }}
                >
                  <FaSignOutAlt />
                </NavLink>
              </Nav>
            ) : (
              <Nav className="justify-content-end" style={{ flex: 1 }}>
                <LinkContainer
                  to="/home"
                  style={{ marginRight: "1.0rem", fontSize: "20px" }}
                >
                  <Nav.Link active={location.pathname === "/home"}>
                    Home
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer
                  to="/login"
                  style={{ marginRight: "1.0rem", fontSize: "20px" }}
                >
                  <Nav.Link active={location.pathname === "/login"}>
                    Login
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer
                  to="/register"
                  style={{ marginRight: "1.0rem", fontSize: "20px" }}
                >
                  <Nav.Link
                    active={location.pathname === "/register"}
                    style={{
                      color:
                        location.pathname === "/register" ? "red" : "green",
                    }}
                  >
                    Sign Up
                  </Nav.Link>
                </LinkContainer>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
