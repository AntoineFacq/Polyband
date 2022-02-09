export class Device {
  id: string;
  number: number;
}

export class Table extends Device {
  type = DeviceType.TABLE;
  play = false;
  recording = false;
  playingRecording = false;
}

export class Phone extends Device {
  type = DeviceType.PHONE
  table?: Table
}

export enum DeviceType {
  TABLE = "Table",
  PHONE = "Phone"
}

