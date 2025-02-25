import { Sequelize } from "sequelize"
import sequelize from "../../../config/db.js"
import authenticationModelSequelize from "./authenticationModelSequelize.js"
import externalAuthenticationModelSequelize from "./externalAuthenticationModelSequelize.js"
import profileModelSequelize from "./profileModelSequelize.js"
import grantsModelSequelize from "./grantsModelSequelize.js"

const models = {
    authenticationModelSequelize,
    externalAuthenticationModelSequelize,
    profileModelSequelize,
    grantsModelSequelize,
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

console.log(models)

export {
    models
}