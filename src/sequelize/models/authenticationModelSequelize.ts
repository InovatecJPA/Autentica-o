import { Model, DataTypes, Association, Sequelize } from "sequelize";
import { IAuthentication } from "../../_Autenticacao/Interfaces/authInterfaces.js";
import ProfileModelSequelize from "./profileModelSequelize.js";
import { IProfile } from "../../_Autorização/Interfaces/profileInterfaces.js";
import ExternalAuthenticationModelSequelize from "./externalAuthenticationModelSequelize.js";

class AuthenticationModelSequelize extends Model<IAuthentication> implements IAuthentication {
    declare id: string;
    declare login: string;
    declare passwordHash: string;
    declare active: boolean;
    declare createdAt: Date;
    declare updatedAt: Date;

    declare getProfiles: () => Promise<ProfileModelSequelize[]>
    declare addProfiles: (profiles: IProfile, options?: object) => Promise<void>

    public static associations: {
        profiles: Association<AuthenticationModelSequelize, ProfileModelSequelize>;
        externalAuthentications: Association<AuthenticationModelSequelize, ExternalAuthenticationModelSequelize>;
    };


    public static associate(models: any) {
        this.belongsToMany(ProfileModelSequelize, {
            through: "authentication_profiles",
            foreignKey: 'authenticationId',
            otherKey: 'profileId',
            as: 'profiles',
            onDelete: 'CASCADE'
        })

        this.hasMany(ExternalAuthenticationModelSequelize, {
            foreignKey: 'authentication_id',
            as: 'externalAuthentications',
            onDelete: 'CASCADE'
        })
    }

    public static initModel(sequelize: Sequelize) {
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
            active: {
                type: DataTypes.BOOLEAN
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
            modelName: 'AuthenticationModelSequelize',
            timestamps: false
        })
    }
}


export default AuthenticationModelSequelize