import { GetUserByIdUseCase } from '../use-cases/index.js'
import {
    checkIsIdValid,
    invalidIdResponse,
    ok,
    serverError,
    userNotFoundResponse,
} from './helpers/index.js'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIdValid = checkIsIdValid(httpRequest.params.userId)
            if (!isIdValid) {
                return invalidIdResponse()
            }
            const getUserByIdUseCase = new GetUserByIdUseCase()
            const user = await getUserByIdUseCase.execute(
                httpRequest.params.userId,
            )
            if (!user) {
                return userNotFoundResponse()
            }
            return ok(user)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
