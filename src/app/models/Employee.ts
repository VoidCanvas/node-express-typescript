import { Base } from './base';
import { Entity, Column, PrimaryGeneratedColumn } from '../decorators/model';

@Entity()
export class Employee extends Base {

  @Column()
  name: string;
  
  @Column()
  address: string;

}
