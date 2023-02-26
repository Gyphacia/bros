import {makeAutoObservable} from 'mobx'

interface IBill {
    name: str,
    totalAmount: float,
    totalRub: bool,
    open: bool,
    items: {
        name: str,
        members: str,
        amount: float,
        rub: bool,
    }[],
}

const EXRATE = .20

const getHost = () => `${window.location}` as str

class Bills{
    bills:IBill[] = []
    constructor(){
        makeAutoObservable(this, {}, {deep: true})
    }

    saveBills = ()=>{
        console.log('saving...');
        fetch(`${getHost()}/api/bills`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({bills: this.bills})
        })
    }
    
    loadBills = ()=>{
        const params:obj = {
        }

        console.log(getHost());
        
        let url = new URL(`${getHost()}/api/bills`)
        Object.entries(params).forEach(([key, val]) => url.searchParams.append(key, `${val}`))
    
        console.log(`fetching:\n${url}\nwith params:\n${JSON.stringify(params)}`);
        
    
        fetch(url, {mode: 'cors'})
        .then((response) => response.json())
        .then((data) => {
            this.bills = data.bills
        })
    }

    summBills = (id:int)=>{
        const totalOfLines = this.bills[id].items
        .map(e => e.amount)
        .reduce((acc, cur)=>acc+cur, 0)
        this.changeTotalAmount(id, totalOfLines)
    }

    changeBillName = (id:int, newName:str)=>{
        this.bills[id].name = newName
        this.saveBills()
    }

    addNewBill = ()=>{
        const now = ()=>new Date()
        const month = (id:int)=>`Янв Фев Мар Апр Май Июнь Июль Авг Сент Окт Ноя Дек`.split(' ')[id]
        this.bills.unshift({
            items: [],
            name: `${now().getDate()} ${month(now().getMonth())}`,
            open: true,
            totalAmount: 0,
            totalRub: false,
        })
        this.saveBills()
    }

    removeBill = (id:int)=>{
        this.bills = this.bills.filter((_, i)=> i !== id)
        this.saveBills()
    }

    changeTotalAmount = (id:int, newAmount:float)=>{
        this.bills[id].totalAmount = newAmount
        this.saveBills()
    }

    toggleTotalRub = (id:int)=>{
        this.bills[id].totalRub = !this.bills[id].totalRub
        this.saveBills()
    }

    toggleLinesDisplay = (id:int)=>{
        this.bills[id].open = !this.bills[id].open
        this.saveBills()
    }

    changeItemAmount = (id:int, line:int, newAmount:float) => {
        this.bills[id].items[line].amount = newAmount
        this.saveBills()
    }

    changeItemName = (id:int, line:int, newName:str) => {
        this.bills[id].items[line].name = newName
        this.saveBills()
    }

    toggleItemRub = (id:int, line:int) => {
        this.bills[id].items[line].rub = !this.bills[id].items[line].rub
        this.saveBills()
    }

    removeLine = (id:int, line:int) => {
        this.bills[id].items = this.bills[id].items.filter((_, i)=>i!==line)
        this.saveBills()
    }

    addNewLine = (id:int) => {
        this.bills[id].items.push({name: '', amount: 0, rub: false, members:'bmf'})
        this.saveBills()
    }

    toggleMember = (id:int, line:int, char:str) => {
        const {members} = this.bills[id].items[line]
        if(members.includes(char)){
            this.bills[id].items[line].members = members.split('').filter(c => c !== char).join('')
        }
        else{
            this.bills[id].items[line].members = `${members}${char}`
        }
        this.saveBills()
    }

    toggleMemberInAllBills = (id:int, char:str) => {
        let memberIsActive = true
        if(this.bills[id].items.length){
            memberIsActive = !this.bills[id].items[0].members.includes(char)
        }
        this.bills[id].items.forEach((item)=>{
            item.members = item.members.split('').filter(c => c !== char).join('')
            if(memberIsActive){
                item.members += char
            }
        })
    }

    getOst = (id:int):float=>{
        const bill = this.bills[id]
        let res = bill.totalRub ? bill.totalAmount : bill.totalAmount * EXRATE
        for(let item of bill.items){
            const amount = item.rub ? item.amount : item.amount * EXRATE
            if(item.members.length){
                res -= amount
            }
        }
        return res
    }

    getTotal = (id: int, char:str):float => {
        const bill = this.bills[id]
        let res = this.getOst(id) / 3
        for(let item of bill.items){
            const amount = item.rub ? item.amount : item.amount * EXRATE
            if(item.members.includes(char)){
                res += amount / item.members.length
            }
        }
        return res
    }
}


const e = new Bills()
export {
    e as Bills,
}