import * as Scale from "tonal-scale"

export const octave = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function get_scale_notes(note, tonality){
  return Scale.notes(note + " " + tonality)
}
