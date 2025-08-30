export enum RoomType {
  SINGLE = "SINGLE",
  DOUBLE = "DOUBLE",
  DELUXE = "DELUXE",
  SUITE = "SUITE",
}

export enum RoomStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
}

export type EmployeeRole =
  | "MANAGER"
  | "RECEPTIONIST"
  | "HOUSEKEEPING"
  | "MAINTENANCE"
  | "KITCHEN";

export enum EmployeeRole2 {
  MANAGER = "MANAGER",
  RECEPTIONIST = "RECEPTIONIST",
  HOUSEKEEPING = "HOUSEKEEPING",
  MAINTENANCE = "MAINTENANCE",
  KITCHEN = "KITCHEN",
}

export enum ServicePricingType {
  PER_ORDER = "PER_ORDER",
  PER_NIGHT = "PER_NIGHT",
  PER_HOUR = "PER_HOUR",
}
