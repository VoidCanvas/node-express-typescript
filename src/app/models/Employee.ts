import { Base } from './base';
import { Entity, Column, PrimaryGeneratedColumn } from '../decorators/model';
import { validate, IsNotEmpty, IsAlpha, Length } from '../decorators/validator';
import { Validation } from '../models';

@Entity()
export class Employee extends Base {

  @Column()
  @IsNotEmpty()
  @IsAlpha()
  @Length(2, 30)
  name: string;
  
  @Column()
  @IsNotEmpty()
  address: string;

  constructor(obj?:{
    name : string,
    address ?: string,
  }) {
    super(obj);
    if (obj) {
      this.name = obj.name;
      this.address = obj.address;
    }
  }
}
