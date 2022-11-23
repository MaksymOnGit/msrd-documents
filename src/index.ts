import {$log} from "@tsed/common";
import { PlatformExpress } from "@tsed/platform-express";
import {Server} from "./Server";

const config = require("dotenv").config({
  debug: process.env.DEBUG
});
async function bootstrap() {
  try {
    const platform = await PlatformExpress.bootstrap(Server, config.parsed);
    await platform.listen();

    process.on("SIGINT", () => {
      platform.stop();
    });
  } catch (error) {
    $log.error({event: "SERVER_BOOTSTRAP_ERROR", message: error.message, stack: error.stack});
  }
}

bootstrap();
