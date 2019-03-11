function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerizeFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function sendMessage(){
  var inputText=$("#input-message");
  var messagesWrapper=$(".messages-wrapper");
  var contactName=$("#contact-name");
  var currentdate = new Date();

  inputText.keyup(function(e){
    if(e.keyCode == 13)
    {
      var currentContact=contactName.text();
      currentContact=lowerizeFirstLetter(currentContact);

      setTimeout(receiveMessage,1000);
      var newText=document.createElement("p");
      $(newText).text(inputText.val());
      inputText.val("");
      var newTime=document.createElement("span");
      $(newTime).addClass("messages-time")
                .text(currentdate.getHours()+ ":" + currentdate.getMinutes());
      var newMessage=document.createElement("div");
      $(newMessage).addClass("message")
                   .addClass("sent")
                   .addClass(currentContact);
      $(newMessage).append(newText)
                   .append(newTime);
      messagesWrapper.append(newMessage);
    }
  });
}

function receiveMessage(){
  var currentdate = new Date();
  var messagesWrapper=$(".messages-wrapper");
  var contactName=$("#contact-name");

  var currentContact=contactName.text();
  currentContact=lowerizeFirstLetter(currentContact);

  var newText=document.createElement("p");
  $(newText).text("Ok");
  var newTime=document.createElement("span");
  $(newTime).addClass("messages-time")
            .text(currentdate.getHours()+ ":" + currentdate.getMinutes());
  var newMessage=document.createElement("div");
  $(newMessage).addClass("message")
               .addClass("received")
               .addClass(currentContact);
  $(newMessage).append(newText)
               .append(newTime);
  messagesWrapper.append(newMessage);
}

function searchUser(mySearch){
  var messageContent=$(".message-content");
  var messageBox=$(".message-box");

  for (var i = 0; i < messageContent.length; i++) {
    var myContent=$(messageContent.eq(i));
    var myUser=$(myContent.children("h4"));
    var myUserName=myUser.text();
    if (mySearch.length==0) {
      messageBox.eq(i).show();
    }
    for (var z = 0; z < mySearch.length; z++) {
      var myChar=mySearch[z];
      if (z==0) {
        myChar=capitalizeFirstLetter(mySearch[z]);
      }
      if (myChar==myUserName[z]) {
        messageBox.eq(i).show();
      } else {
        messageBox.eq(i).hide();
        break;
      }
    }
  }
}

function selectChat(){
  var messageBox=$(".message-box");
  var contactName=$("#contact-name");

  messageBox.click(function(){
    var activeChat=$(".selected");
    activeChat.removeClass("selected");
    var currentContact=lowerizeFirstLetter(contactName.text());
    currentContact="." + currentContact;
    var currentClass=$(currentContact);
    var me=$(this);
    me.addClass("selected");
    var meContent=me.children(".message-content");
    meContentName=meContent.children("h4").text();
    contactName.text(meContentName);
    meContentName=lowerizeFirstLetter(meContentName);
    currentClass.hide();
    var classToShow="." + meContentName;
    $(classToShow).css("display","flex");
  });
}

function init(){
  sendMessage();
  selectChat();
  var userToSearch=$("#search-user");
  userToSearch.on("input",function(){
    searchUser(userToSearch.val());
  });
}

$(document).ready(init);
