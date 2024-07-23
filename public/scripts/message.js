document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");

  const socket = io("http://localhost:3000");
  let currentChatRecipient = null; // Track the current chat recipient
  let chatHistory = {}; // Object to store chat history for each user

  socket.on("connect", () => {
    console.log(`Connected with socket id: ${socket.id}`);
    const username = sessionStorage.getItem("username");
    if (username) {
      console.log(`Emitting userConnected with username: ${username}`);
      socket.emit("userConnected", username);
    } else {
      console.log("Username not found in session storage.");
    }
  });

  socket.on("onlineUsers", (users) => {
    updateOnlineUsers(users);
  });

  socket.on("message", (message) => {
    console.log(message);
    // Handle general messages for the currently active chat
    if (!currentChatRecipient) {
      outputMessage(message.message, false);
    }
  });

  socket.on("privateMessage", (data) => {
    const { message, from } = data;
    if (currentChatRecipient) {
      if (currentChatRecipient === from) {
        outputMessage(`${message}`, false);
      }
    } else {
      // Save private message to history if the chat is not active
      if (!chatHistory[from]) {
        chatHistory[from] = [];
      }
      chatHistory[from].push(`${message}`);
    }
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
      if (currentChatRecipient) {
        socket.emit("privateMessage", {
          recipient: currentChatRecipient,
          message,
        });
      } else {
        socket.emit("chatMessage", message);
      }
      outputMessage(message, true); // true indicates outgoing message
      messageInput.value = ""; // Clear the message input box
    }
  }

  function outputMessage(message, isOutgoing) {
    const messageList = document.getElementById("message");
    const messageBubble = document.createElement("li");
    messageBubble.style.listStyle = "none";
    messageBubble.style.width = "fit-content";
    messageBubble.style.backgroundColor = isOutgoing ? "white" : "#f0f0f0"; // Different color for private messages
    messageBubble.style.padding = "4px";
    messageBubble.style.borderRadius = "4px";
    messageBubble.style.marginTop = "1rem";
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

  function createChat(username) {
    var chats = document.getElementById("chats");
    var chatBox = document.createElement("div");

    chatBox.setAttribute("id", `chatbox-${username}`);
    chatBox.style.height = "80px";
    chatBox.style.backgroundColor = "white";
    chatBox.style.display = "flex";
    chatBox.style.alignItems = "center";

    chatBox.addEventListener("click", function () {
      // Set the clicked chat box as the current chat recipient
      currentChatRecipient = username;
      // Clear the message list and reset for the selected chat
      const messageList = document.getElementById("message");
      messageList.innerHTML = "";
      if (chatHistory[username]) {
        chatHistory[username].forEach((msg) => outputMessage(msg, false));
      }

      // Update chatbox appearance
      const previouslySelected = document.querySelector(".selected-chat");
      if (previouslySelected) {
        previouslySelected.style.backgroundColor = "white";
        previouslySelected.classList.remove("selected-chat");
      }

      chatBox.style.backgroundColor = "#D3D3D3";
      chatBox.classList.add("selected-chat");
    });

    // Setting the profile picture
    const profilePic = document.createElement("img");
    profilePic.style.width = "50px";
    profilePic.style.height = "50px";
    profilePic.style.margin = "0 15px";
    profilePic.style.borderRadius = "50%";
    profilePic.src = `../images/default-pfp.png`;
    chatBox.appendChild(profilePic);

    const user = document.createElement("span");
    user.innerText = username;
    chatBox.appendChild(user);

    const box = document.createElement("div");
    box.style.width = "100%";
    box.style.height = "80px";
    box.style.border = "1px solid #ddd";
    box.style.alignItems = "center";
    box.style.lineHeight = "80px";
    box.style.backgroundColor = "white";

    chats.appendChild(chatBox);
  }

  function updateOnlineUsers(users) {
    const chats = document.getElementById("chats");
    chats.innerHTML = ""; // Clear existing chatboxes
    const currentUsername = sessionStorage.getItem("username");
    users.forEach((user) => {
      if (user !== currentUsername) {
        createChat(user);
      }
    });
  }
});
