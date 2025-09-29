import { DeleteUserUseCase } from '../use-cases/index.js'
import {
    checkIsIdValid,
    invalidIdResponse,
    ok,
    serverError,
} from './helpers/index.js'

export class DeleteUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const idIsValid = checkIsIdValid(userId)
            if (!idIsValid) {
                return invalidIdResponse()
            }
            const deleteUserUseCase = new DeleteUserUseCase()
            const deletedUser = await deleteUserUseCase.execute(userId)
            return ok(deletedUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
