var badWords = ['fuck', 'bitch', 'dickhead'];

let value = 'dick head';

let newValue = value;
for(let i in badWords) {
      newValue = newValue.replace(/\s/g, '');
      if(newValue.toLowerCase().indexOf(badWords[i].toLowerCase()) > -1) {
            let len = 1 * badWords[i].length;
            value = value.split(value).join('*'.repeat(len));
      }
}
console.log(value);
// network.send("chat<<$" + this.value);