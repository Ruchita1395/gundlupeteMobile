import React from "react";
import styles from "./AlumMixer.module.css";
function AlumMixer({ alumMixer = {} }) {
    return (
        <div className={`${styles["alum-mixer"]} ${styles[alumMixer.name]}`}>
            <span className={styles["alum-mixer-name"]}>{alumMixer.name}</span>
            <figure className={styles["alum-mixer-img"]}></figure>
            <div className={styles["alum-mixer-yellow"]}></div>
        </div>
    )
}

export  default AlumMixer;