
var data = JSON.parse(localStorage.getItem('nyt-wordle-state'))
var ans = data["solution"]
var revealedhints = false;

var main = document.getElementsByTagName("game-app")[0].shadowRoot
var mainref = main;
var modal = main.getElementById("game").getElementsByTagName("game-modal")[0]
main = main.getElementById("board-container")
main.style.position = "relative";
main.style.overflow = "visible";

const mutationCallback = (mutationsList) => {
    for (const mutation of mutationsList) {
        let statusofgame = JSON.parse(localStorage.getItem('nyt-wordle-state'))["gameStatus"]
        if (mutation.type === "attributes" && 
            statusofgame == "WIN" && !revealedhints) {
            revealedhints = true;
            for(let i=0;i<6;i++){
                mainref.getElementById("revealvowelshints").click();
            }
            mainref.getElementById("revealdefinitionhints").click();
            let children = mainref.getElementById("reveallettershints").children;
            for (let i = 0; i < children.length; i++) {
                children[i].click();
            }
        }
      
    }
  }

  const observer = new MutationObserver(mutationCallback)

  observer.observe(modal, { attributes: true })

var alldefinition = []
var hints = []
var vowelcounter = 0;
var pos = ["First","Second","Third","Fourth","Fifth"]
for(var i=0;i<ans.length;i++){
    if ("aeiou".includes(ans[i])){
        vowelcounter+=1
        hints.push(pos[i]+" letter is vowel")
    }
}
hints.splice(0, 0, "The word has "+vowelcounter+" vowel(s)");

function create_vowel_section(){
    const vowel_section = document.createElement("div");
    vowel_section.style.cssText = `
        max-height: 100%;
        min-height: 70px;
        max-width: 100%;
        border: 2px solid var(--color-tone-4);
    `

    const vowel = document.createElement("ul");
    vowel.style.cssText = `
        max-height: 100%;
        max-width: 100%;
        padding-right: 5px;
    `
    const reveal = document.createElement("center");
    const revealbutton = document.createElement("button");
    revealbutton.innerText = "reveal hints";
    revealbutton.setAttribute("id","revealvowelshints");
    revealbutton.style.cssText = `
        border: 0px;
        background-color: var(--key-bg);
        color: var(--key-text-color);
        padding: 10px 7px;
        margin-bottom: 7px;
        cursor: pointer;
    `

    revealbutton.onclick = function(){
        let index = vowel.children.length
        if(index<hints.length){
            const hint = document.createElement("li");
            hint.style.cssText = `
                color: var(--key-text-color);
            `
            hint.innerText = hints[index]
            vowel.appendChild(hint)
        }
    }

    reveal.appendChild(revealbutton);
    vowel_section.appendChild(vowel);
    vowel_section.appendChild(reveal);
    return vowel_section;
}

function create_definition_section(){
    const main_definition_section = document.createElement("div");
    main_definition_section.style.cssText = `
        position: relative;
        max-height: 100%;
        max-width: 100%;
        border: 2px solid var(--color-tone-4);
    `

    const definition_section = document.createElement("div");
    definition_section.style.cssText = `
        position: relative;
        max-height: 80%;
        max-width: 100%;
    `
    
    const para = document.createElement("p");
    const pos = document.createElement("b");
    const actualdef = document.createElement("div");
    actualdef.style.marginTop = "5px";
    pos.innerText = ":("
    actualdef.innerText = "Couldn't find definition which doesn't reveal the word"
    fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+ans).then( async (data)=>{

        data = await data.json();
        data = data[0];
        var shouldntbethere = [ans.substring(0,3), ans.substring(1,4), ans.substring(2,5), ans];

        data["meanings"].forEach((gofdef)=>{
            gofdef["definitions"].forEach((def)=>{
            def = def["definition"]
            correct = true;
            shouldntbethere.some((word)=>{
                if(def.toLowerCase().includes(word)){
                    correct = false;
                }
            })
            if(correct){
                alldefinition.push({pos:gofdef["partOfSpeech"],definition:def})
            }
        })
        })
        para.setAttribute("index",0)
        if (alldefinition.length>0){
            pos.innerText = alldefinition[0]["pos"]
            actualdef.innerText = alldefinition[0]["definition"]
        }
        
        
        
    })
    para.style.cssText = `
        max-height: 100%;
        max-width: 100%;
        padding: 10px;
        color: var(--key-text-color);
        filter: blur(25px);
    `
    para.appendChild(pos)
    para.appendChild(actualdef)

    const reveal = document.createElement("button");
    reveal.innerText = "reveal definitions";
    reveal.setAttribute("id","revealdefinitionhints");
    reveal.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 0px;
        background-color: var(--key-bg);
        color: var(--key-text-color);
        padding: 10px 7px;
        cursor: pointer;
    `

    reveal.onclick = function(){
        para.style.filter = "none";
        reveal.style.display = "none";
    }

    navigation_section = document.createElement("div");
    navigation_section.style.cssText = `
        margin: 10px 8px;
        display: grid;
        grid-template-columns: repeat(2,1fr);
        grid-gap: 106px;
        justify-content: space-between;
    `
    left_button = document.createElement("span");
    left_button.innerText = "<"
    left_button.style.cssText = `
        border: 2px solid var(--color-tone-4);
        color: var(--key-text-color);
        padding: 2px 10px;
        cursor: pointer;
    `
    right_button = document.createElement("span");
    right_button.innerText = ">"
    right_button.style.cssText = `
        border: 2px solid var(--color-tone-4);
        color: var(--key-text-color);
        padding: 2px 10px;
        cursor: pointer;
    `
    left_button.onclick = function(){
        let index = parseInt(para.getAttribute("index"))
        if (index>0){
            para.setAttribute("index",index-1)
            pos.innerText = alldefinition[index-1]["pos"]
            actualdef.innerText = alldefinition[index-1]["definition"]
        }
    }
    right_button.onclick = function(){
        let index = parseInt(para.getAttribute("index"))
        if ((index+1)<alldefinition.length){
            para.setAttribute("index",index+1)
            pos.innerText = alldefinition[index+1]["pos"]
            actualdef.innerText = alldefinition[index+1]["definition"]
        }
    }


    navigation_section.appendChild(left_button);
    navigation_section.appendChild(right_button);

    definition_section.appendChild(para);
    definition_section.appendChild(reveal);

    main_definition_section.appendChild(definition_section);
    main_definition_section.appendChild(navigation_section);
    return main_definition_section    
}

function create_letter_section(){
    const letter_section = document.createElement("div");
    letter_section.style.cssText = `
        max-height: 30%;
        max-width: 100%;
        border: 2px solid var(--color-tone-4);
        margin-top: 10px;
        padding: 5px;
    `

    const heading = document.createElement("center");
    heading.innerText = "reveal letters"
    heading.style.cssText = `
        color: var(--key-text-color);
        margin-bottom: 5px;
        margin-top: 2px;
    `

    const letter_grid = document.createElement("div");
    letter_grid.setAttribute("id","reveallettershints");
    letter_grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 5px;
    `

    for(var i=0;i<ans.length;i++){
        letter = ans[i]
        const letter_div = document.createElement("center");
        letter_div.innerText = letter.toUpperCase();
        letter_div.style.cssText = `
            border: 2px solid var(--color-tone-4);
            color: rgb(0,0,0,0);
            padding: 7px;
            cursor: pointer;
            font-weight: bold;
        `
        letter_div.onclick = function(){
            letter_div.style.color = "var(--tile-text-color)";
            letter_div.style.backgroundColor = "var(--color-correct)";
        }
        letter_grid.appendChild(letter_div);
    }

    letter_section.appendChild(heading)
    letter_section.appendChild(letter_grid);
    return letter_section
}


const left_section = document.createElement("div");
left_section.style.cssText = `
    width: 200px;
    position: absolute;
    left: -140px;
    overflow: hidden;
`
left_section.appendChild(create_definition_section())

const right_section = document.createElement("div");
right_section.style.cssText = `
    max-height: 400px;
    width: 200px;
    position: absolute;
    right: -140px;
    overflow: hidden;
`
right_section.appendChild(create_vowel_section());
right_section.appendChild(create_letter_section())

main.appendChild(left_section)
main.appendChild(right_section)