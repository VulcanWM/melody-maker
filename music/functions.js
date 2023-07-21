import * as Scale from "tonal-scale"

export const octave = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const length_options = [0.5, 0.5, 0.5, 0.5, 0.5, 1, 1, 1, 1, 1, 1.5, 1.5, 2]

export function get_scale_notes(note, tonality){
  return Scale.notes(note + " " + tonality)
}

export function generate_melody_notes(tonality){
    const key = octave[Math.floor(Math.random()*octave.length)];
    const scale_notes = get_scale_notes(key, tonality);
    var length = length_options[Math.floor(Math.random()*length_options.length)];
    const first_note = scale_notes[Math.floor(Math.random()*scale_notes.length)];
    var length_of_melody = length;
    var melody = `${first_note}:${length}-`;
    while (length_of_melody < 13){
        length = length_options[Math.floor(Math.random()*length_options.length)];
        let note = scale_notes[Math.floor(Math.random()*scale_notes.length)];
        melody += `${note}:${length}-`;
        length_of_melody += length;
    }
    length = length_options[Math.floor(Math.random()*length_options.length)];
    melody += `${first_note}:${length}`
    return [melody, (length_of_melody+length)]
}