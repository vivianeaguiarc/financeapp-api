import { PostgresGetUserByIdRepository } from '../repositories/postgres/create-user'

export class GetUserByIdUseCase {
    async execute(userId) {
        const getUserByIdRepository = new PostgresGetUserByIdRepository()
        const user = await getUserByIdRepository.execute(userId)
        return user
    }
}
