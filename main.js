
var ans = JSON.parse(localStorage.getItem('nyt-wordle-state'))["solution"]
var main = document.getElementsByTagName("game-app")[0].shadowRoot
main = main.getElementById("board-container")

main.style.position = "relative";
main.style.overflow = "visible";

function create_image_section(){
    const image_section = document.createElement("div");
    image_section.style.cssText = `
        max-height: 200px;
        max-width: 200px;
        position: absolute;
        border: 2px solid var(--color-tone-4);
        left: -140px;
        overflow: hidden;
    `

    const image = document.createElement("img");
    image.setAttribute("src","https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png?202203171931");
    image.style.cssText = `
        max-height: 100%;
        max-width: 100%;
        filter: blur(25px);
    `

    const reveal = document.createElement("button");
    reveal.innerHTML = "Reveal image";
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
        image.style.filter = "none";
        reveal.style.display = "none";
    }

    image_section.appendChild(image);
    image_section.appendChild(reveal);
    return image_section;
}

function create_text_section(){
    const main_text_section = document.createElement("div");
    main_text_section.style.cssText = `
        max-height: 400px;
        max-width: 200px;
        position: absolute;
        right: -140px;
        overflow: hidden;
    `

    const text_section = document.createElement("div");
    text_section.style.cssText = `
        max-height: 70%;
        max-width: 100%;
        border: 2px solid var(--color-tone-4);
    `

    const para = document.createElement("p");
    fetch("https://api.dictionaryapi.dev/api/v2/entries/en/"+ans).then( async (data)=>{
        data = await data.json();
        data = data[0];
        var shouldntbethere = [ans.substring(0,3), ans.substring(1,4), ans.substring(2,5), ans];

        data["meanings"][0]["definitions"].some((def,index)=>{ // add all possible definition
            def = def["definition"]
            correct = true;
            shouldntbethere.some((word)=>{
                if(def.toLowerCase().includes(word)){
                    correct = false;
                    return true;
                }
            })
            if(correct){
                para.innerHTML = def
                return true;
            }
        })
        
    })
    para.style.cssText = `
        max-height: 100%;
        max-width: 100%;
        padding: 10px;
        color: var(--key-text-color);
        filter: blur(25px);
    `

    const reveal = document.createElement("button");
    reveal.innerHTML = "Reveal defination";
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

    text_section.appendChild(para);
    para.appendChild(reveal);

    const letter_section = document.createElement("div");
    letter_section.style.cssText = `
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 5px;
        max-height: 30%;
        max-width: 100%;
        border: 2px solid var(--color-tone-4);
        margin-top: 10px;
        padding: 5px;
    `

    for(var i=0;i<ans.length;i++){
        letter = ans[i]
        const letter_div = document.createElement("div");
        letter_div.innerHTML = letter;
        letter_div.style.cssText = `
            border: 2px solid var(--color-tone-4);
            color: rgb(0,0,0,0);
            padding: 10px;
            cursor: pointer;
        `
        letter_div.onclick = function(){
            letter_div.style.color = "var(--key-text-color)";
            letter_div.style.backgroundColor = "var(--color-correct)";
        }
        letter_section.appendChild(letter_div);
    }

    main_text_section.appendChild(text_section);
    main_text_section.appendChild(letter_section)
    return main_text_section;
}

main.appendChild(create_image_section())
main.appendChild(create_text_section())