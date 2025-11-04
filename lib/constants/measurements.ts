export const defaultMeasurements = {
  shirt: {
    length: "",
    chest: "",
    sleeve: "",
    shoulder: "",
    waist: "",
    neck: "",
    front: "",
  },
  pant: {
    length: "",
    hip: "",
    ankles: "",
    thighs: "",
    rise: "",
    knee: "",
    waist: "",
  },
} as const;

export type ShirtMeasurements = typeof defaultMeasurements.shirt;
export type PantMeasurements = typeof defaultMeasurements.pant;
export type MeasurementForm = ShirtMeasurements | PantMeasurements;
export type MeasurementType = keyof typeof defaultMeasurements;
