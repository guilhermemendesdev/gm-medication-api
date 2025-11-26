export class Medication {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly type: string,
    public readonly imageUrl?: string,
    public readonly createdAt: Date = new Date(),
  ) {}

  static create(props: {
    id: string;
    name: string;
    description: string;
    type: string;
    imageUrl?: string;
    createdAt?: Date;
  }): Medication {
    return new Medication(
      props.id,
      props.name,
      props.description,
      props.type,
      props.imageUrl,
      props.createdAt || new Date(),
    );
  }
}

