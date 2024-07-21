document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOM loaded");
  var searchField = document.getElementById("inputBox");
  const token = localStorage.getItem("authToken");
  //console.log(token);

  //can try to implement for org later
  //this gets all the volunteer data
  var response = await fetch("http://localhost:8080/volunteers");
  var data = await response.json();
  //console.log(data);

  if (searchField) {
    //this is the input box where user enters who they want to send a message to
    searchField.addEventListener("keypress", function (event) {
      //listen for enter key hit means to initiate a search for that user
      if (event.keyCode === 13) {
        var found = false;
        for (let i = 0; i < data.length; i++) {
          if (searchField.value === data[i].Username) {
            //if user is found then create a chat for that user
            found = true;
            createChat(searchField.value);
            break;
          }
        }
        if (!found) {
          //if invalid username is entered
          alert("Invalid Username");
        }
      }
    });
  } else {
    console.error("Element with ID 'inputBox' not found!");
  }

  const chatBoxes = {};

  async function createChat(username) {
    if (chatBoxes[username]) {
      //checks if chatbox already exists so that if yes user carries on from there
      console.log("Chat box already exists for", username);
      return;
    }

    //creation of chatbox
    var chats = document.getElementById("chats");
    var chatBox = document.createElement("div");

    chatBox.setAttribute("id", "chatBox");
    chatBox.style.height = "80px";
    chatBox.style.backgroundColor = "white";
    chatBox.style.display = "flex";
    chatBox.style.alignItems = "center";

    chatBox.addEventListener("click", function () {
      //to change colour of chatbox when selected
      const previouslySelected = document.querySelector(".selected-chat");
      if (previouslySelected) {
        previouslySelected.style.backgroundColor = "white";
        previouslySelected.classList.remove("selected-chat");
      }

      // Set the clicked chat box to light grey
      chatBox.style.backgroundColor = "#D3D3D3";
      chatBox.classList.add("selected-chat");

      // Allow sending messages to the selected chat box
      // Once chat is selected, enable the send message function
      enableSendMessage();
    });

    //setting the profile picture
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

    chatBoxes[username] = chatBox;
  }

  async function enableSendMessage() {
    const sendButton = document.getElementById("sendButton");
    const messageInput = document.getElementById("messageInput");

    messageInput.addEventListener("keypress", function (event) {
      if (event.keyCode === 13) {
        sendMessage();
      }
    });

    sendButton.addEventListener("click", function () {
      sendMessage();
    });

    function sendMessage() {
      const message = messageInput.value;
      console.log(message);
      if (document.querySelector(".selected-chat")) {
        if (message.trim() !== "") {
          createMessageBubble(message);
          socket.emit("message", message);
          //resets to blank after submitting a message everytime
          messageInput.value = "";
        }
      } else {
        alert("Please select a chat box to send a message.");
      }
    }

    function createMessageBubble(message) {
      //creation of message bubble
      const messageList = document.getElementById("message");
      const messageBubble = document.createElement("li");
      messageBubble.style.listStyle = "none";
      messageBubble.style.width = "fit-content";
      messageBubble.style.backgroundColor = "white";
      messageBubble.style.padding = "4px";
      messageBubble.style.borderRadius = "4px";
      messageBubble.style.marginTop = "1rem";
      messageBubble.style.marginLeft = "auto";
      messageBubble.style.marginRight = "1.2rem";
      messageBubble.className = "message-bubble";
      messageBubble.setAttribute("id", "messageBubble");
      messageBubble.innerText = message;
      messageList.appendChild(messageBubble);

      function formatTimestamp(date) {
        //to put time stamp on message
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
      }

      const timestamp = document.createElement("span");
      timestamp.style.fontSize = "0.8rem"; // Adjust font size as needed
      timestamp.style.color = "#aaa"; // Adjust timestamp color
      timestamp.style.marginLeft = "10px"; // Adjust margin as needed
      const currentDate = new Date();
      timestamp.innerText = formatTimestamp(currentDate);
      messageBubble.appendChild(timestamp);

      function scrollToBottom() {
        //message auto scrolls to bottom meaning that always will see the newest / latest message sent
        const messageList = document.getElementById("message");
        messageList.scrollTop = messageList.scrollHeight;
      }
      scrollToBottom();
    }
  }

  const socket = io("http://localhost:3000");
  socket.on("connect", () => {
    console.log(`${socket.id}`);
    socket.emit("message", "hello world");
  });
});
