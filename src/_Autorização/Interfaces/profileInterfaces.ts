import { IAuthentication } from "../../_Autenticacao/Interfaces/authInterfaces"
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
}

export interface IProfileService {
    findAll(): Promise<IProfile[]>
    findById(id: string): Promise<IProfile | null>
    createProfile(profileData: IProfileParams): Promise<void | null>
    updateProfile(id: string, updateData: Partial<IProfileParams>): Promise<void>
    deleteProfile(id: string): Promise<void>
    
    addProfilesToAuthentication(profilesId: string[], userId: string): Promise<void>
    removeProfilesFromAuthentication(profilesId: string[], authId: string): Promise<void>
    
    addProfileToGrants(profileId: string, grantsId: string[]): Promise<void>
    removeProfileFromGrants(profileId: string, grantsId: string[]): Promise<void>
}