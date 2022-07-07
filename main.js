
var data = JSON.parse(localStorage.getItem('nyt-wordle-state'))
var ans = data["solution"]
var revealedhints = false;

var main = document.getElementsByClassName("Board-module_boardContainer__cKb-C")[0]
var mainref = main;

var modal = document.getElementsByClassName("Modal-module_modalOverlay__81ZCi")[0]

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
    vowel_section.classList.add("vowel-section");

    const vowel = document.createElement("ul");
    vowel.classList.add("vowel-list");

    const reveal = document.createElement("center");
    const revealbutton = document.createElement("button");
    revealbutton.innerText = "reveal hints";
    revealbutton.setAttribute("id","revealvowelshints");

    revealbutton.onclick = function(){
        let index = vowel.children.length
        if(index<hints.length){
            const hint = document.createElement("li");
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
    main_definition_section.classList.add("main-definition-section");

    const definition_section = document.createElement("div");
    definition_section.classList.add("definition-section");
    
    const para = document.createElement("p");
    para.classList.add("definition-para");
    const pos = document.createElement("b");
    const actualdef = document.createElement("div");
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

    para.appendChild(pos)
    para.appendChild(actualdef)

    const reveal = document.createElement("button");
    reveal.innerText = "reveal definitions";
    reveal.setAttribute("id","revealdefinitionhints");

    reveal.onclick = function(){
        para.style.filter = "none";
        reveal.style.display = "none";
    }

    navigation_section = document.createElement("div");
    navigation_section.classList.add("navigation-section");

    left_button = document.createElement("span");
    left_button.innerText = "<"
    left_button.classList.add("nav-button");

    right_button = document.createElement("span");
    right_button.innerText = ">"
    right_button.classList.add("nav-button");

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
    letter_section.classList.add("letter-section");

    const heading = document.createElement("center");
    heading.classList.add("heading");
    heading.innerText = "reveal letters"

    const letter_grid = document.createElement("div");
    letter_grid.setAttribute("id","reveallettershints");

    for(var i=0;i<ans.length;i++){
        letter = ans[i]
        const letter_div = document.createElement("center");
        letter_div.classList.add("letter-div");
        letter_div.innerText = letter.toUpperCase();

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
left_section.classList.add("left-section");
left_section.appendChild(create_definition_section())

const right_section = document.createElement("div");
right_section.classList.add("right-section");
right_section.appendChild(create_vowel_section());
right_section.appendChild(create_letter_section())

main.appendChild(left_section)
main.appendChild(right_section)