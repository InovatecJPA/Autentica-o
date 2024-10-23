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
    findByName(name: string): Promise<IProfile | null>
    createProfile(profileData: IProfile): Promise<IProfile | null>
    updateProfile(id: string, updateData: Partial<IProfileParams>): Promise<IProfile>
    deleteProfile(id: string): Promise<void>

    addGrantToProfile(profileId: IProfile, grantId: IGrants): Promise<void>
    addGrantsToProfile(profileId: IProfile, grants: IGrants[]): Promise<void>
    removeGrantFromProfile(profileId: IProfile, grantId: IGrants): Promise<void>
    removeGrantsFromProfile(profileId: IProfile, grants: IGrants[]): Promise<void>
    getGrantsByProfileId(profileId: IProfile): Promise <IGrants[]>
}

export interface IProfileService {
    findById(id: string): Promise<IProfile | null>
    findAll(): Promise<IProfile[]>
    createProfile(profileData: IProfileParams): Promise<void | null>
    updateProfile(id: string, updateData: Partial<IProfileParams>): Promise<void>
    deleteProfile(id: string): Promise<void>
    addProfileToUser(userId: string, profileId: string): Promise<void>
    removeProfileFromUser(userId: string, profileId: string): Promise<void>
    addGrantsToProfile(grantsId: string[], profileId: string): Promise<void>
    removeProfileFromGrants(grantId: string, profileId: string): Promise<void>
}