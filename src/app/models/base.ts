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
  static async findById<T>(id:number):Promise<T> {
    const result = await getRepository<T>(this)
      .createQueryBuilder('base')
      .where('base.id = :id', { id })
      .getOne();
    return result;
  }
  
  // to fetch one record
  static async findOne<T>(obj:any):Promise<T> {
    const result = await getRepository<T>(this)
    .findOne(obj);
    return result;
  }  
  
  // to fetch records
  static async find<T>(obj:any):Promise<T[]> {
    const result = await getRepository<T>(this)
    .find(obj);
    return result;
  }

  async save():Promise<Base> {
    const validate1 = await this.validate();
    if (!validate1.isValid) {
      throw new Error('Instance not valid');
    }
    const result = await getRepository(this.constructor)
    .save(this);
    return result;
  }

  async delete():Promise<boolean> {
    try {
      const result = await getRepository(this.constructor)
    .delete(this);
      return true;
    } catch (e) {
      return false;
    }
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

