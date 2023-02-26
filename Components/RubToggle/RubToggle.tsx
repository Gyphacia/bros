import React from "react";
import style from './RubToggle.module.scss'
// BiRuble

export function RubToggle(props:{isRuble:bool}){
    return (
    <div className={style.RubToggle}>
        <div
        style={{
            scale: props.isRuble ? `1` : `0`,
        }}
        >₽</div>
        <div
        style={{
            scale: props.isRuble ? `0` : `1`,
        }}
        >֏</div>
    </div>
    )
}