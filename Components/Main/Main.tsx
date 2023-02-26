import React from "react";
import style from './Main.module.scss'
import { observer } from "mobx-react-lite";
import { Bills } from "Store/Bills";
import { Bill } from "Components/index";
import {BsPlus} from 'react-icons/bs'

export const Main = observer(()=>{
    React.useEffect(()=>{
        Bills.loadBills()
        console.log(`loading bills`);
    }, [])

    return (
    <main className={style.Main}>
        <button
        className={style.MainPlus}
        onClick={()=>{
            Bills.addNewBill()
            const newestTotalInput = document.querySelector('[class*=Bill_BillTotalInput]') as HTMLInputElement
            newestTotalInput.focus()
        }}
        ><BsPlus/></button>
        
        {Bills.bills.map((bill, i)=>(
            <React.Fragment key={`${i}`}>
                <Bill id={i}/>
            </React.Fragment>
        ))}
    </main>
    )
})