import * as dotenv from "dotenv"
import { DataSourceOptions } from "typeorm"
import { SnakeNamingStrategy } from "typeorm-naming-strategies"

export abstract class ConfigServer {
    constructor(){
        const nodeNameEnv = this.createPathEnv(this.nodeEnv)
        dotenv.config({path: nodeNameEnv})
        
    }

    public getEnvironment(key: string): string | undefined {
        return process.env[key]
    }

    public getNumberEnv(key: string): number {
        return Number(this.getEnvironment(key))
    }

    public get nodeEnv(): string{
        return this.getEnvironment("NODE_ENV")?.trim() || ""
    }

    public createPathEnv(path: string): string{
        const arrEnv: Array<string> = ["env"]

        if(path.length > 0){
            const stringToArray = path.split('.')
            arrEnv.unshift(...stringToArray)
        }
        return "." + arrEnv.join('.')
    }

    public get typeORMConfig(): DataSourceOptions {
        return {
                type: "mysql",
                host: this.getEnvironment("DB_HOST"),
                port: this.getNumberEnv("DB_PORT"),
                username: this.getEnvironment("DB_USER"),
                password: this.getEnvironment("DB_PASSWORD"),
                database: this.getEnvironment("DB_DATABASE"),
                // entities: [__dirname + "/../**/*.entity{.ts,.js}"], // Si queremos que busque fuera de un directorio y por nombre de archivo y extensión
                entities: [__dirname + "entities/*.entity{.ts,.js}"],
                migrations: [__dirname + "../../migrations/*{.ts, .js}"],
                synchronize: true,
                logging: false,
                namingStrategy: new SnakeNamingStrategy()
            }
    }

}