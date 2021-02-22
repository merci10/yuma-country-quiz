import React from 'react';
import styles from './OrderedOptions.module.css';
import { Option } from '../models/option';

type OrderedOptionsProps = {
  options: Option[];
  phase: string;
  correctOptionNum: number;
  setPhase: (value: React.SetStateAction<"answering" | "checking" | "resulting">) => void;
  setSituation: (value: React.SetStateAction<string>) => void;
  setTrueToClickedOption: (id: number) => void;
}

function OrderedOptions(props: OrderedOptionsProps) {
  return (
    <div className={`${styles.options} ${props.phase === 'checking' ? styles.isChecking : styles.isAnswering}`}>
      {props.options.map((option, i) => {
        if (props.correctOptionNum === i) return (
          <button
            className={`${styles.option} ${props.phase === 'checking' ? styles.isCorrectOption : ''}`}
            key={option.id}
            onClick={() => {
              props.setPhase('checking')
              props.setTrueToClickedOption(option.id)
            }}
          >
            {option.name}だよ
          </button>
        );
        else return (
          <button
            className={`${styles.option} ${option.isClicked ? styles.isIncorrectOption : ''}`}
            key={option.id}
            onClick={() => {
              props.setPhase('checking');
              props.setSituation('gameOver');
              props.setTrueToClickedOption(option.id);
            }}
          >
            {option.name}
          </button>
        );
      })}
    </div>
  )
}

export default OrderedOptions;