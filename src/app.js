import express from "express";
import environments from "./config/environments";
import logger from 'morgan'
import errorsMiddleware from "./middlewares/errors";

export default class App {
    constructor() {
        this.app = express()
        this.app.use(logger('dev', { skip: (req, res) => environments.nodeEnv === 'test' }))
        this.app.use(express.json())
        this.app.use(express.urlencoded({extended:true}))
        
    }

    setRoutes() {
        this.app.use(errorsMiddleware)
        
    }
    getApp() {
        return this.app
    }

    listen() {
        const { port } = environments
        this.app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    }

}