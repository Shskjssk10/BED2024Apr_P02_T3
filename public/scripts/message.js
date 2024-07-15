document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOM loaded");
  var searchField = document.getElementById("inputBox");

  var response = await fetch("http://localhost:8080/volunteers");
  var data = await response.json();
  console.log(data);

  if (searchField) {
    searchField.addEventListener("keypress", function (event) {
      if (event.keyCode === 13) {
        var found = false;
        for (let i = 0; i < data.length; i++) {
          if (searchField.value === data[i].Username) {
            found = true;
            createChat(searchField.value);
            break;
          }
        }
        if (!found) {
          alert("Invalid Username");
        }
      }
    });
  } else {
    console.error("Element with ID 'inputBox' not found!");
  }
});

const chatBoxes = {};

async function createChat(username) {
  if (chatBoxes[username]) {
    console.log("Chat box already exists for", username);
    return;
  }

  var chats = document.getElementById("chats");
  var chatBox = document.createElement("div");

  chatBox.setAttribute("id", "chatBox");
  chatBox.style.height = "80px";
  chatBox.style.backgroundColor = "white";
  chatBox.style.display = "flex";
  chatBox.style.alignItems = "center";

  chatBox.addEventListener("click", function () {
    const previouslySelected = document.querySelector(".selected-chat");
    if (previouslySelected) {
      previouslySelected.style.backgroundColor = "white";
      previouslySelected.classList.remove("selected-chat");
    }

    // Set the clicked chat box to light grey
    chatBox.style.backgroundColor = "#D3D3D3";
    chatBox.classList.add("selected-chat");

    // Allow sending messages to the selected chat box
    enableSendMessage();
  });

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

function enableSendMessage() {
  const sendButton = document.getElementById("sendButton");
  const messageInput = document.getElementById("messageInput");

  messageInput.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
      const message = messageInput.value;
      if (document.querySelector(".selected-chat")) {
        console.log("Message to selected chat:", message);
        messageInput.value = "";
      } else {
        alert("Please select a chat box to send a message.");
      }
    }
  });

  sendButton.addEventListener("click", function () {
    const message = messageInput.value;
    if (document.querySelector(".selected-chat")) {
      console.log("Message to selected chat:", message);
      messageInput.value = "";
    } else {
      alert("Please select a chat box to send a message.");
    }
  });
}
