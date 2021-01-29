import React from 'react';
import styles from './QuizTheme.module.css';

type QuizThemeProps = {
  getThemeText: () => string | undefined;
}

function QuizTheme(props: QuizThemeProps) {
  return (
    <p className={styles.quizTheme}>{props.getThemeText()}</p>
  )
}
export default QuizTheme;