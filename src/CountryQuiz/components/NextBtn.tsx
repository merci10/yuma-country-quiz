import React from 'react';
import styles from './NextBtn.module.css';

type NextBtnProps = {
  situation: string;
  setPhase: (value: React.SetStateAction<"answering" | "checking" | "resulting">) => void;
  resetOptions: () => void;
  setCorrectCount: (value: React.SetStateAction<number>) => void;
  changeQuizType: () => void;
}

function NextBtn(props: NextBtnProps) {
  return (
    <button
      className={styles.nextBtn}
      onClick={() => {
        if (props.situation === 'continued') {
          props.setPhase('answering');
          props.resetOptions();
          props.setCorrectCount(prev => prev + 1)
          props.changeQuizType();
        } else if (props.situation === 'gameOver') {
          props.setPhase('resulting');
        }
      }}
    >
      Next
    </button>
  )
}

export default NextBtn;