import React from 'react';
import styles from './QuizTheme.module.css';

type QuizThemeProps = {
  themeText: string | undefined;
}

function QuizTheme(props: QuizThemeProps) {
  return (
    <p className={styles.quizTheme}>{props.themeText}</p>
  )
}
export default QuizTheme;