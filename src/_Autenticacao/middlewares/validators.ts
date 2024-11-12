import { IHttpNext, IHttpRequest, IHttpResponse } from "../../interfaces/httpInterface";
import HttpError from "../../utils/customErrors/httpError";
import { externalRegisterLoginSchema, idSchema, standardRegisterLoginSchema } from "../../utils/validationSchemas/autenticacaoSchemas";


function validateId(req: IHttpRequest, res: IHttpResponse, next: IHttpNext): void {
    const { error } = idSchema.validate(req.params);

    if (error) {
        return next(new HttpError(400, error.details[0].message));
    }
}

function validateStandardRegisterLogin(req:IHttpRequest, res: IHttpResponse, next: IHttpNext): void {
    const { error } = standardRegisterLoginSchema.validate(req.body);

    if (error) {
        return next(new HttpError(400, error.details[0].message))
    }
}

function validateExternalRegisterLogin(req:IHttpRequest, res: IHttpResponse, next: IHttpNext): void {
    const { error } = externalRegisterLoginSchema.validate(req.body);

    if (error) {
        return next(new HttpError(400, error.details[0].message))
    }
}

export {
    validateId,
    validateStandardRegisterLogin,
    validateExternalRegisterLogin
}