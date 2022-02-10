import {Track} from "./Track";

export class Device {
  id: string;
  number: number;
}

export class Table extends Device {
  type = DeviceType.TABLE;
  play = true;
  recording = false;
  playingRecording = false;
  volume = 100;
  selectedTrack: Track = new Track();
}

export class Phone extends Device {
  type = DeviceType.PHONE
  table?: Table
}

export enum DeviceType {
  TABLE = "Table",
  PHONE = "Phone"
}

