import dva from "dva";
import "./index.css";

// 1. Initialize
const app = dva();

// 2. 注册 Plugins
// app.use({});

// 3. 注册 Model
app.model(require("./models/products").default);

// 4. 注册 Router
app.router(require("./router").default);

// 5. Start
app.start("#root");
