export interface IGrants{
    id: string
    method: string
    path: string
    description: string | null
    createdAt: Date
    updatedAt: Date
}

export interface IGrantsParams{
    method: string
    path: string
    description: string | null
}

export interface IGrantsRepository{
    findAll(): Promise<IGrants[]>
    findById(id: string): Promise<IGrants | null> 
    createGrants(grantsData: IGrantsParams): Promise<IGrants | null>
    updateGrants(id: string, updateData: Partial<IGrantsParams>): Promise<IGrants | null>
    deleteGrants(id: string): Promise<void>
}

export interface IGrantsService{
    findAll(): Promise<IGrants[]>
    findById(id: string): Promise<IGrants | null> 
    createGrants(grantsData: IGrantsParams): Promise<IGrants | null>
    updateGrants(id: string, updateData: Partial<IGrantsParams>): Promise<IGrants | null>
    deleteGrants(id: string): Promise<void>
}