import { IAuthentication, IAuthenticationService } from "../../_Autenticacao/Interfaces/authInterfaces";
import authenticationService from "../../_Autenticacao/services/authenticationService";
import HttpError from "../../utils/customErrors/httpError";
import { IGrants, IGrantsService } from "../Interfaces/grantsInterfaces";
import { IProfile, IProfileParams, IProfileRepository, IProfileService } from "../Interfaces/profileInterfaces";
import Profile from "../models/ProfileModel";
import { createProfileRepository } from "../repositories/factoryAuthorizationRepository";
import grantsService from "./grantsService";

class ProfileService implements IProfileService {
    private static instance: ProfileService;
    private profileRepository: IProfileRepository;
    private grantsService: IGrantsService;
    private authenticationService: IAuthenticationService

    private constructor(){
        this.profileRepository = createProfileRepository();
        this.grantsService = grantsService;
        this.authenticationService = authenticationService;
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

    async createProfile(profileData: IProfileParams): Promise<void> {
        let profile = await this.profileRepository.findByName(profileData.name);

        if (profile) {
            throw new HttpError(409, 'Profile already exists');
        }

        profile = new Profile(profileData);
        
        const { id, name, description, createdAt, updatedAt } = profile
        
        await this.profileRepository.createProfile({
            id,
            name,
            description, 
            createdAt, 
            updatedAt
        });
    }


    async updateProfile(id: string, updateData: Partial<IProfileParams>): Promise<void> {
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

        await this.profileRepository.updateProfile(id, filteredData);
    }
    
    async deleteProfile(id: string): Promise<void> {
        await this.profileRepository.deleteProfile(id);
    }

    async getGrantsByProfileId(profileId: string): Promise<IGrants[]> {
        const profile = await this.profileRepository.findById(profileId);
        if (!profile) {
            throw new HttpError(404, 'Profile not found');
        }

        return await this.profileRepository.getGrantsByProfileId(profile);
    }

    async addProfileToGrants(profileId: string, grantsId: string[]): Promise<void> {
        const profile = await this.profileRepository.findById(profileId);
        if (!profile) {
            throw new HttpError(404, 'Profile not found');
        }

        const existingGrants = await this.grantsService.findByIds(grantsId);
        
        if (existingGrants.length !== grantsId.length) {
            throw new HttpError(404, 'Grants not found');
        }

        await this.profileRepository.addProfileToGrants(profile, existingGrants);
        
    }

    async removeProfileFromGrants(profileId: string, grantsId: string[]): Promise<void> {
        const profile = await this.profileRepository.findById(profileId);
        if (!profile) {
            throw new HttpError(404, 'Profile not found');
        }
        const grant = await this.grantsService.findByIds(grantsId);
        if (!grant) {
            throw new HttpError(404, 'Grant not found');
        }
        return this.profileRepository.removeProfileFromGrants(profile, grant);
    }


    async getAuthenticationsByProfileId(profileId: string): Promise<IAuthentication[]> {
        const profile = await this.profileRepository.findById(profileId);
        if (!profile) {
            throw new HttpError(404, 'Profile not found');
        }
        return await this.profileRepository.getAuthenticationsByProfileId(profile);
    }

    async addProfilesToAuthentication(profilesId: string[], authId: string): Promise<void> {
        const profiles = await this.profileRepository.findByIds(profilesId);
        if (profiles.length !== profilesId.length) {
            throw new HttpError(404, 'Profile not found');
        }

        const auth = await this.authenticationService.findById(authId);
        if (!auth) {
            throw new HttpError(404, 'User not found');
        }   

        await this.profileRepository.addProfilesToAuthentication(profiles, auth);
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

export default ProfileService.getInstance();