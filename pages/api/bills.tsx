import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req:NextApiRequest, res:NextApiResponse) {
    const dbPath:str = 'pages/api/db.json'
    // const dbHistory:str = 'public/history/$$$'
    if(req.method == 'POST'){
        const data = req.body
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 4))
        const time = Math.floor(Date.now() / 1000)
        // fs.writeFileSync(dbHistory.replace('$$$', `db${time}.json`), JSON.stringify(data, null, 4))
        return res.status(200).json({ok: true})
    }
    else{
        return res.status(200).json(JSON.parse(fs.readFileSync(dbPath, 'utf-8')))
    }
}