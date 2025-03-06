import {
  IAuthentication,
  IAuthenticationRepository,
} from "../../Interfaces/authInterfaces.js";
import { models } from "../../../sequelize/models/index.js";
import AuthenticationModelSequelize from "../../../sequelize/models/authenticationModelSequelize.js";
import { IProfile } from "../../../_Autorização/Interfaces/profileInterfaces.js";
import { Transaction } from "sequelize";
import sequelize from "../../../../config/db.js";
import ProfileModelSequelize from "../../../sequelize/models/profileModelSequelize.js";

class AuthenticationRepositorySequelize implements IAuthenticationRepository {
  async startTransaction(): Promise<Transaction> {
    return await sequelize.transaction(); // Inicia e retorna uma nova transação
  }

  /**
   * @inheritdoc
   */
  async findById(id: string): Promise<IAuthentication | null> {
    return await models.authenticationModelSequelize.findOne({
      where: { id: id },
      attributes: { exclude: ["passwordHash", "password_token_reset"] },
    });
  }

  async findByIdWithPassword(id: string): Promise<IAuthentication | null> {
    return await models.authenticationModelSequelize.findOne({
      where: { id: id },
    });
  }

  /**
   * @inheritdoc
   */
  async findAll(): Promise<IAuthentication[]> {
    return await models.authenticationModelSequelize.findAll({
      attributes: { exclude: ["passwordHash", "password_token_reset"] },
    });
  }

  /**
   * @inheritdoc
   */
async findByLogin(
    login: string,
    options?: object
  ): Promise<IAuthentication | null> {
    return await models.authenticationModelSequelize.findOne({
      where: { login: login },
      attributes: { exclude: ["passwordHash", "password_token_reset"] },
      ...options,
    });
  }

  /**
   * @inheritdoc
   */
  async createAuthentication(
    auth: AuthenticationModelSequelize,
    options?: object
  ): Promise<IAuthentication> {
    const { passwordHash, ...newAuth } =
      await models.authenticationModelSequelize.create(auth, options);

    return { ...newAuth.dataValues };
  }

  /**
   * @inheritdoc
   */
  async updateAuthentication(
    id: string,
    updateData: Partial<IAuthentication>
  ): Promise<IAuthentication> {
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== null)
    );

    const [affectedCount, updatedRows] =
      await models.authenticationModelSequelize.update(
        { ...filteredUpdateData, updatedAt: new Date() },
        { where: { id }, returning: true }
      );

    if (affectedCount === 0) {
      throw new Error("Authentication not found");
    }

    return updatedRows[0];
  }

  /**
   * @inheritdoc
   */
  async deleteAuthentication(id: string): Promise<void> {
    await models.authenticationModelSequelize.destroy({ where: { id: id } });
  }

  async getProfilesByAuthentication(
    auth: AuthenticationModelSequelize
  ): Promise<IProfile[]> {
    return await auth.getProfiles();
  }

  async addProfilesToAuthentication(
    profiles: ProfileModelSequelize[],
    auth: AuthenticationModelSequelize,
    options?: object
  ): Promise<void> {
    for (const profile of profiles) {
      await auth.addProfiles(profile);
    }
  }
}

export default AuthenticationRepositorySequelize;
