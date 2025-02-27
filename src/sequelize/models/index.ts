import { Sequelize } from "sequelize"
import sequelize from "../../../config/db.js"
import authenticationModelSequelize from "./authenticationModelSequelize.js"
import externalAuthenticationModelSequelize from "./externalAuthenticationModelSequelize.js"
import profileModelSequelize from "./profileModelSequelize.js"

const models = {
    authenticationModelSequelize,
    externalAuthenticationModelSequelize,
    profileModelSequelize,
}

function initModels (sequelize: Sequelize):void {
    Object.values(models)
    .filter(model => typeof model.initModel === 'function')
    .forEach(model => model.initModel(sequelize))
}

function associateModels (): void  {
    Object.values(models)
        .filter(model => typeof model.associate === 'function')
        .forEach(model => model.associate(models))
}

initModels(sequelize)
associateModels()

export {
    models
}