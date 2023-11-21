import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Method {
  CARD = 'Card',
  PAYPAL = 'Paypal',
  BANK_TRANSFER = 'Bank Transfer',
}

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  payment_method_id: number;

  @Column('enum', { enum: Method, default: Method.CARD })
  name: Method;
}
