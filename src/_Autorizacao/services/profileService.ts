import { IAuthentication, IAuthenticationService } from "../../_Autenticacao/Interfaces/authInterfaces.js";
import authenticationService from "../../_Autenticacao/services/authenticationService.js";
import HttpError from "../../utils/customErrors/httpError.js";
import { IProfile, IProfileParams, IProfileRepository, IProfileService } from "../Interfaces/profileInterfaces.js";
import Profile from "../models/ProfileModel.js";
import { createProfileRepository } from "../repositories/factoryAuthorizationRepository.js";

/**
 * @inheritdoc
 * 
 * @class ProfileService
 * @implements {IProfileService}    
 */
class ProfileService implements IProfileService {
    private static instance: ProfileService;
    private profileRepository: IProfileRepository;
    private authenticationService: IAuthenticationService

    private constructor(){
        this.profileRepository = createProfileRepository();
        this.authenticationService = authenticationService.getInstance();
    }

    static getInstance(): ProfileService {
        if(!ProfileService.instance){
            ProfileService.instance = new ProfileService();
        }
        return ProfileService.instance;
    }

    async findAll(): Promise<IProfile[]> {
        return await this.profileRepository.findAll();
    }

    async findById(id: string): Promise<IProfile | null> {
        return await this.profileRepository.findById(id);
    }

    async createProfile(profileData: IProfileParams): Promise<IProfile> {
        let profile = await this.profileRepository.findByName(profileData.name);

        if (profile) {
            throw new HttpError(409, 'Profile already exists');
        }

        profile = new Profile(profileData);
        
        const { id, name, description, createdAt, updatedAt } = profile
        
        const newProfile = await this.profileRepository.createProfile({
            id,
            name,
            description, 
            createdAt, 
            updatedAt
        });

        if (!newProfile) {
            throw new HttpError(400, 'Failed to create profile');
        }

        return newProfile;
    }


    async updateProfile(id: string, updateData: Partial<IProfileParams>): Promise<IProfile> {
        const existingProfile = await this.profileRepository.findById(id);

        if (!existingProfile) {
            throw new HttpError(404, 'Profile not found');
        }

        const filteredData = Object.entries(updateData)
            .filter(([_, value]) => value !== null && value !== undefined && 
                !(typeof value === 'string' && value.trim() === ''))
            .reduce((acc, [key, value]) => {
                acc[key as keyof IProfileParams] = value as any;
                return acc;
            }, {} as Partial<IProfileParams>);

        if (Object.keys(filteredData).length === 0) {
            throw new HttpError(400, 'No valid fields provided for update');
        }

        const updatedProfile = await this.profileRepository.updateProfile(id, filteredData);

        if (!updatedProfile) {
            throw new HttpError(400, 'Failed to update profile');
        }

        return updatedProfile;
    }
    
    async deleteProfile(id: string): Promise<void> {
        await this.profileRepository.deleteProfile(id);
    }

    async getAuthenticationsByProfileId(profileId: string): Promise<IAuthentication[]> {
        const profile = await this.profileRepository.findById(profileId);
        if (!profile) {
            throw new HttpError(404, 'Profile not found');
        }
        return await this.profileRepository.getAuthenticationsByProfileId(profile);
    }

    async addProfilesToAuthentication(profilesId: string[], authId: string, options?: object): Promise<void> {
        const profiles = await this.profileRepository.findByIds(profilesId);
        if (profiles.length !== profilesId.length) {
            throw new HttpError(404, 'Profile not found');
        }

        const auth = await this.authenticationService.findById(authId);
        if (!auth) {
            throw new HttpError(404, 'User not found');
        }   

        await this.profileRepository.addProfilesToAuthentication(profiles, auth, options);
    }

    async removeProfilesFromAuthentication(profilesId: string[], authId: string): Promise<void> {
        const profiles = await this.profileRepository.findByIds(profilesId);
        if (profiles.length !== profilesId.length) {
            throw new HttpError(404, 'Profile not found');
        }
        const auth = await this.authenticationService.findById(authId);
        if (!auth) {
            throw new HttpError(404, 'User not found');
        }

        return this.profileRepository.removeProfilesFromAuthentication(profiles, auth); 
    }

}

export default ProfileService