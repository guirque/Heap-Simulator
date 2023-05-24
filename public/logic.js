//Read File Object Instantiation
let reader = new FileReader();
let heaps = [];

async function readFile(){
    let heapFile = document.getElementById('heap-file').files[0]; //grabs first file in fileList obj in input element
    reader.readAsText(heapFile); //start reading file
    reader.addEventListener('load', ()=>
    {
        run(reader.result); //result is stored inside the result property in the reader.
    }); //set event listener with the reader as event target, listening for the 'load' event.

}

//Separate variables
let currentMethod = '';
let vars = {};
//vars holds the name of a variable and its corresponding value.

//Function
function run(content)
{

}

function showError(errorMsg)
{
    document.getElementById('errorMsg').innerHTML = errorMsg;
}