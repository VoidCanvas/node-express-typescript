const bcrypt = require('bcrypt');
import { Base } from './base';
import { Entity, Column, PrimaryGeneratedColumn } from '../decorators/model';
import { validate, IsNotEmpty, IsAlpha, Length, IsEmail, ValidationError  } from '../decorators/validator';
import { Validation } from '../models';

const SALT_ROUNDS = 10;

@Entity()
export class User extends Base {

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  constructor(obj?:{
    name : string,
    password ?: string,
    email ?: string,
  }) {
    super(obj);
    if (obj) {
      this.name = obj.name;
      this.email = obj.email;
      this.password = bcrypt.hashSync(obj.password, SALT_ROUNDS);
    }
  }

  async validate(): Promise<Validation> {
    const validate = await super.validate();
    if (!validate.isValid) {
      return validate;
    }
    const user = await User.findOne({
      email: this.email,
    });
    if (user) {
      const error = new ValidationError();
      error.property = 'email';
      error.constraints = {
        duplicate: 'This user already exists',
      };
      validate.errors = [error];
    }
    return validate;
  }

  static async invalidate(obj: {
    email?: string,
    password?: string,
  }= {}): Promise<User|null> {
    const user = await User.findOne<User>({
      email: obj.email,
    });
    if (!user) {
      return null;
    }
    const isPasswordMatched = await bcrypt.compare(obj.password, user.password);
    return isPasswordMatched ? user : null;
    
  }
}
