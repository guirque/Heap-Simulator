//Read File Object Instantiation
let reader = new FileReader();
let heap = [];
//heap is an array of objects, each with a variable name and its values.

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
    let lines = [...content.match(/[^\n\r]+/g)]; //break file text into lines (consider \n and \r characters)
    lines.forEach((line, index)=>
    {
        //Four possibilities for an instruction:
        //heap, followed by type (first, best, worst or next) [what method will be used]
        //new, followed variable name and its value
        //del, followed by the name of the variable to delete
        //exibe, not followed by anything. Shows the heap as it is.
        let words = [...line.match(/[\w=]+/g)];
        switch(words[0])
        {
            case 'heap':
                currentMethod = words[1];
                break;
            case 'new':
                //vars[words[1]] = Number(words[2]);
                heap.push(
                    {
                        varName: words[1],
                        value: Number(words[2]),
                        empty: 0
                    });
                break;
            case 'exibe':
                //print heap
                document.querySelector('output').innerHTML += `<div id="heap-line"><div class="line">Line ${index}</div> <div class="method">Heap method: ${currentMethod}</div></div>`;
                document.querySelector('output').innerHTML += `<div id="heap"></div>`;
                let lastHeap = document.querySelector('output').lastChild;
                
                heap.forEach((element, i)=>
                {
                    let printMe = element.empty ? '[]' : element.value;
                    lastHeap.innerHTML += `<div id="heap-element">${printMe}</div>`;
                });
                lastHeap.innerHTML += `</br>`;
                break;
            case 'del':
                heap.filter((element, i)=>
                {
                    if(element.varName == words[i])
                    {
                        delete element.varName;
                        delete element.value;
                        element.empty = 1;
                    }
                });
                break;
            default:
                //Assignments
                if(words[1] == '='){ 
                    //With number
                    if(!isNaN(Number(words[2]))) vars[words[0]] = Number(words[2]);
                    //With variable name
                    else vars[words[0]] = vars[words[2]];
                }
                //Error
                else showError(`Couldn't interpret "${line}" in line ${index + 1}`);

            
        }
    });
    console.log(vars);
    //Might be worth noting: Boolean(convertMe) and String(convertMe) functions.
}

function showError(errorMsg)
{
    document.getElementById('errorMsg').innerHTML = errorMsg;
}