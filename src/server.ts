import express from "express"
import morgan from "morgan"
import cors from "cors"
import { UserRouter } from "./router/user.router"
import { ConfigServer } from "./config/config"
import { DataSource } from "typeorm/data-source/DataSource"
import "reflect-metadata"

class ServerBootstrap extends ConfigServer {
    public app: express.Application = express()
    private port: number = this.getNumberEnv('PORT') 

    constructor() {
        super()
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))

        this.connectDb()

        this.app.use(morgan("dev"))
        this.app.use(cors())
        this.app.use('/api', this.routers())
        this.listen()

    }
    routers(): Array<express.Router> {
        return [new UserRouter().router]
    }

    async connectDb(): Promise<void> { try {
        await new DataSource(this.typeORMConfig).initialize();
        console.log(`🚀  Database Connected`); 
    } catch (error) {
        console.log(`🚀 Database Connection Error: ${error}` );
    }
 }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);

        })
    }
}

new ServerBootstrap()