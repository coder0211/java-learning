const text = "Hello! How are you? I'm fine. Thank you!";
const delimiters = /([?.!])/;
const result = text.split(delimiters).filter(Boolean);

console.log(result);

console.log(text.split(delimiters));
