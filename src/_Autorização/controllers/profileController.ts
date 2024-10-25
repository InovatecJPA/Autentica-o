import { IHttpRequest, IHttpResponse, IHttpNext } from "../../interfaces/httpInterface";
import HttpError from "../../utils/customErrors/httpError";
import { IProfileController, IProfileParams, IProfileService } from "../Interfaces/profileInterfaces";
import profileService from "../services/profileService";

class ProfileController implements IProfileController {
    private profileService: IProfileService;
    private static instance: IProfileController;

    private constructor(profileService: IProfileService) {
        this.profileService = profileService;
    }

    public static getInstance(): IProfileController {
        if(!ProfileController.instance){
            ProfileController.instance = new ProfileController(profileService);
        }
        return ProfileController.instance;
    }

    async findAll(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const profiles = await this.profileService.findAll();
            
            res.status(200).send(profiles);
        }catch(error: any){
            next(error);
        }
    }
    async findById(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        const { id } = req.params;
        try{
            const profile = await this.profileService.findById(id);
            if(!profile){
                throw new Error("Profile not found");
            }
            res.status(200).send(profile);
        }catch(error: any){
            next(error);
        }
    }

    async createProfile(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const { name, description } = req.body;

            if(!name){
                throw new HttpError(400, "Name is required");
            }

            const profile: IProfileParams = {
                name,
                description
            } 

            await this.profileService.createProfile(profile);
            res.status(201).send(profile);
        }catch(error: any){
            next(error);
        }
    }

    async updateProfile(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const { id } = req.params;
            const {name, description} = req.body
            
            if(!name && !description){
                throw new HttpError(400, "No valid fields provided for update");
            }
            
            if(!id){
                throw new HttpError(400, "Id is required");
            }
        
            const profile: IProfileParams = {
                name,
                description
            }
        
            await this.profileService.updateProfile(id, profile);
        
            res.status(200).send("Grant updated");
        } catch(error: any){
            next(error)
        }    
    }

    async deleteProfile(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;
            if(!id){
                throw new HttpError(400, "Id is required");
            }
            await this.profileService.deleteProfile(id);
            res.status(200).send("Profile deleted");

        } catch (error: any) {
            next(error);
        }
    }
    
    async getAuthenticationsByProfileId(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try{
            const { id } = req.params;

            if(!id){
                throw new HttpError(400, "Id is required");
            }
            
            const authentications = await this.profileService.getAuthenticationsByProfileId(id);
            res.status(200).send(authentications);
        } catch(error: any){
            next(error);
        } 
    }

    async addProfilesToAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { authId } = req.params;
            const { profilesId } = req.body;
            
            if(!authId){
                throw new HttpError(400, "Id is required");
            }
             if(!Array.isArray(profilesId) || profilesId.length < 1){
                throw new HttpError(400, "AuthenticationId is required");
            }
            await this.profileService.addProfilesToAuthentication(profilesId, authId);
            
            res.status(201).send("Profiles added to authentication");
        } catch (error: any) {
            next(error);
        }
    }
    async removeProfilesFromAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { auth_id } = req.params;
            const { profilesId } = req.body;
            
            if(!auth_id){
                throw new HttpError(400, "Id is required");
            }   
            if(!Array.isArray(profilesId) || profilesId.length < 1){
                throw new HttpError(400, "Profiles are required");
            }

            await this.profileService.removeProfilesFromAuthentication(profilesId, auth_id);
            res.status(200).send("Profiles removed from authentication");
        }catch(error: any){
            next(error);
        }
    }
    async getGrantsByProfileId(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;
            if(!id){
                throw new HttpError(400, "Id is required");
            }
            const grants = this.profileService.getGrantsByProfileId(id);
            res.status(200).send(grants);

        } catch (error: any) {
            next(error);
        }
    }
    async addProfileToGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;
            const { grantsId } = req.body;
            
            if(!id){
                throw new HttpError(400, "Id is required");
            }
             if(!Array.isArray(grantsId) || grantsId.length < 1){
                throw new HttpError(400, "Profiles are required");
            }
            await this.profileService.addProfileToGrants(id, grantsId);
            
            res.status(201).send("Profiles added to grant");
        } catch (error: any) {
            next(error);
        }
    }

    async removeProfileFromGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { id } = req.params;
            const { grantsId } = req.body;

            if(!id){
                throw new HttpError(400, "Id is required");
            }
            if(!Array.isArray(grantsId) || grantsId.length < 1){
                throw new HttpError(400, "Profiles are required");
            }
            await this.profileService.removeProfileFromGrants(id, grantsId);
            res.status(200).send("Profiles removed from grant");
        } catch (error: any) {
            next(error);
        }
    }
    async getProfilesByAuthenticationId(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void> {
        try {
            const { authId } = req.params;
            if(!authId){
                throw new HttpError(400, "authId is required");
            }
            const profiles = await this.profileService.getProfilesByAuthenticationId(authId);
            res.status(200).send(profiles);
        } catch (error: any) {
            next(error);
        }
    }
}

export default ProfileController.getInstance();