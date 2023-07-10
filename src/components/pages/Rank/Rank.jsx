import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Container } from "react-bootstrap";
import { FaUserGraduate, FaChartLine } from "react-icons/fa";
import axiosInstance from "../../services/Axios/Axios";
import useLoggedUser from "../../services/Auth/Auth";
import "./Rank.css";
const Leaderboard = () => {
  useLoggedUser();
  const dispatch = useDispatch();
  const leaderboard = useSelector((store) => store.leaderboard);
  async function getLeaderboard() {
    try {
      const { data } = await axiosInstance.get("/leaderboard", {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("QUIZETH")).token
          }`,
        },
      });
      console.log(data);
      if (data.response) {
        dispatch({
          type: "SAVE_LEADERBOARD",
          payload: data.response,
        });
      }
    } catch (err) {
      if (err?.response?.data?.response) {
        console.log(err.response.data.response);
      } else {
        console.log(err);
      }
    }
  }

  useEffect(() => {
    dispatch({
      type: "RESET_ACTIVE_QUIZ",
    });
    if (!leaderboard) {
      getLeaderboard();
    }
  }, []);

  if (!leaderboard) return <div>Loading...</div>;

  return (
    <Container className="mt-5 leaderboard-container">
      <h1 className="text-center mb-5">YOUR RANK</h1>
      <Card className="card-wrapper header-row">
        <div className="rank-user-wrapper">
          <Card.Text as="h5" className="rank text-muted">
            <span style={{ color: "black" }}>ID</span>
          </Card.Text>
          <Card.Text as="h5" className="username" style={{ color: "black" }}>
            Name
          </Card.Text>
        </div>
        <Card.Text as="h5" style={{ color: "red" }}>
          Score
        </Card.Text>
      </Card>
      {leaderboard.map((leader, index) => (
        <Card
          key={leader._id}
          className={`card-wrapper ${index % 2 === 0 ? "even" : "odd"}`}
        >
          <div className="rank-user-wrapper">
            <Card.Text as="h5" className="rank text-muted">
              <span
                className={`card-wrapper ${index % 2 === 0 ? "even" : "odd"}`}
              >
                {index + 1}
              </span>
            </Card.Text>
            <Card.Text as="h5" className="username">
              <FaUserGraduate /> {leader.user.username}
            </Card.Text>
          </div>
          <Card.Text as="h5" style={{ color: "red" }}>
            <FaChartLine />
            &nbsp;
            {leader.points}
          </Card.Text>
        </Card>
      ))}
    </Container>
  );
};

export default Leaderboard;
