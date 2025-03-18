import { Association, DataTypes, Model, Sequelize } from "sequelize";
import { IAuthenticationRecovery } from "../../_Autenticacao/Interfaces/authRecoveryInterfaces.js";
import AuthenticationModelSequelize from "./authenticationModelSequelize.js";


class AuthPasswordRecoveryModelSequelize extends Model<IAuthenticationRecovery> implements IAuthenticationRecovery {
  declare id: number;
  declare authenticationId: string;
  declare token: string;
  declare expirationDate: Date;
  declare createdAt: Date;

  public static associate(models: any) {
    this.belongsTo(AuthenticationModelSequelize, {
      foreignKey: 'authentication_id',
      as: 'authentications'
    })
  }

  public static initModel(sequelize: Sequelize) {
    AuthPasswordRecoveryModelSequelize.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      authenticationId: {
        type: DataTypes.STRING
      },
      token: {
        type: DataTypes.STRING
      },
      expirationDate: {
        type: DataTypes.DATE
      },
      createdAt: {
        type: DataTypes.DATE
      }
    }, {
      sequelize,
      tableName: 'user_password_recoveries',
      modelName: 'AuthPasswordRecoveryModelSequelize',
      timestamps: false
    })
  }
}

export default AuthPasswordRecoveryModelSequelize