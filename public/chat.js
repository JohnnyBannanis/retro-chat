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
                if(username.value.length <9){
                    logged_user= username.value;
                    modal.style.display = "none";
                }else{
                    usererror.innerHTML = `<p class = "nes-text is-error"> That username is too long, Try a shorter one (less than 9 chars) </p>`;
                };
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
            message: message.value,
            to: get_radio_value(), // destino
            //posicion y estilo de burbuja
            pos:"" ,
            style:""
        });
    };
});


message.addEventListener('keyup', (e) => {
    if (e.keyCode === 13 && message.value !== '') {
        btn.click();
    }
}, false);

socket.on('chat:message', function(data){
    output.insertAdjacentHTML("beforeend",
    `
    <div class="message -${data.pos}">
        <div class="nes-balloon from-${data.pos} ${data.style}"">
            <strong>${data.username}</strong>: ${data.message}
        </div>
    </div>`);
    message.value = "";
    output.scrollTop = output.scrollHeight;
});

socket.on('usernames', function(data){
    var html = '';
    for (user in data) {
        html += `
            <label>
                <input type="radio" class="nes-radio is-white" name="selected" value="${data[user]}" />
                <span>${data[user]}</span>  
            </label>`
    };
    userslist.innerHTML = html;
});


function get_radio_value() {
    var inputs = document.getElementsByName("selected");
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].checked) {
        return inputs[i].value;
      }else{
        return "";
      }
    }
}
