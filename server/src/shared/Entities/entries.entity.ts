// Other dependencies
import {
    Column,
    Entity,
    ObjectID,
    ObjectIdColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
} from 'typeorm'

@Entity(`Entries`)
export class EntriesEntity {
    constructor(partial: Partial<EntriesEntity>) {
        Object.assign(this, partial)
    }

    @ObjectIdColumn()
    id: ObjectID

    @Column()
    title_id: string

    @Column()
    text: string

    @Column()
    votes: number

    @Column({
        type: `varchar`,
        length: 17,
    })
    written_by: string

    @Column({
        type: `varchar`,
        length: 17,
    })
    updated_by: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @BeforeInsert()
    fillDefaults() {
        this.votes = 0
    }
}
