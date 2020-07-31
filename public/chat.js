const socket = io();

// DOM elements
let message = document.getElementById('message');
let username = document.getElementById('username');
let userform = document.getElementById('userform')
let usererror = document.getElementById('usererror')
let btn = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');
let userslist = document.getElementById('users-list');

var modal = document.getElementById("nes-modal");
var press = document.getElementById("start");


let logged_user;

window.onload = function() {
    modal.style.display = "block";
};

press.addEventListener('click', function () {
    if (username.value !== '' ) {
        console.log(username.value);
        socket.emit('new_user', username.value, function(data){
            console.log(data);
            if (data) {
                logged_user= username.value;
                modal.style.display = "none";
            } else {
                usererror.innerHTML = `<p class = "nes-text is-error"> That username is already taken </p>`;
            };
        });
    };
});

username.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        console.log('Enter');
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
    <div class="message -right" style="float:right">
        <div class="nes-balloon from-right nes-pointer">
            <strong>${data.username}</strong>: ${data.message}
        </div>
    </div>`);
    message.value = "";
});

socket.on('usernames', function(data){
    var html = '';
    for (user in data) {
        html += `
        <li>
            <label>
                <input type="radio" class="nes-radio is-white" name="answer-dark" />
                <span>${data[user]}</span>  
            </label>
        </li>`
    };
    userslist.innerHTML = html;
});


// Listar a los que estan online

// Separa los chats
