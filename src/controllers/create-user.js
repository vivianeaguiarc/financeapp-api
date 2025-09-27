import { CreateUserUseCase } from '../use-cases/create-user.js'
import { badRequest, serverError, created } from './helpers.js'
import validator from 'validator'

export class CreateUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]
            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({
                        message: `Missing or empty field: ${field}`,
                    })
                }
            }
            const passwordIsValid = params.password < 6
            if (passwordIsValid) {
                return badRequest({
                    message: 'Password must be at least 6 characters long',
                })
            }

            const emailIsValid = validator.isEmail(params.email)
            if (!emailIsValid) {
                return badRequest({
                    message:
                        'Invalid email format. Please provide a valid email address.',
                })
            }
            const createUserUseCase = new CreateUserUseCase()
            const createdUser = await createUserUseCase.execute(params)
            return created(createdUser)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
