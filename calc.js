function Build(attributes){
	this.attributes = attributes
}

Build.prototype.rimRadius = function(){
	return this.attributes.erd / 2;
};

Build.prototype.flangeRadius = function(){
	return this.attributes.flange_diam / 2;
};

Build.prototype.flangeOffset = function(){
	return this.attributes.flange_offset;
};

Build.prototype.cosCrossOverLength = function(){
	var top = 720 * this.attributes.spoke_crosses * Math.PI;
	var bot = 180 * this.attributes.rim_holes;
	return Math.cos(top / bot);
};

Build.prototype.spokeHoleRadius = function(){
	return this.attributes.spoke_hole_diam / 2;
};

Build.prototype.spokeLength = function(){
	rimRadSq = square(this.rimRadius())
	flangeRadSq = square(this.flangeRadius())
	flangeOffsetSq = square(this.flangeOffset())
	radRimRadFlange = 2*this.rimRadius()*this.flangeRadius()

	insideSqrt = (rimRadSq+flangeRadSq+flangeOffsetSq) - (radRimRadFlange*this.cosCrossOverLength())

	return Math.sqrt(insideSqrt) - this.spokeHoleRadius()
};

function square(x){
	return Math.pow(x, 2);
};

function extractBuild(form){
	return new Build({
		erd: parseFloat(form.find("#erd").val()),
		flange_diam: parseFloat(form.find("#flange_diam").val()),
		flange_offset: parseFloat(form.find("#flange_offset").val()),
		rim_holes: parseInt(form.find("#rim_holes").val()),
		spoke_crosses: parseInt(form.find("#spoke_crosses").val()),
		spoke_hole_diam: parseFloat(form.find("#spoke_hole_diam").val()),
	});
};

$(function(){
	$('.calc_field').keyup(function(){
		doMath();
	});
});

// function disableBtn() {
// 	$("#button").click(function(e){
// 		e.preventDefault();
// 		doMath();
// 	});
// };

function doMath(){
	build = extractBuild($('#spoke_form'));
	$('#spokelength').html(Math.round(build.spokeLength()));
}

$(function(){
  $( "#container" ).draggable();
  $( "#dragChat" ).draggable();

  var messagesRef = new Firebase('http://t4wwyyyji3m.firebaseio-demo.com/');
      messageField = $('#messageInput');
      nameField = $('#nameInput');
      messageList = $('#chat-messages');

  messageField.keypress(function (e) {
    if (e.keyCode == 13) {
      var username = nameField.val();
      var message = messageField.val();
      // messagesRef.push(username + ' says ' + message);
      messagesRef.push({name:username, text:message});
      messageField.val('');
    }
  });
  // Add a callback that is triggered for each chat message.
  messagesRef.on('child_added', function (snapshot) {
    //GET DATA
    var data = snapshot.val();
    var username = data.name || "anon";
    var message = data.text || "***";

    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
    var messageElement = $("<li>");
    var nameElement = $("<strong class='example-chat-username'></strong>")
    nameElement.text(username);
    messageElement.text(message).prepend(nameElement);

    //ADD MESSAGE
    messageList.append(messageElement)

    //SCROLL TO BOTTOM OF MESSAGE LIST
    messageList[0].scrollTop = messageList[0].scrollHeight;
  });
});
