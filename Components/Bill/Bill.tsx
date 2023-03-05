import React from "react";
import style from './Bill.module.scss'
import { observer } from "mobx-react-lite";
import { Bills } from "Store/Bills";
import { RubToggle } from "Components/index";
import {TbTriangleInverted, TbTriangle} from 'react-icons/tb'
import {BsPlus} from 'react-icons/bs'
import {BiMinus} from 'react-icons/bi'
import {TbSum} from 'react-icons/tb'

const BillLine = observer((props:{id:int, line:int})=>{
    const {bills} = Bills
    const {line, id} = props
    const item = bills[id].items[line]

    return (
    <div className={style.BillLinesLine}>
        <div className={style.BillLinesLinePair}>
            <input
            type="text"
            value={item.name}
            className={style.BillLinesLineName}
            onChange={(ev)=>{Bills.changeItemName(id, line, ev.target.value)}}
            onKeyUp={(ev)=>{
                if(ev.key !== 'Enter'){return;}
                let myLine = (ev.target as HTMLInputElement).parentNode as HTMLDivElement
                const nextInput = myLine.querySelector('input + input') as HTMLDivElement
                nextInput.focus()
            }}
            />

            <input
            type="number"
            value={item.amount}
            className={style.BillLinesLineAmount}
            onChange={(ev)=>{
                Bills.changeItemAmount(id, line, +ev.target.value)
                ev.target.value = `${parseFloat(ev.target.value)}`
            }}
            onKeyUp={(ev)=>{
                if(ev.key !== 'Enter'){return;}
                let mySection = ev.target as HTMLDivElement
                while(mySection.tagName !== 'SECTION'){
                    mySection = mySection.parentElement as HTMLDivElement
                }
                const mySectionPlusBtn = mySection.querySelector('[class*=Bill_BillLinesPlus]') as HTMLButtonElement
                mySectionPlusBtn.click()
            }}
            />
        </div>

        <div
        onClick={()=>{Bills.toggleItemRub(id, line)}}
        className={style.BillLinesLineToggle}
        ><RubToggle isRuble={item.rub}/></div>

        <button
        className={style.BillLinesLineMinus}
        onClick={()=>{Bills.removeLine(id, line)}}
        ><BiMinus/></button>

        <div className={style.BillLinesLineMembers}>
            <div className={style.BillLinesLineMembersMember}
            style={{ filter: item.members.includes('b') ? '' : `grayscale(1) brightness(.33)` }}
            onClick={()=>{Bills.toggleMember(id, line, 'b')}}
            />
            <div className={style.BillLinesLineMembersMember}
            style={{ filter: item.members.includes('m') ? '' : `grayscale(1) brightness(.33)` }}
            onClick={()=>{Bills.toggleMember(id, line, 'm')}}
            />
            <div className={style.BillLinesLineMembersMember}
            style={{ filter: item.members.includes('f') ? '' : `grayscale(1) brightness(.33)` }}
            onClick={()=>{Bills.toggleMember(id, line, 'f')}}
            />
        </div>
    </div>
    )
})

export const Bill = observer((props:{id:int})=>{
    const {bills} = Bills
    const {id} = props
    const cnt = bills[id].items.length
    const totalHeight = 100 * cnt + 15 * cnt + 100
    const bill = bills[id]

    return (
    <section className={style.Bill}>
        <div className={style.BillLine}>
            <button
            className={style.BillLinesLineMinus}
            onClick={()=>{Bills.removeBill(id)}}
            ><BiMinus/></button>
            <input
            className={style.BillTitle}
            value={bills[id].name}
            onChange={(ev)=>{Bills.changeBillName(id, ev.target.value)}}
            />
            <button
            className={style.BillSumm}
            onClick={()=>{Bills.summBills(id)}}
            ><TbSum/></button>
        </div>
        <div className={style.BillHat}>
            <div onClick={()=>{Bills.toggleMemberInAllBills(id, 'b')}}></div>
            <div onClick={()=>{Bills.toggleMemberInAllBills(id, 'm')}}></div>
            <div onClick={()=>{Bills.toggleMemberInAllBills(id, 'f')}}></div>
            <p>{Bills.getTotal(id, 'b').toFixed(0)} ₽</p>
            <p>{Bills.getTotal(id, 'm').toFixed(0)} ₽</p>
            <p>{Bills.getTotal(id, 'f').toFixed(0)} ₽</p>
        </div>
        <div className={style.BillTotal}>
            <p className={style.BillTotalLabel}>Всего:</p>
            <input
            style={{
                width: `calc(${`${bills[id].totalAmount}`.length}ch + var(--off)*2)`
            }}
            type="number"
            value={bills[id].totalAmount}
            onChange={(ev)=>{
                Bills.changeTotalAmount(id, +ev.target.value)
                ev.target.value = `${parseFloat(ev.target.value)}`
            }}
            onKeyUp={(ev)=>{
                if(ev.key !== 'Enter'){return;}
                let mySection = ev.target as HTMLDivElement
                while(mySection.tagName !== 'SECTION'){
                    mySection = mySection.parentElement as HTMLDivElement
                }
                const mySectionPlusBtn = mySection.querySelector('[class*=Bill_BillLinesPlus]') as HTMLButtonElement
                mySectionPlusBtn.click()
            }}
            className={style.BillTotalInput}
            />
            <button
            onClick={()=>{Bills.toggleTotalRub(id)}}
            className={style.BillTotalToggle}
            ><RubToggle isRuble={bills[id].totalRub}/></button>
        </div>
        <div
        className={style.BillLines}
        style={{
            maxHeight: bills[id].open ? `${totalHeight}px` : '0px',
            overflow: 'hidden',
            opacity: bills[id].open ? 1 : 0,
            padding: bills[id].open ? '15px' : '0px'
        }}
        >
            {bills[id].items.filter(e => bills[id].open).map((item, i)=>(
                <React.Fragment key={i}>
                    <BillLine id={id} line={i}/>
                </React.Fragment>
            ))}
            <button
            className={style.BillLinesPlus}
            onClick={(ev)=>{
                Bills.addNewLine(id)
                let mySection = ev.target as HTMLDivElement
                while(mySection.tagName !== 'SECTION'){
                    mySection = mySection.parentElement as HTMLDivElement
                }
                setTimeout(()=>{
                    const inputs = [...mySection.querySelectorAll('[class*=Bill_BillLinesLineName]')] as HTMLInputElement[]
                    if(!inputs.length){return;}
                    const lastInput = inputs.at(-1) as HTMLInputElement
                    lastInput.focus()
                }, 50)
            }}
            ><BsPlus/></button>
        </div>
        <button
        className={style.BillLinesToggle}
        onClick={()=>{Bills.toggleLinesDisplay(id)}}
        >
            {bills[id].open ? <TbTriangle/> : <TbTriangleInverted/>}
        </button>
    </section>
    )
})