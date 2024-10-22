import app from "./app";
import sequelize from "./config/sequelize";

sequelize.sync({force: true});

app.start(3000);
