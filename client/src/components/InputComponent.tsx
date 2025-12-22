import CommunicationController from "../communication/CommunicationController";
import "./InputComponent.css";

const InputComponent = () => {
  function handleSendButtonClick(e: React.FormEvent) {
    e.preventDefault();

    const inputFieldEl = document.getElementById("inputField") as HTMLInputElement;
    const content = inputFieldEl.value;

    CommunicationController.sendRequest("POST", "/api/chat", { body: { content } }).then((response) => {
      console.log("Message sent response:", response);
    });
  }

  return (
    <form id="inputContainer" onSubmit={handleSendButtonClick}>
      <input type="text" name="" id="inputField" />
      <button type="submit">SEND</button>
    </form>
  );
};

export default InputComponent;
