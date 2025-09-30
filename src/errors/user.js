export class EmailAlreadyInUseError extends Error {
    constructor(email) {
        super(`The e-amil ${email} is already in use.`)
        this.name = 'EmailAlreadyInUseError'
    }
}
