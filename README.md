## Inspiration
- During music lessons, I struggled to easily generate new melodies on my own. This inspired me to create the melody make, a tool to help automatically generate melodies in a simple way. By automating the process of melody generation, the melody make aims to help people like myself who find it difficult to come up with new melodies from scratch.
- I used MuseScore, a software for editing sheet music, as inspiration for the melody make. When rendering sheet music in MuseScore and playing it back, MuseScore highlights the current note that is being played. This feature gave me the idea to highlight notes as they are generated in the melody make, to help users visualise and follow along with the automatically generated melody in real time.
- After seeing some of the complex AI music generation tools on the market, I wanted to take a simpler approach - creating melodies just by stringing together random notes. I figured this barebones technique could still produce interesting and enjoyable melodies, and would be a fun experiment in automated music composition. The melody make aims to demonstrate that even a random sequence of notes, when played at the right tempo and rhythm, can form the basis of a catchy tune.

## What it does
- Allows users to generate melodies based on two inputs: tonality and length. The user specifies a tonality (major or minor) and a length in beats (the BPM is 60, so each beat is 1 second long), and the tool generates an original melody that fits those parameters.
- Displays the generated melody in sheet music notation, highlighting the notes as they play so users can see and hear how the melody was created. This helps users learn from the generated melodies.
- Exports the melody as a MIDI file so users can save, edit and share their generated melodies with others.
- Provides a unique URL that plays the generated melody. This allows users to easily share the melodies they create with others, without requiring the other person to download or open any files. Anyone with the URL can hear the melody in their browser.

## How I built it
- I built the main front-end interface using Next.js, a React framework for server-rendered and static websites. Next.js enabled me to extract the melody ID parameter from the URL on the share page, allowing users to load a specific generated melody.
- I used React components within the Next.js app to build the user interface.
- I utilized VexFlow, an open-source JavaScript library for rendering sheet music, to display the generated melodies in sheet music notation within the browser.
- I leveraged Tone.js, an open-source Web Audio framework, to actually play the generated melodies within the browser based on the melody notes.
- I employed midi-writer-js, a JavaScript library for writing MIDI files, to export the generated melodies as MIDI files that users can save and share.
- I utilised React Hook Form, a React library for building forms, to build the form where users input the tonality and length to generate a melody.
- In summary, by combining Next.js for routing, React for components, VexFlow for sheet music rendering, Tone.js for audio playback, midi-writer-js for MIDI exporting and React Hook Form for forms - I was able to develop all of the required functionality for the full-stack melody maker tool. The ability of Next.js to parse URL parameters also enabled me to create shareable melody URLs.

## Challenges I ran into
- Different music libraries used different units for note durations, causing errors in my code. Checking each library's documentation revealed they required ticks, seconds or note lengths (like quavers), so I updated my code to conform to the specific unit required by each library, resolving the errors. The fix involved using the right unit for the duration of each note, as specified by that particular library.
- At first, when I tried to retrieve the melody from the URL, only the first few notes were read correctly. The rest was a jumbled mess of wrong notes. I was stumped. Then it hit me - I needed to encode the melody string before putting it in the URL. I fixed this bug by encoding the melody by using JavaScript’s function `encodeURIComponent()`
- On the last day of the hackathon, I struggled with everyone’s favourite: the Next.js hydration error, until I realized I could solve it using React's useEffect hook, which hydrated the component successfully. useEffect fixed the hydration error and got my app working again.

## Accomplishments that I’m proud of
I am proud to have built a fully-featured, full stack application for automatically generating melodies from start to finish in just three days. From conceptualising the idea and designing the algorithm, to creating the front-end interface and back-end API, to testing and deploying the final product, I was able to complete the entire project in a short time span through focused and efficient work.

## What I learned
- With determination and focus, I was able to teach myself how to properly utilise various JavaScript libraries just by studying their official documentation. 
- I also learned how to retrieve query parameters from a URL in server-side rendering with the Next.js framework.
- I was able to master the Vexflow JavaScript library to easily visualise musical notes with different durations, accidentals and other properties.

## What's next for Melody Maker
If I had more time, I would have definitely tried adding these features:
- **Tempo Adjustment**: A slider or similar interface that allows users to adjust the tempo of the generated melody. This feature would allow users to generate melodies that fit within a specific tempo range.
- **Rhythm Pattern Selection**: A dropdown menu or similar interface that allows users to select a rhythm pattern for the melody. This feature would allow users to generate melodies with specific rhythmic characteristics.
- **Instrument Selection**: A dropdown menu or similar interface that allows users to select the instrument sound for the generated melody. This feature would allow users to hear the melody as it might sound on different instruments.
- **Chord Generator**: Implement a basic chord generator that suggests 1-2 chord progressions that would likely work with the generated melody.
- **Specific Style of Music**: Implement a simple AI model that can generate melodies in a specific style, like baroque, jazz, or rock. Users could select the style.
