import Layout from '@/components/layout'
import { useForm } from "react-hook-form";
import { generate_melody_notes } from '@/music/functions'

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    const tonality = data.tonality;
    const notes = generate_melody_notes(tonality);
    console.log(notes)
  };

  return (
    <Layout>
      <h1>Melody Maker</h1>
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
    </Layout>
  )
}
