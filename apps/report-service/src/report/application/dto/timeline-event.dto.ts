import { ApiProperty } from '@nestjs/swagger';

export enum TimelineEventTypeDto {
  TAKEN = 'TAKEN',
  LATE = 'LATE',
  MISSED = 'MISSED',
}

export class TimelineEventDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: TimelineEventTypeDto })
  type!: TimelineEventTypeDto;

  @ApiProperty()
  scheduledAt!: Date;

  @ApiProperty({ nullable: true })
  occurredAt!: Date | null;

  @ApiProperty({ nullable: true })
  delayInMinutes!: number | null;

  @ApiProperty({ required: false })
  medicationName?: string;

  @ApiProperty({ required: false })
  dose?: string;
}

