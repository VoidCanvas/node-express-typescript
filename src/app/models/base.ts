import {
  IBase,
} from '../interfaces/models';
import { PrimaryGeneratedColumn, getConnection, getRepository } from '../decorators/model';
import { Validation } from '../models';
import { execute } from '../database/client';
import { validate } from '../decorators/validator';


export class Base implements IBase{
  
  // all inherited entities to have a primary auto incremented id column
  @PrimaryGeneratedColumn()
  id: number;
  
  // to fetch record by id
  static async findById(id:number):Promise<Base> {
    const result = await getRepository(this)
      .createQueryBuilder('base')
      .where('base.id = :id', { id })
      .getOne();
    return result;
  }

  async save():Promise<Base> {
    const result = await getRepository(this.constructor)
    .save(this);
    return result;
  }

  constructor(obj?:Object) {
    // use this function to initialize the model from a given object.
    // 
  }

  // override this to validate
  async validate():Promise<Validation> {
    return validate(this);
  }

} 

