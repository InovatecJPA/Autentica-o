import app from "./app";
import sequelize from "./config/config";

// sequelize.sync({force: true});

app.start(3000);
