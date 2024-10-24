import { IGrants, IGrantsParams, IGrantsRepository, IGrantsService } from "../Interfaces/grantsInterfaces";
import { createGrantsRepository } from "../repositories/factoryAuthorizationRepository";

class GrantsService implements IGrantsService{
    private static instance: GrantsService;
    private grantsRepository: IGrantsRepository;
    
    private constructor (grantsRepository: IGrantsRepository){ 
        this.grantsRepository = grantsRepository;
    }
    
    public static getInstance(): GrantsService {
        if(!GrantsService.instance){
            GrantsService.instance = new GrantsService(createGrantsRepository());
        }
        return GrantsService.instance;
    }
    
    findAll(): Promise<IGrants[]> {
        throw new Error("Method not implemented.");
    }
    findByIds(ids: string[]): Promise<IGrants[]> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<IGrants | null> {
        throw new Error("Method not implemented.");
    }
    createGrants(grantsData: IGrantsParams): Promise<IGrants | null> {
        throw new Error("Method not implemented.");
    }
    updateGrants(id: string, updateData: Partial<IGrantsParams>): Promise<IGrants | null> {
        throw new Error("Method not implemented.");
    }
    deleteGrants(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}

export default GrantsService.getInstance();