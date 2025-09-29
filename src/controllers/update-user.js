import validator from 'validator'
import { badRequest, ok, serverError } from './helpers.js'
import { UpdateUserUseCase } from '../use-cases/update-user.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId
            const isIdValid = validator.isUUID(userId)
            if (!isIdValid) {
                return badRequest({
                    errorMessage: 'The provided ID is not valid.',
                })
            }
            const updateUserParams = httpRequest.body
            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]
            const someFieldIsNotAllowed = Object.keys(updateUserParams).some(
                (field) => !allowedFields.includes(field),
            )
            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some fields are not allowed to be updated',
                })
            }
            if (updateUserParams.password) {
                const passwordIsNotValid = updateUserParams.password.length < 6
                if (passwordIsNotValid) {
                    return badRequest({
                        message: 'Password must be at least 6 characters long',
                    })
                }
            }
            if (updateUserParams.email) {
                const emailIsValid = validator.isEmail(updateUserParams.email)
                if (!emailIsValid) {
                    return badRequest({
                        message:
                            'Invalid email format. Please provide a valid email address.',
                    })
                }
            }

            const updateUserUseCase = new UpdateUserUseCase()
            const updateUser = await updateUserUseCase.execute(
                userId,
                updateUserParams,
            )
            return ok(updateUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message })
            }
            console.error(error)
            return serverError()
        }
    }
}
