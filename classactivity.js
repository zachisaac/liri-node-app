class Programmer {
    constructor(name, title, language, age) {
        this.name = name;
        this.title = title;
        this.language = language;
        this.age = age;
    }
    printInfo() {
        console.log("Name: " + this.name + "\nPosition: " + this.position +
            "\nAge: " + this.age + "\nLanguages: " + this.language);
    };
}

var bob = new Programmer("Bob Smith", "Supreme CodeMaster", 33, "JavaScript");

bob.printInfo(); 

