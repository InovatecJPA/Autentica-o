import sequelize from "../../config/sequelize"
import { AuthenticationModelSequelize, initAuthenticationModelSequelize } from "./authenticationModelSequelize"
import { initProfileModelSequelize, ProfileModelSequelize } from "./profileModelSequelize"

initAuthenticationModelSequelize(sequelize)
initProfileModelSequelize(sequelize)

const models = {
    AuthenticationModelSequelize,
    ProfileModelSequelize
}

// Object.values(models)
//     .filter(model => typeof model.associate === 'function')
//     .forEach(model => model.associate(models))

export {
    models
}
