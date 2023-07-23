import Layout from '@/components/layout'
import { useForm } from "react-hook-form";
import { generate_melody_notes } from '@/music/functions'
import { useState } from 'react'
import Vex from 'vexflow';
import * as Tone from 'tone';
import MidiWriter from 'midi-writer-js';
import styles from '@/styles/index.module.css'

export default function Home() {
  const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental, Dot } = Vex.Flow;

  const [melodyExists, setMelodyExists] = useState(false);
  const [melody, setMelody] = useState("")
  const [lengthOfMelody, setLengthOfMelody] = useState(0)
  const [melodyPlaying, setMelodyPlaying] = useState(false)

  function dotted(staveNote, noteIndex = -1) {
    if (noteIndex < 0) {
      Dot.buildAndAttach([staveNote], {
        all: true
      });
    } else {
      Dot.buildAndAttach([staveNote], {
        index: noteIndex
      });
    }
    return staveNote;
  }

  function highlightNote(note_num, notes, length_of_melody){
    // reset output
    document.getElementById("output").innerHTML = "";

    // generate sheet music
    const div = document.getElementById("output");
    
    const renderer = new Renderer(div, Renderer.Backends.SVG);
    renderer.resize(600, 200);
    const context = renderer.getContext();
    context.setBackgroundFillStyle("white");
    context.clearRect(0,0,800,200)

    const stave = new Stave(10, 40, 750);
    stave.addClef("treble")
    stave.setContext(context).draw();
    const vf_notes = []
    for (let this_note_num in notes.split("-")){
      const note_info = notes.split("-")[this_note_num]
      const note = note_info.split(":")[0]
      const length = note_info.split(":")[1]
      var vf_length;
      if (length == 1){
        vf_length = "q"
      } else if (length == 0.5){
        vf_length = "8"
      } else if (length == 1.5){
        vf_length = "qd"
      } else if (length == 2){
        vf_length = "h"
      }
      if (note_num == this_note_num){
        if (note.length != 1){
          const accidental = note.slice(1)
          if (vf_length == "qd"){
            vf_notes.push(dotted(new StaveNote({
              keys: [`${note}/4`],
              duration: vf_length
            }).addModifier(new Accidental(accidental)).setStyle({fillStyle: "#2393f5", strokeStyle: "#2393f5"})))
          } else {
            vf_notes.push(new StaveNote({
              keys: [`${note}/4`],
              duration: vf_length
            }).addModifier(new Accidental(accidental)).setStyle({fillStyle: "#2393f5", strokeStyle: "#2393f5"}))
          }
        } else {
          if (vf_length == "qd"){
            vf_notes.push(dotted(new StaveNote({
              keys: [`${note}/4`],
              duration: vf_length
            }).setStyle({fillStyle: "#2393f5", strokeStyle: "#2393f5"})))
          } else {
            vf_notes.push(new StaveNote({
              keys: [`${note}/4`],
              duration: vf_length
            }).setStyle({fillStyle: "#2393f5", strokeStyle: "#2393f5"}))
          }
        }
      } else {
        if (note.length != 1){
          const accidental = note.slice(1)
          if (vf_length == "qd"){
            vf_notes.push(dotted(new StaveNote({
              keys: [`${note}/4`],
              duration: vf_length
            }).addModifier(new Accidental(accidental))))
          } else {
            vf_notes.push(new StaveNote({
              keys: [`${note}/4`],
              duration: vf_length
            }).addModifier(new Accidental(accidental)))
          }
        } else {
          if (vf_length == "qd"){
            vf_notes.push(dotted(new StaveNote({
              keys: [`${note}/4`],
              duration: vf_length
            })))
          } else {
            vf_notes.push(new StaveNote({
              keys: [`${note}/4`],
              duration: vf_length
            }))
          }
        }
      }
    }
    
    var voice = new Voice({num_beats: length_of_melody,  beat_value: 4});
    voice.addTickables(vf_notes);
    var formatter = new Formatter().joinVoices([voice]).format([voice], 400);
    voice.draw(context, stave);
  }

  function download() {
    var link = document.createElement("a");
    link.download = "melody.midi";

    // make track
    const track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({instrument: 1}));

    for (let note_info of melody.split("-")){
      const pitch = note_info.split(":")[0] + "4"
      const length = parseFloat(note_info.split(":")[1])
      var midi_length;
      if (length == 0.5){
        midi_length = "8";
      } else if (length == 1){
        midi_length = "4"
      } else if (length == 1.5){
        midi_length = "d4"
      } else if (length == 2){
        midi_length = "2"
      }
      const note = new MidiWriter.NoteEvent({pitch: pitch, duration: midi_length});
      track.addEvent(note);
    }
    const write = new MidiWriter.Writer(track);
    link.href = write.dataUri();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    // get tonality and length from form
    const tonality = data.tonality;
    const length_of_melody = data.length;

    // get notes from the function
    const notes = generate_melody_notes(tonality, length_of_melody);

    // change useState variables
    setMelodyExists(true);
    setMelody(notes)
    setLengthOfMelody(length_of_melody)

    const tonalityCap = tonality.charAt(0).toUpperCase() + tonality.slice(1)
    document.getElementById("outputTitle").innerText = `${tonalityCap} Melody`
    // generate sheet music
    highlightNote(null, notes, length_of_melody)
  };

  function playMelody(){
    var interval;
    if (melodyPlaying == false){
      setMelodyPlaying(true);
      const synth = new Tone.Synth().toDestination();
      var after = 0;
      var notes_dict = {}
      for (let this_note_num in melody.split("-")){
        const note_info = melody.split("-")[this_note_num]
        const note = note_info.split(":")[0].toUpperCase().replace("##", "x") + "4"
        const length = note_info.split(":")[1]
        synth.triggerAttackRelease(note, parseFloat(length), Tone.now() + after);
        after += parseFloat(length);
        for (let i=(after-length); i <= after; i += 0.1){
          notes_dict[Math.round(i*10)/10] = this_note_num;
        }
      }
      
      highlightNote(0, melody, lengthOfMelody)
      var time = 0.2;
      interval = setInterval(function() {
          if (document.getElementById("playingButton") == null || document.getElementById("playingButton").innerText.includes("Play")){
            clearInterval(interval);
            highlightNote(null, melody, lengthOfMelody);
            synth.disconnect()
            setMelodyPlaying(false)
          } else {
            time = Math.round(time*10)/10
            if (time <= lengthOfMelody) {
              highlightNote(notes_dict[time], melody, lengthOfMelody)
              time+=0.1;
            }
            else { 
              clearInterval(interval);
              highlightNote(null, melody, lengthOfMelody)
            }
          }
      }, 100);
    } else {
      setMelodyPlaying(false);
    }

  }

  return (
    <Layout>
      <h1>Melody Maker</h1>
      <h2 id="outputTitle"></h2>
      <div id="output"></div>
      {melodyExists ? 
      <>
        <button className={styles.inline_button} id="playingButton" onClick={playMelody}>{melodyPlaying ? "Stop" : "Play"} Melody</button>
        <button className={styles.inline_button} onClick={download}>Export as MIDI</button>
        <button className={styles.inline_button} onClick={() => {navigator.clipboard.writeText(`https://melody-maker-theta.vercel.app/share?melody=${encodeURIComponent(melody)}`)}}>Copy Melody Link to Share</button><br/><br/>
        <button onClick={() => setMelodyExists(false)}>Generate another melody</button>
      </> : 
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <legend>Tonality</legend>
              <select id="tonality" {...register("tonality", { required: true })}>
                <option value="major">Major</option>
                <option value="minor">Minor</option>
              </select>
          </fieldset>
          <br/><br/>
          <fieldset>
            <legend>Length</legend><br/>
              <input defaultValue="15" type="number" min="5" max="15" id="length" {...register("length", { required: true })}/>
          </fieldset>
          <br/><br/>
          {errors.exampleRequired && <p>This field is required</p>}
          <button>Generate Melody</button>
        </form>
      }
    </Layout>
  )
}
