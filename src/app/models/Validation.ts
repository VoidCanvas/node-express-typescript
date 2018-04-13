import { ValidationError } from '../decorators/validator';


export class Validation {
  isValid: boolean;
  errors: ValidationError[];
  message?: string;
  code?: number;
}
