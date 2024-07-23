document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");

  const socket = io("http://localhost:3000");
  socket.on("connect", () => {
    console.log(`${socket.id}`);
  });

  socket.on("message", (message) => {
    console.log(message);
    outputMessage(message, false); // false indicates incoming message
  });

  const sendButton = document.getElementById("sendButton");
  sendButton.addEventListener("click", () => {
    sendMessage();
  });

  const messageInput = document.getElementById("messageInput");
  messageInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      sendMessage(); // Send message on Enter key press
    }
  });

  function sendMessage() {
    const message = messageInput.value;
    if (message.trim() !== "") {
      socket.emit("chatMessage", message); // Emit message to server
      outputMessage(message, true); // true indicates outgoing message
      messageInput.value = ""; // Clear the message input box
    }
  }

  function outputMessage(message, isOutgoing) {
    const messageList = document.getElementById("message");
    const messageBubble = document.createElement("li");
    messageBubble.style.listStyle = "none";
    messageBubble.style.width = "fit-content";
    messageBubble.style.backgroundColor = isOutgoing ? "white" : "white";
    messageBubble.style.padding = "4px";
    messageBubble.style.borderRadius = "4px";
    messageBubble.style.marginTop = "1rem";
    //might need to adjust styling here
    messageBubble.style.marginLeft = isOutgoing ? "auto" : "1.2rem";
    messageBubble.style.marginRight = isOutgoing ? "1.2rem" : "auto";
    messageBubble.className = "message-bubble";
    messageBubble.setAttribute("id", "messageBubble");
    messageBubble.innerText = message;
    messageList.appendChild(messageBubble);

    const timestamp = document.createElement("span");
    timestamp.style.fontSize = "0.8rem"; // Adjust font size as needed
    timestamp.style.color = "#aaa"; // Adjust timestamp color
    timestamp.style.marginLeft = "10px"; // Adjust margin as needed
    const currentDate = new Date();
    timestamp.innerText = formatTimestamp(currentDate);
    messageBubble.appendChild(timestamp);

    scrollToBottom();
  }

  function formatTimestamp(date) {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function scrollToBottom() {
    const messageList = document.getElementById("message");
    messageList.scrollTop = messageList.scrollHeight;
  }
});
