import Layout from '@/components/layout'
import Vex from 'vexflow';
import * as Tone from 'tone';
import MidiWriter from 'midi-writer-js';
import styles from '@/styles/index.module.css'
import { useRouter } from 'next/router'

export default function Home() {
  const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental, Dot } = Vex.Flow;

  var melody = "";
  var lengthOfMelody = 0;
  var melodyExists = false;

  const router = useRouter()
  const melodyUrl = decodeURI(router.query.melody);
  const lengthUrl = router.query.length;

  if (lengthUrl && melodyUrl){
    var href;
    if (typeof window !== 'undefined') {
      href = window.location.href;
    }
    const split = href.split("/")
    const last = split[split.length - 1]
    var melodyReal = last.replace("?", "")
    melodyReal = melodyReal.replace("&", "")
    melodyReal = melodyReal.replace(`length=${lengthUrl}`, "")
    melodyReal = melodyReal.replace("melody=", "")
    melodyReal = melodyReal.replace("share", "")
    melody = melodyReal;
    var length_idk = 0;
    for (let note_info of melody.split("-")){
        const length = parseFloat(note_info.split(":")[1])
        length_idk += parseFloat(length)
    }
    lengthOfMelody = parseFloat(lengthUrl)
    if (length_idk == lengthOfMelody){
        melodyExists = true;
        highlightNote(null, melody, lengthOfMelody)
    }
  }

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
    context.clearRect(0,0,750,200)

    const stave = new Stave(10, 40, 700);
    stave.addClef("treble")
    stave.setContext(context).draw();
    console.log(notes)
    const vf_notes = []
    for (let this_note_num in notes.split("-")){
      const note_info = notes.split("-")[this_note_num]
      console.log(note_info)
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

  function playMelody(){
    const synth = new Tone.Synth().toDestination();
    var after = 0;
    var notes_dict = {}
    for (let this_note_num in melody.split("-")){
      const note_info = melody.split("-")[this_note_num]
      const note = note_info.split(":")[0].toUpperCase() + "4"
      const length = note_info.split(":")[1]
      synth.triggerAttackRelease(note, parseFloat(length), Tone.now() + after);
      after += parseFloat(length);
      for (let i=(after-length); i <= after; i += 0.1){
        notes_dict[Math.round(i*10)/10] = this_note_num;
      }
    }
    
    highlightNote(0, melody, lengthOfMelody)
    var time = 0.2;
    var interval = setInterval(function() { 
      time = Math.round(time*10)/10
      if (time <= lengthOfMelody) {
        highlightNote(notes_dict[time], melody, lengthOfMelody)
        time+=0.1;
      }
      else { 
        clearInterval(interval);
        highlightNote(null, melody, lengthOfMelody)
      }
    }, 100);

  }

  return (
    <Layout>
      <h1>Melody Maker</h1>
      <h2 id="outputTitle"></h2>
      <div id="output"></div>
        {melodyExists ? 
            <>
                <button className={styles.inline_button} onClick={playMelody}>Play Melody</button>
                <button className={styles.inline_button} onClick={download}>Export as MIDI</button>
                <button className={styles.inline_button} onClick={() => {navigator.clipboard.writeText(`https://melody-maker-theta.vercel.app/share?length=${lengthOfMelody}&melody=${melody}`)}}>Copy Melody Link to Share</button><br/><br/>
                <button onClick={() => router.push("/")}>Generate another melody</button>
            </> : 
            <>
                <h3 className="red">Incorrect sharing url!</h3>
                <button onClick={() => router.push("/")}>Generate a melody</button>
            </>
        }
    </Layout>
  )
}
