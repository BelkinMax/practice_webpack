
// PATH
const path = require('path')

// console.log(__dirname)
// console.log(process.cwd())
// console.log(path.join(__dirname, 'test'))
// END PATH

const fs = require('fs')
// FILESYSTEM
const pages = fs.readdirSync(path.join('src', 'pages'))
console.log(pages)

// ENDFILESYSTEM
