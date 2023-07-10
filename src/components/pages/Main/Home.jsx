import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaQuoteLeft, FaCheckDouble } from "react-icons/fa";
import { BsFillLightningChargeFill } from "react-icons/bs";
import axiosInstance from "../../services/Axios/Axios";
import useLoggedUser from "../../services/Auth/Auth";
import "./Home.css";
const RenderUserActions = ({ quizId, completed, handleQuizAction }) => {
  const isCompleted =
    Array.isArray(completed) && completed.find((q) => q.id === quizId);
  return (
    <Button
      variant={isCompleted ? "outline-primary" : "bg-dark"}
      className="w-100"
      style={{ backgroundColor: "black" }}
      onClick={() => handleQuizAction(quizId)}
      disabled={isCompleted}
    >
      {isCompleted ? (
        <span style={{ color: "white" }}>
          Done <FaCheckDouble />{" "}
        </span>
      ) : (
        <span style={{ color: "white" }}>
          Start <BsFillLightningChargeFill />{" "}
        </span>
      )}
    </Button>
  );
};

const Home = () => {
  const { user } = useLoggedUser() || {};
  const { role = "", completed = [] } = user || {};
  const { quizzes } = useSelector((store) => store.quiz) || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({
      type: "RESET_ACTIVE_QUIZ",
    });
  }, []);
  async function getQuizzes() {
    try {
      const { data } = await axiosInstance.get("/quiz", {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("QUIZETH")).token
          }`,
        },
      });
      if (data.response) {
        dispatch({
          type: "SAVE_ALL_QUIZ",
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

  React.useEffect(() => {
    if (!quizzes) {
      getQuizzes();
    }
  }, [quizzes]);
  async function getQuizById(id, action) {
    try {
      const { data } = await axiosInstance.get(`/quiz/${id}`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("QUIZETH")).token
          }`,
        },
      });
      if (data.response) {
        if (action) {
          dispatch({
            type: "TOGGLE_MODE",
            payload: action,
          });
          dispatch({
            type: "SAVE_ACTIVE_QUIZ",
            payload: data.response,
          });
          if (action === "EDIT") {
            return navigate("/quiz/new-update");
          }
        } else {
          dispatch({
            type: "SAVE_ACTIVE_QUIZ",
            payload: data.response,
          });
          navigate("/quiz/rules");
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  const handleQuizAction = (id) => {
    getQuizById(id);
  };
  async function deleteQuizCall(id) {
    try {
      const { data } = await axiosInstance.delete(`/quiz/${id}`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("QUIZETH")).token
          }`,
        },
      });
      if (data.response) {
        dispatch({
          type: "SAVE_ALL_QUIZ",
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

  const handleDelete = (id) => {
    const dialogBox = document.createElement("div");
    dialogBox.className = "dialog-box";

    const dialogContent = document.createElement("div");
    dialogContent.className = "dialog-content";

    const message = document.createElement("p");
    message.textContent = "Are you sure ?";

    const deleteButton = document.createElement("button");
    deleteButton.className = "dialog-button";
    deleteButton.textContent = "YES";
    deleteButton.addEventListener("click", () => {
      deleteQuizCall(id);
      document.body.removeChild(dialogBox);
    });

    const cancelButton = document.createElement("button");
    cancelButton.className = "dialog-button";
    cancelButton.textContent = "NO";
    cancelButton.addEventListener("click", () => {
      document.body.removeChild(dialogBox);
    });

    dialogContent.appendChild(message);
    dialogContent.appendChild(deleteButton);
    dialogContent.appendChild(cancelButton);

    dialogBox.appendChild(dialogContent);
    document.body.appendChild(dialogBox);
  };

  const handleEdit = (id) => {
    getQuizById(id, "EDIT");
  };

  return (
    <Container className="py-5 home-container">
      <Row xs={1} md={2} xl={3} className="g-4">
        {Array.isArray(quizzes) &&
          quizzes.map((quiz) => (
            <Col key={quiz._id}>
              <Card
                id={quiz._id}
                className="quiz-custom-card"
                style={{
                  backgroundColor: "lightgoldenrodyellow",
                  border: "3px solid black",
                  borderRadius: "8px",
                  padding: "25px",
                }}
              >
                <Card.Body>
                  <Card.Title
                    className="custom-title"
                    style={{
                      color: "black",
                      fontSize: "30px",
                      fontWeight: "bold",
                      marginBottom: "20px",
                    }}
                  >
                    {quiz.title}
                  </Card.Title>
                  <Card.Text className="custom-category">
                    {quiz.category}
                  </Card.Text>
                  <Card.Text className="custom-info">
                    <FaQuoteLeft />
                    &nbsp;&nbsp;No of Questions: {quiz.numberOfQuestions}{" "}
                  </Card.Text>
                  <Card.Text className="custom-info">
                    {" "}
                    <FaQuoteLeft /> &nbsp;Max Score:
                    {quiz.totalPoints}
                  </Card.Text>
                  <Card.Text className="custom-info">
                    {" "}
                    <FaQuoteLeft /> &nbsp;Maximum Time: {quiz.timeForQuiz}{" "}
                    Minutes
                    <br />
                  </Card.Text>
                  <Card.Text className="custom-info">
                    {" "}
                    <FaQuoteLeft /> &nbsp;Maximum attempts allowed: 1<br />
                    <br />
                    <br />
                  </Card.Text>
                </Card.Body>
                <div className="custom-footer-container">
                  {role?.toUpperCase() === "ADMIN" ? (
                    <>
                      <Button
                        variant="primary"
                        className="custom-button"
                        onClick={() => handleEdit(quiz._id)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        className="custom-button"
                        onClick={() => handleDelete(quiz._id)}
                      >
                        <FaTrashAlt />
                      </Button>
                    </>
                  ) : (
                    <RenderUserActions
                      quizId={quiz._id}
                      completed={completed}
                      handleQuizAction={handleQuizAction}
                    />
                  )}
                </div>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default Home;
