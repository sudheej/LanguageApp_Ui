import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Header, Container, Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import Training from "./Training";
import Assessment from "./Assessment";
import { questionSessionStore } from "../store/questionSessionStore";

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const TrainingAndAssessmentContainer = observer(() => {
  const { questions, selectedLesson, score } = questionSessionStore;
  const PART_SIZE = 4;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTraining, setIsTraining] = useState(true);
  const [partIndex, setPartIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setStartTime(new Date());

    const intervalId = setInterval(() => {
      setTimeElapsed((prevTimeElapsed) => prevTimeElapsed + 1);
    }, 1000);

    setTimerInterval(intervalId);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleNext = () => {
    if (isTraining) {
      setIsTraining(false);
    } else {
      const nextIndex = currentIndex + PART_SIZE;
      if (nextIndex >= questions.length - 1) {
        setEndTime(new Date());
        setPartIndex(partIndex + 1);
      } else {
        setCurrentIndex(nextIndex);
        setIsTraining(true);
      }
    }
  };

  useEffect(() => {
    if (partIndex * PART_SIZE >= questions.length) {
      clearInterval(timerInterval);
      setTimeout(() => {
        navigate("/student");
      }, 4000);
    }
  }, [partIndex, questions.length, navigate, timerInterval]);

  const currentPart = questions.slice(currentIndex, currentIndex + PART_SIZE);

  if (!selectedLesson) {
    return <div>Please select a lesson to start.</div>;
  }

  // Format the time elapsed in minutes and seconds
  const formattedTime = `${Math.floor(timeElapsed / 60)
    .toString()
    .padStart(2, "0")}:${(timeElapsed % 60).toString().padStart(2, "0")}`;

  return (
    <Container
      style={{
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        width: "100%",
        margin: 0,
        height: "100vh",
        padding: "0px",
        margin: "0px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          height: "auto",
          width: "100%",
        }}
      >
        <div>
          <Icon name="heart" color="red" />
          <span
            style={{ marginLeft: "5px", fontWeight: "bold", fontSize: "20px" }}
          >
            Score: {score} / {questions.length}
          </span>
        </div>
        <div>
          <Icon name="clock" />
          <span
            style={{ marginLeft: "5px", fontWeight: "bold", fontSize: "20px" }}
          >
            Time: {formattedTime}
          </span>
        </div>
      </div>
      <div
        style={{
          position: "relative",
          objectFit: "cover",
          height: "auto",
          maxWidth: "100%",
          top: "30px",
          padding: "0px",
          margin: "20px",
        }}
      >
        {partIndex * PART_SIZE < questions.length ? (
          isTraining ? (
            <Training questions={currentPart} handleNext={handleNext} />
          ) : (
            <Assessment questions={currentPart} handleNext={handleNext} PART_SIZE={PART_SIZE} partIndex={partIndex}  />
          )
        ) : (
          <div style={{ textAlign: "center" }}>
            <Header as="h2" style={{ color: "#21ba45", marginBottom: "20px" }}>
              Congratulations! You have completed all parts.
            </Header>
            <p>Completed Time: {formattedTime}</p>
            <p>
              Score: {score} / {questions.length}
            </p>
            <Confetti />
          </div>
        )}
      </div>
    </Container>
  );
});

export default TrainingAndAssessmentContainer;
