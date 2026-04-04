
class Toaster{
    #toastsAmount = 0; //private Variable für die Anzahl der Toasts. Steht als privat für die unerwünschte Manipulation von außen
    #time = 0; //private Variable für die Zeit. Steht als privat für die unerwünschte Manipulation von außen
    #toastsStatus = "untoasted"; //private Variable für die Toaststatus. Steht als privat für die unerwünschte Manipulation von außen
    #shafts = 1; //private Variable für die Anzahl der Schächte. Steht als privat für die unerwünschte Manipulation von außen. Die Wert darf nicht null oder negativ sein


    constructor(color="white"){
        this.color = color;
    }


    //GETTERS
    get time(){ // Getter für die Zeit
        return this.#time;
    }

    get toastsStatus(){ //Getter für den Toaststatus
        return this.#toastsStatus;
    }

    get toastsAmount(){ //Getter für die Anzahl der Toasts
        return this.#toastsAmount;
    }

    get shafts(){ //Getter für die Anzahl der Schächte
        return this.#shafts;
    }

    //SETTERS
    set time(value){ // Setter für die Zeit
        if(value < 0) return console.log("Time cannot be negative"); //Sicherung gegen negativen Zeitwert

        console.log(`Toaster time is set to ${value} minutes`);
        this.#time = value; // Die Zeit wird gesetzt und zurückgegeben
    }

    set toastsAmount(value){
        if (value > this.#shafts) {
            console.log("Not enough shafts for the amount of toasts")
            return
        } else {
            if(value === 1){
                console.log("Toast is put in")
            } else {
                console.log(`${value} toasts are put in`)
            }
            this.#toastsAmount = value;
        }

    }

    set shafts(value){
        if(value <= 0) return console.log("Shafts cannot be zero or negative"); //Sicherung gegen null oder negativen Wert für Schächte
        console.log(`Toaster shafts are set to ${value}`);
        this.#shafts = value;
    }


    //FUNKTIONEN

    putOut(){ //Die Toasts werden rausgeworfen
        console.log("Toasts are put out")
    }

    toast(){ //Die Toasts werden getoastet
        if(this.#time == 0) this.#toastsStatus = "untoasted";
        else if(this.#time > 0 && this.#time <= 15) this.#toastsStatus = "lightly toasted";
        else if(this.#time > 15 && this.#time < 30) this.#toastsStatus = "strong toasted";
        else if(this.#time >= 30) this.#toastsStatus = "burnt";
        return console.log(`Toasts status is ${this.#toastsStatus}`);
    }

}


class Supertoaster extends Toaster{
    #temperaturesensor = 500; //private Variable für den Temperatursensor. Steht als privat für die unerwünschte Manipulation von außen
    #temperature = 200; //private Variable für die Temperatur. Steht als privat für die unerwünschte Manipulation von außen

    constructor(color){
        super(color);
    }


    //GETTERS
    get temperaturesensor(){
        return this.#temperaturesensor;
    }

    get temperature(){
        return this.#temperature;
    }

    //SETTERS
    set temperature(value){
        if(value < 200) return console.log("Temperature cannot be lower then 200 degree Celsius"); //Sicherung gegen negativen oder kleinen Wert für die Temperatur
        console.log(`Toaster temperature is set to ${value} degrees Celsius`);
        this.#temperature = value;
    }


    //FUNKTIONEN
    toast(){ //Die Funktion wird überschrieben, um die Temperatur zu berücksichtigen. Wenn die Temperatur zu hoch ist, wird das Toasten verweigert. Ansonsten wird die toast Funktion der Supertoaster Klasse aufgerufen, um den Toaststatus zu aktualisieren
        if(this.#temperature > this.#temperaturesensor) {
             console.error("Temperature is too high, toasting denied"); //Sicherung gegen zu hohe Temperatur
            return
        }
        super.toast(); //Die toast Funktion der Supertoaster Klasse ruft die toast Funktion der Toaster Klasse auf, um den Toaststatus zu aktualisieren

    }



}

const myToaster = new Toaster("white");
const mySupertoaster = new Supertoaster("silver");

console.log(myToaster);
console.log(mySupertoaster);

myToaster.time = 5;
myToaster.shafts = 2;
myToaster.toast();
myToaster.toastsAmount = 2;

mySupertoaster.time = 10;
mySupertoaster.temperature = 250;
mySupertoaster.toast()
