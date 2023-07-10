import React from "react";
import { Card } from "react-bootstrap";

const QuizResults = ({ results }) => {
  return (
    <Card className="p-3 quiz-results-card text-center">
      <Card.Header>
        <Card.Text as="h1" style={{ fontSize: "50px" }}>
          RESULTS!!!!!
        </Card.Text>
      </Card.Header>
      <Card.Title as="h3" style={{ fontSize: "40px" }}>
        "Woohoo! Yayyy!" 🥳🥳🎉🎉🎉🎉
      </Card.Title>
      <Card.Body>
        <div className="d-flex justify-content-center">
          <table style={{ width: "100%" }}>
            <tbody>
              <tr
                style={{
                  backgroundColor: "black",
                  color: "white",
                  border: "3px solid black",
                }}
              >
                <td
                  style={{
                    padding: "10px",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Total Score:
                </td>
                <td
                  style={{
                    padding: "10px",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {results.points}
                </td>
              </tr>
              <tr
                style={{
                  backgroundColor: "white",
                  color: "black",
                  border: "3px solid black",
                }}
              >
                <td
                  style={{
                    padding: "10px",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Correct Answers:
                </td>
                <td
                  style={{
                    padding: "10px",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "green",
                  }}
                >
                  {results.questions.filter((q) => q.correct).length}/
                  {results.numberOfQuestions}
                </td>
              </tr>
              <tr
                style={{
                  backgroundColor: "black",
                  color: "white",
                  border: "3px solid black",
                }}
              >
                <td
                  style={{
                    padding: "10px",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Wrong Answers:
                </td>
                <td
                  style={{
                    padding: "10px",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "red",
                  }}
                >
                  {results.numberOfQuestions -
                    results.questions.filter((q) => q.correct).length}
                  /{results.numberOfQuestions}
                </td>
              </tr>
              <tr>
                <br />
                <br />
              </tr>
              <tr
                style={{
                  backgroundColor: "teal",
                  color: "white",
                  border: "3px solid black",
                }}
              >
                <td
                  style={{
                    padding: "10px",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Quiz Questions
                </td>
                <td
                  style={{
                    padding: "10px",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Correct Answers (Accuracy)
                </td>
              </tr>
              {results.questions.map((q, index) => [
                <tr
                  key={q._id}
                  style={{
                    backgroundColor: index % 2 == 0 ? "white" : "lightsalmon",
                    color: index % 2 == 0 ? "black" : "white",
                    border: "3px solid black",
                  }}
                >
                  <td
                    style={{
                      padding: "10px",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    {q.text}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    {q.answer}
                    {q.correct ? " ✔️" : " ❌"}
                  </td>
                </tr>,
              ])}
            </tbody>
          </table>
        </div>
      </Card.Body>

      <Card.Footer>
        <Card.Text as="h3">ALL THE BEST FOR FUTURE QUIZZES! 😊</Card.Text>
        ****************************
      </Card.Footer>
    </Card>
  );
};

export default QuizResults;
