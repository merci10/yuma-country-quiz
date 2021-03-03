import React from "react";
import styles from "./FlagImg.module.css";

type FlagImgProps = {
  flag: string;
};

function FlagImg(props: FlagImgProps) {
  return (
    <div className={styles.flagImgOuter}>
      <img
        className={styles.flagImg}
        src={props.flag}
        alt="A flag"
        width="84px"
        height="auto"
      />
    </div>
  );
}

export default FlagImg;
