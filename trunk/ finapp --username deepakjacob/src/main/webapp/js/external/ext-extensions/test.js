var person = {
		firstName:"Deepak",
		lastName:"Jacob",
		address:{
			house:"Karinganamattom House",
			district:"Kottayam",
			state:"Kerala",
			country:"India"
		}
}


var a = function(Person p){
	this.person = p;
	showName = function(){
		alert(this.person.firstName);
	}
}

caller = new function(person);
caller.showName();
