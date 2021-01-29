import React from 'react';
import styles from './FlagImg.module.css';

type FlagImgProps = {
  getFlagSvg: () => string;
}

function FlagImg(props: FlagImgProps) {
  return (
    <div className={styles.flagImgOuter}>
      <img
        className={styles.flagImg}
        src={props.getFlagSvg()}
        alt="A image of the flag"
        width="84px"
        height="auto"
      />
    </div>
  )
}

export default FlagImg;