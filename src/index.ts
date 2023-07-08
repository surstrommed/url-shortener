import "dotenv/config";
import Koa from "koa";
import cors from "@koa/cors";
import helmet from "koa-helmet";
import bodyParser from "koa-bodyparser";
import { onDatabaseConnect } from "./config/knex";
import { DATABASE_CONNECTED, DATABASE_CONNECT_ERROR } from "./consts";
import koaRouter from "./routes";

const koa = new Koa();

koa.use(cors());
koa.use(helmet());
koa.use(bodyParser());

koa.use(koaRouter.routes()).use(koaRouter.allowedMethods());

const main = async () => {
  try {
    await onDatabaseConnect();
    console.log(DATABASE_CONNECTED);
    koa.listen(Number(process.env.PORT), () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  } catch (e) {
    console.log(`${DATABASE_CONNECT_ERROR}: ${e}`);
  }
};

main();
