import HttpError from "../../utils/customErrors/httpError";
import { IProfile, IProfileParams, IProfileRepository, IProfileService } from "../Interfaces/profileInterfaces";
import Profile from "../models/ProfileModel";
import { createProfileRepository } from "../repositories/factoryAuthorizationRepository";

class ProfileService implements IProfileService {
    private static instance: ProfileService;
    private profileRepository: IProfileRepository;
    
    private constructor(){
        this.profileRepository = createProfileRepository();
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

    // async addProfileToUser(userId: string, profileId: string): Promise<void> {
    //     throw new Error("Method not implemented.");
    // }
    // async removeProfileFromUser(userId: string, profileId: string): Promise<void> {
    //     throw new Error("Method not implemented.");
    // }
    // async addGrantsToProfile(grantsId: string[], profileId: string): Promise<void> {
    //     const profile = await this.profileRepository.findById(profileId);
    //     if (!profile) {
    //         throw new HttpError(404, 'Profile not found');
    //     }

    //     const existingGrants = await this.grantsService.getGrantsByIds(grantsId);
        
    //     if (existingGrants.length !== grantsId.length) {
    //         throw new HttpError(404, 'Grants not found');
    //     }

    //     profile.addGrants(existingGrants);
        
    // }
    // removeProfileFromGrants(grantId: string, profileId: string): Promise<void> {
    //     throw new Error("Method not implemented.");
    // }
}

export default ProfileService  