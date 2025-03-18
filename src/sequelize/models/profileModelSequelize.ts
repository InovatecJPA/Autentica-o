import { Association, DataTypes, Model, Sequelize } from "sequelize";
import { IProfile } from "../../_Autorizacao/Interfaces/profileInterfaces.js";
import AuthenticationModelSequelize from "./authenticationModelSequelize.js";


class ProfileModelSequelize extends Model<IProfile> implements IProfile {
    declare id: string;
    declare name: string;
    declare description: string | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    declare getAuthentications: (options?: object) => Promise<AuthenticationModelSequelize[]>;
    declare addAuthentications: (auth: AuthenticationModelSequelize, options?: object) => Promise<void>;
    declare removeAuthentications: (auth: AuthenticationModelSequelize) => Promise<void>;

    public static associations: {
        authentication: Association<ProfileModelSequelize, AuthenticationModelSequelize>;
    }

    public static associate(models: any) {
        this.belongsToMany(AuthenticationModelSequelize, {
            through: "authentication_profiles",
            foreignKey: 'profileId',
            otherKey: 'authenticationId',
            as: 'authentications'
        })

    }

    public static initModel(sequelize: Sequelize) {
        ProfileModelSequelize.init({
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
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
}


export default ProfileModelSequelize