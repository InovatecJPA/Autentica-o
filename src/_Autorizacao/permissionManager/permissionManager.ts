import fs from "fs";
import path from "path";
import { match } from "path-to-regexp";

interface IGrants {
    method: string;
    path: string;
    description: string;
    profiles: string[];
}

class PermissionManager {
    private static instance: PermissionManager;
    private grants: IGrants[];

    private constructor() {
        this.grants = this.loadPermissions();
    }

    public static getInstance(): PermissionManager {
        if (!PermissionManager.instance) {
            PermissionManager.instance = new PermissionManager();
        }
        return PermissionManager.instance;
    }

    private loadPermissions(): IGrants[] {
        const filePath = path.resolve(__dirname, "./permissions.jsonc");
        if (!fs.existsSync(filePath)) {
            throw new Error("Arquivo permissions.jsonc não encontrado.");
        }
        return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    public reloadPermissions(): void {
        this.grants = this.loadPermissions();
        console.log("🔄 Permissões recarregadas com sucesso!");
    }

    public hasAccess(userProfiles: string[], requestMethod: string, requestPath: string): boolean {
        return this.grants.some((grant) => {
            if (grant.method.toUpperCase() !== requestMethod) {
                return false;
            }

            const isMatch = match(grant.path, { decode: decodeURIComponent });
            const matched = isMatch(requestPath);

            return matched && grant.profiles.some((profile) => userProfiles.includes(profile));
        });
    }
}

export default PermissionManager;
