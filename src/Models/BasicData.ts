import { BasicMod } from "./BasicMod";

export interface BasicData {
  name: string;
  cpuSpeed: UnitVale;
  cpuTemp?: UnitVale;
  cpuLoad?: UnitVale;
  latency: UnitVale;
  ram: RamData;
  mods?: BasicMod[];
}

export interface UnitVale {
  unit: string;
  value: number;
}

export interface RamData {
  used: number;
  total: number;
  unit: string;
}
