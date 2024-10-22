import { Association, DataTypes, Model, Sequelize } from "sequelize";
import { IProfile } from "../../_Autorização/Interfaces/profileInterfaces";
import { AuthenticationModelSequelize } from "./authenticationModelSequelize";


class ProfileModelSequelize extends Model<IProfile> implements IProfile {   
    public id!: string;
    public name!: string;
    public createdAt!: Date;
    public updatedAt!: Date;

    public static associations: {
        authentication: Association<ProfileModelSequelize, AuthenticationModelSequelize>;
    }

    public static associate (models: any) {
        this.hasOne(models.AuthenticationModelSequelize, {
            foreignKey: 'profileId',
            sourceKey: 'id',
            as: 'authentication'
        })
    }
}

const initProfileModelSequelize = (sequelize: Sequelize) => {
    ProfileModelSequelize.init({ 
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        }
    }, {
        sequelize,
        tableName: 'profiles',
        modelName: 'ProfileModelSequelize',
        timestamps: false
    })
}

export {
    ProfileModelSequelize,
    initProfileModelSequelize
}