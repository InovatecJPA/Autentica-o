import { Model, DataTypes } from "sequelize";
import sequelize from "../../../config/sequelize";
import { IAuthentication } from "../../interfaces/authInterfaces";

class AuthenticationModelSequelize extends Model<IAuthentication> implements IAuthentication {
    public id!: string;
    public login!: string | null;
    public passwordHash!: string | null;
    public isExternal!: boolean;
    public externalId!: string | null;
    public active!: boolean;
    public password_token_reset!: string | null;
    public password_token_expiry_date!: Date | null;
    public createdAt!: Date;
    public updatedAt!: Date;
}

AuthenticationModelSequelize.init({ 
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    login: {
        type: DataTypes.STRING
    },
    passwordHash: {
        type: DataTypes.STRING
    },
    isExternal: {
        type: DataTypes.BOOLEAN
    },
    externalId: {
        type: DataTypes.STRING
    },
    active: {
        type: DataTypes.BOOLEAN
    },
    password_token_reset: {
        type: DataTypes.STRING
    },
    password_token_expiry_date: {
        type: DataTypes.DATE
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    }
}, {
    sequelize,
    tableName: 'authentications',
    timestamps: false
})

export default AuthenticationModelSequelize;
