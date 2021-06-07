import {Entity, Column, UpdateDateColumn, CreateDateColumn, PrimaryGeneratedColumn, Generated} from 'typeorm';

@Entity('user_tokens')
class UserToken{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Generated('uuid')
    token: string;

    @Column('uuid')
    user_id: string;

    // @Column('timestamp with time zone')
    // date: Date

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;    

}

export default UserToken;