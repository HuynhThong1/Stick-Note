"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Enable CORS so you can call this API from your HTML/JS client
    app.enableCors();
    await app.listen(3000);
    console.log(`Server is running on http://localhost:3000`);
}
bootstrap().catch((err) => {
    console.error('Error starting Nest application', err);
});
//# sourceMappingURL=main.js.map