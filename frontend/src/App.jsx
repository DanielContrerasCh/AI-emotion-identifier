import TextInput from "./components/atoms/TextInput";

export default function App() {
  return (
    <div className="app">
      <div className="card">
        <h1 className="title">AI Emotion Identifier</h1>
        <p className="subtitle">Input a review to analyze the emotions</p>
        <TextInput placeholder="Type here..." />
      </div>
    </div>
  );
}
