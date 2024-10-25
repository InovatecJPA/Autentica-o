import { IAuthentication } from "../../_Autenticacao/Interfaces/authInterfaces"
import { IAppRouter } from "../../interfaces/appInterface"
import { IHttpNext, IHttpRequest, IHttpResponse } from "../../interfaces/httpInterface"
import { IGrants } from "./grantsInterfaces"

export interface IProfile {
    id: string
    name: string
    description: string | null
    createdAt: Date
    updatedAt: Date
}

export interface IProfileParams {
    name: string
    description: string | null
}

export interface IProfileRepository {
    findAll(): Promise<IProfile[]>
    findById(id: string): Promise<IProfile | null>
    findByIds(ids: string[]): Promise<IProfile[]>
    findByName(name: string): Promise<IProfile | null>
    createProfile(profileData: IProfile): Promise<IProfile | null>
    updateProfile(id: string, updateData: Partial<IProfileParams>): Promise<IProfile>
    deleteProfile(id: string): Promise<void>

    getAuthenticationsByProfileId(profile: IProfile): Promise<IAuthentication[]>
    addProfilesToAuthentication(profiles: IProfile[], auth: IAuthentication): Promise<void>
    removeProfilesFromAuthentication(profiles: IProfile[], auth: IAuthentication): Promise<void>

    getGrantsByProfileId(profile: IProfile): Promise <IGrants[]>
    addProfileToGrants(profile: IProfile, grants: IGrants[]): Promise<void>
    removeProfileFromGrants(profile: IProfile, grants: IGrants[]): Promise<void>

    getProfilesByAuthenticationId(authenticationId: string): Promise<IProfile[]>
    getProfilesByGrantsId(grantsId: string[]): Promise<IProfile[]>
}

export interface IProfileService {
    findAll(): Promise<IProfile[]>
    findById(id: string): Promise<IProfile | null>
    createProfile(profileData: IProfileParams): Promise<void | null>
    updateProfile(id: string, updateData: Partial<IProfileParams>): Promise<void>
    deleteProfile(id: string): Promise<void>
    
    getAuthenticationsByProfileId(profileId: string): Promise<IAuthentication[]>
    addProfilesToAuthentication(profilesId: string[], userId: string): Promise<void>
    removeProfilesFromAuthentication(profilesId: string[], authId: string): Promise<void>
    
    getGrantsByProfileId(profileId: string): Promise<IGrants[]>
    addProfileToGrants(profileId: string, grantsId: string[]): Promise<void>
    removeProfileFromGrants(profileId: string, grantsId: string[]): Promise<void>

    getProfilesByAuthenticationId(authenticationId: string): Promise<IProfile[]>
}

export interface IProfileController {
    findAll(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>
    findById(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>
    createProfile(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>
    updateProfile(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>
    deleteProfile(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>

    getAuthenticationsByProfileId(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>
    addProfilesToAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>
    removeProfilesFromAuthentication(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>

    getGrantsByProfileId(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>
    addProfileToGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>
    removeProfileFromGrants(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>

    getProfilesByAuthenticationId(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): Promise<void>
}

export interface IProfileRouter {
    registerRoutes(basePath: string, app: IAppRouter): void
}