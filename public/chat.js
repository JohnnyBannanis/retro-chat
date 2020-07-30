const socket = io();



// DOM elements
let message = document.getElementById('message');
let username = document.getElementById('username');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');

var modal = document.getElementById("nes-modal");
var press = document.getElementById("start");

let logged_user;

window.onload = function() {
    modal.style.display = "block";
};

press.addEventListener('click', function () {
    if (username.value !== '') {
        logged_user= username.value;
        modal.style.display = "none";
    };
});

username.addEventListener('keyup', (e) => {
    console.log('Enter');
    if (e.keyCode === 13 && username.value !== '') {
        press.click();
    }
}, false);

btn.addEventListener('click', function () {
    if (message.value !== '') {
        socket.emit('chat_message', {
            username: logged_user,
            //username: "Test",
            message: message.value
        });
    };
});

message.addEventListener('keyup', (e) => {
    if (e.keyCode === 13 && message.value !== '') {
        btn.click();
    }
}, false);

socket.on('chat:message', function(data){
    output.insertAdjacentHTML("afterBegin",
    `
    <section class="message -left">
        <div class="nes-balloon from-left nes-pointer">
            <strong>${data.username}</strong>: ${data.message}
        </div>
    </section>`);
    message.value = "";
});


// Listar a los que estan online

// Separa los chats
