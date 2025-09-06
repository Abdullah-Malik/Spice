export enum ErrorNames {
  AUTHENTICATION_ERROR = 'AuthenticationError',
  AUTHORIZATION_ERROR = 'AuthorizationError',
  TOKEN_EXPIRED_ERROR = 'TokenExpiredError',
  INVALID_TOKEN_ERROR = 'InvalidTokenError',
  USER_ALREADY_EXISTS_ERROR = 'UserAlreadyExistsError',
  INVALID_CREDENTIALS_ERROR = 'InvalidCredentialsError',
  USER_NOT_FOUND_ERROR = 'UserNotFoundError',
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication error') {
    super(message);
    this.name = ErrorNames.AUTHENTICATION_ERROR;
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Insufficient permissions') {
    super(message);
    this.name = ErrorNames.AUTHORIZATION_ERROR;
  }
}

export class TokenExpiredError extends Error {
  constructor(message: string = 'Token has expired') {
    super(message);
    this.name = ErrorNames.TOKEN_EXPIRED_ERROR;
  }
}

export class InvalidTokenError extends Error {
  constructor(message: string = 'Invalid token') {
    super(message);
    this.name = ErrorNames.INVALID_TOKEN_ERROR;
  }
}

export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`A user with email ${email} already exists.`);
    this.name = ErrorNames.USER_ALREADY_EXISTS_ERROR;
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials');
    this.name = ErrorNames.INVALID_CREDENTIALS_ERROR;
  }
}

export class UserNotFoundError extends Error {
  constructor(identifier?: string) {
    super(identifier ? `User with identifier ${identifier} not found.` : 'User not found.');
    this.name = ErrorNames.USER_NOT_FOUND_ERROR;
  }
}
