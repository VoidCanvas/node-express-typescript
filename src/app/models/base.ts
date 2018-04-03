import {
  IBase,
} from '../interfaces/models';
import { PrimaryGeneratedColumn, getConnection, getRepository } from '../decorators/model';

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

  decorateMe(obj:any) {
    // use this function to initialize the model from a given object.
    // 
  }

} 
