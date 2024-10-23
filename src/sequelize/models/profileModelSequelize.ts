import { Association, DataTypes, Model, Sequelize } from "sequelize";
import { IProfile } from "../../_Autorização/Interfaces/profileInterfaces";
import  AuthenticationModelSequelize from "./authenticationModelSequelize";
import  GrantsModelSequelize  from "./grantsModelSequelize";


class ProfileModelSequelize extends Model<IProfile> implements IProfile {
    public id!: string;
    public name!: string;
    public description!: string | null;
    public createdAt!: Date;
    public updatedAt!: Date;

    public addGrant!: (grant: GrantsModelSequelize) => Promise<void>;
    public addGrants!: (grants: GrantsModelSequelize[]) => Promise<void>;
    public getGrants!: () => Promise<GrantsModelSequelize[]>;
    public removeGrant!: (grant: GrantsModelSequelize) => Promise<void>;
    public removeGrants!: (grants: GrantsModelSequelize[]) => Promise<void>;

    public static associations: {
        authentication: Association<ProfileModelSequelize, AuthenticationModelSequelize>;
        grants: Association<ProfileModelSequelize, GrantsModelSequelize>;
    }

    public static associate (models: any) {
        this.hasOne(models.AuthenticationModelSequelize, {
            foreignKey: 'profileId',
            sourceKey: 'id',
            as: 'authentication'
        })

        this.belongsToMany(models.GrantsModelSequelize, {
            through: "grants_profiles",
            foreignKey: 'profileId',
            otherKey: 'grantId',
            as: 'grants'
        })
    }

    public static initModel (sequelize: Sequelize) {
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