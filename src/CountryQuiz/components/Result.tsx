import React from "react";
import styles from "./Result.module.css";

type ResultProps = {
  correctCount: number;
  setCorrectCount: (value: React.SetStateAction<number>) => void;
  setPhase: (
    value: React.SetStateAction<"answering" | "checking" | "resulting">
  ) => void;
  changeOptions: () => void;
  changeQuizType: () => void;
  setSituation: (value: React.SetStateAction<string>) => void;
};

function Result(props: ResultProps) {
  return (
    <div className={styles.result}>
      <div className={styles.resultImg}></div>
      <p className={styles.resultTitle}>Result</p>
      <p className={styles.resultDescription}>
        You got{" "}
        <span className={styles.resultCorrectAnswerCount}>
          {props.correctCount}
        </span>{" "}
        correct asnwers
      </p>
      <button
        className={styles.resultTryAgainBtn}
        onClick={() => {
          props.setPhase("answering");
          props.changeOptions();
          props.setCorrectCount(0);
          props.changeQuizType();
          props.setSituation("continued");
        }}
      >
        Try again
      </button>
    </div>
  );
}

export default Result;
