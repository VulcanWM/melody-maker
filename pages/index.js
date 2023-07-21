import Layout from '@/components/layout'

export default function Home() {
  return (
    <Layout>
      <h1>Melody Maker</h1>
      <form>
        <fieldset>
          <legend>Tonality</legend>
            <select id="tonality">
              <option value="major">Major</option>
              <option value="minor">Minor</option>
            </select>
        </fieldset>
        <br/><br/>
        <button>Generate Melody</button>
      </form>
    </Layout>
  )
}
