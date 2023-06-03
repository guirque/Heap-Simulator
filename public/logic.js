//Read File Object Instantiation
let reader = new FileReader();
let heap = [];
let heapSize = 10;
let currentLineNumber = -1;
let currentLine = '/0';
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
let vars = {}; //vars stores the association between variable names and their positions in the array 
let lastInserted = 0; //Position of last free space
let spacesFree = [];
for(let i = 0; i < heapSize; i++)
{
    heap[i] = 0;
}
for(let i = 0; i < heapSize; i++) spacesFree[i] = heapSize - i;

//vars holds the name of a variable and its corresponding value.

//Insert
function insert(name, size)
{
    let toInsert = size;
    let startFromHere = 0;
    let iteration = 0; //iteration makes sure the system checks if all positions have been analyzed before affirming there's no more space left.
    let color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
    let beginningPositionSet = false;
    if(currentMethod == 'first' || currentMethod == 'next')
    {
        if(currentMethod == 'next') startFromHere = lastInserted+1; 
        for(let i = startFromHere; iteration <= heapSize && toInsert > 0; i++, iteration++)
        {
            //Found spot with enough space to insert elements
            if(spacesFree[i] >= toInsert)
            {
                //Inserting Heap Element
                heap[i] = 1;

                //Setting variable Association
                if(!beginningPositionSet) 
                {
                    vars[name] = 
                    {
                        position: i,
                        size: size,
                        color: color
                    };
                    document.querySelector('#vars').innerHTML += `<div class="var" style="background-color: ${color}">${name}</div>`;
                    beginningPositionSet = true;
                }

                //Updating Heap Management Variables
                spacesFree[i] = 0; //updating free spaces (deleting updates these back to normal)
                lastInserted = i; //last position inserted is now here
                toInsert--; //amount of elements yet to be inserted
            }

            //If i has reached the end of the heap, but not all heap spaces have been checked, go back to the beginning.
            if(i == heapSize) i = -1;
        }
        if(toInsert != 0) showError(`Not enough free space in heap to insert '${name}', of size ${size}.`);
    }
    else if(currentMethod == 'worst' || currentMethod == 'best')
    {

        //Finding worst or best spot for the heap method
        let choice = -1;
        let possibleLocation = true; //stops heap method from skipping empty spots and inserting elements in the end of available free spots.
        spacesFree.forEach((space, index)=>
        {
            //If we come accross a space that's occupied (space == 0), then the next spot is a possible location to analyze
            if(space == 0) possibleLocation = true;

            //Choose this if what we want to insert fits and if either nothing was chosen yet or this space is more adequate than the one previously found.
            let replaceChoice = (currentMethod == 'best' && space < spacesFree[choice]) || (currentMethod == 'worst' && space > spacesFree[choice]);
            if(possibleLocation && (choice == -1 || replaceChoice)){choice = index;}
        
            if(space != 0) possibleLocation = false;
        });

        if(choice == -1){showError(`Not enough free space in heap to insert '${name}', of size ${size}.`);}

        //Actually interating
        else for(let i = choice; i < choice + size; i++)
        {
            //Inserting Heap Element
            heap[i] = 1;
 
            //Setting variable Association
            if(!beginningPositionSet) 
            {
                vars[name] = 
                {
                    position: i,
                    size: size,
                    color: color
                };
                document.querySelector('#vars').innerHTML += `<div class="var" style="background-color: ${color}">${name}</div>`;
                beginningPositionSet = true;
            }
 
             //Updating Heap Management Variables
             spacesFree[i] = 0; //updating free spaces (deleting updates these back to normal)
             lastInserted = i; //last position inserted is now here
             toInsert--; //amount of elements yet to be inserted
        }
    }
}

function adjustFreeSpaces(beginFrom = heapSize-1)
{
    let space = 0;
    for(let i = beginFrom; i >= 0; i--)
    {
        if(heap[i] == 0) space++;
        else space = 0;
        spacesFree[i] = space;
    }
}

function deleteVar(name)
{
    //Find variable and erase it, updating all elements on the way back
    if(vars[name])
    {
        let start = vars[name].position;
        let size = vars[name].size;
        delete vars[name];
        for(let i = start; i < start + size; i++)
        {
            heap[i] = 0;
        }
        adjustFreeSpaces();
        //console.log(`${name} deleted. Start: ${start}, size: ${size} `, vars);
    }
    else showError(`Unidentified var '${name}'.`);
}


//Function
function run(content)
{
    //Resetting Values
    document.querySelector('output').innerHTML = '';
    document.querySelector('#errorMsg').innerHTML = '';
    document.querySelector('#vars').innerHTML = '';
    heap = [];
    vars = {};
    spacesFree = [];
    lastInserted = 0;
    for(let i = 0; i < heapSize; i++)
    {
        heap[i] = 0;
    }
    for(let i = 0; i < heapSize; i++) spacesFree[i] = heapSize - i;

    let lines = [...content.match(/[^\n\r]+/g)]; //break file text into lines (consider \n and \r characters)
    lines.forEach((line, index)=>
    {
        //Four possibilities for an instruction:
        //heap, followed by type (first, best, worst or next) [what method will be used]
        //new, followed variable name and its value
        //del, followed by the name of the variable to delete
        //exibe, not followed by anything. Shows the heap as it is.
        let words = [...line.match(/[\w=]+/g)];
        currentLine = line;
        currentLineNumber = index+1;
        switch(words[0])
        {
            case 'heap':
                if(words[1] == 'first' || words[1] == 'next' || words[1] == 'best' || words[1] == 'worst')
                currentMethod = words[1];
                else
                {showError(`Unidentified heap method '${words[1]}'.`);}
                break;
            case 'new':
                insert(words[1], Number(words[2]));
                break;
            case 'exibe':
                //print heap
                document.querySelector('output').innerHTML += `<div id="heap-line"><div class="line">Line ${index}</div> <div class="method">Heap method: ${currentMethod}</div></div>`;
                document.querySelector('output').innerHTML += `<div id="heap"></div>`;
                let lastHeap = document.querySelector('output').lastChild;

                heap.forEach((element, i)=>
                {
                    lastHeap.innerHTML += `<div id="heap-element">${element}</div>`;
                });
                lastHeap.innerHTML += `</br>`;
                
                let heapElements = lastHeap.querySelectorAll('#heap-element');
                //Coloring Heap Elements
                Object.keys(vars).forEach((key)=>
                {
                    let i = vars[key];
                    //For each element in the heap to be colored
                    for(let start = i.position; start < i.position + i.size; start++) 
                    {
                        heapElements[start].style.backgroundColor = vars[key].color;   
                    }
                });

                //console.log(spacesFree);
                break;
            case 'del':
                deleteVar(words[1]);
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
    //console.log(vars);
    //Might be worth noting: Boolean(convertMe) and String(convertMe) functions.
}

function showError(errorMsg)
{
    let messageNode = document.getElementById('errorMsg');
    if(messageNode.innerHTML != '') messageNode.innerHTML += '</br></br>';
    messageNode.innerHTML += errorMsg;
    messageNode.innerHTML += `</br>-> <code>${currentLine}</code> </br>in line ${currentLineNumber}.`;
}

function changeHeapSize(value){heapSize = value;}