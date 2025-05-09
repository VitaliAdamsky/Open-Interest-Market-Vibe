const response = await fetch("https://api.ipify.org?format=json");
const data = await response.json();
console.log("Public IP Address:", data.ip);
