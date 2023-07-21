import Layout from '@/components/layout'
import { useForm } from "react-hook-form";
import { generate_melody_notes } from '@/music/functions'
import { useState } from 'react'
import Vex from 'vexflow';

export default function Home() {
  const [melodyExists, setMelodyExists] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    // get tonality from form
    const tonality = data.tonality;

    // get notes and length of melody from the function
    const [notes, length_of_melody] = generate_melody_notes(tonality);

    // change usestate variable to true
    setMelodyExists(true);

    // generate sheet music
    const { Renderer, Stave, StaveNote, Voice, Formatter } = Vex.Flow;
    const div = document.getElementById("output");
    console.log(div)
    const renderer = new Renderer(div, Renderer.Backends.SVG);
    renderer.resize(600, 200);
    const context = renderer.getContext();
    context.setBackgroundFillStyle("white");
    context.clearRect(0,0,550,200)

    // Create a stave of width 400 at position 10, 40 on the canvas.
    const stave = new Stave(10, 40, 500);

    // Add a clef and time signature.
    stave.addClef("treble").addTimeSignature("4/4");

    // Connect it to the rendering context and draw!
    stave.setContext(context).draw();

    const vf_notes = []

    for (let note_info of notes.split("-")){
      const note = note_info.split(":")[0]
      const length = note_info.split(":")[1]
      var vf_length;
      if (length == 1){
        vf_length = "q"
      } else if (length == 0.5){
        vf_length = "8"
      } else if (length == 1.5){
        vf_length = ":qd"
      } else if (length == 2){
        vf_length = "h"
      }
      vf_notes.push(new StaveNote({clef: "treble", keys: [`${note}/4`], duration: vf_length }))
    }
    
    // Create a voice in 4/4 and add above notes
    var voice = new Voice({num_beats: length_of_melody,  beat_value: 4});
    voice.addTickables(vf_notes);
    
    // Format and justify the notes to 400 pixels.
    var formatter = new Formatter().joinVoices([voice]).format([voice], 400);
    
    // Render voice
    voice.draw(context, stave);
  };

  return (
    <Layout>
      <h1>Melody Maker</h1>
      <div id="output" style={{background: "#fffff"}}></div>
      {melodyExists ? 
      <>
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
          {errors.exampleRequired && <p>This field is required</p>}
          <button>Generate Melody</button>
        </form>
      }
    </Layout>
  )
}
