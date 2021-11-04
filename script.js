let contrastFlag = false;
let fontFlag = false;
let accessabilityFlag = false;

let accessabilityBtn = document.getElementById("accessibilityBtn")
let bodyElement = document.querySelector('body');
let fontBtn = document.getElementById('fontSizeBtn');
let contrastBtn = document.getElementById('contrastBtn');
let accessabilityStatement = document.getElementById('accessabilityStatement');


if(fontFlag == true){
    bodyElement.style.fontSize = '32px';
    fontBtn.style.border = "2px solid black"
}

if(contrastFlag == true){
    bodyElement.style.filter = 'contrast(200%)';
    contrastBtn.style.border = "2px solid black"

}

accessabilityBtn.addEventListener('click', () =>{
    if(accessabilityFlag){
        accessabilityFlag = false;

        fontBtn.style.setProperty('pointer-events', 'none')
        fontBtn.style.setProperty('display', 'none')
        contrastBtn.style.setProperty('pointer-events', 'none')
        contrastBtn.style.setProperty('display', 'none')
        accessabilityStatement.style.setProperty('pointer-events', 'none')
        accessabilityStatement.style.setProperty('display', 'none')
    }
    else{
        accessabilityFlag = true;


        fontBtn.style.setProperty('pointer-events', 'auto')
        fontBtn.style.setProperty('display', 'block')
        contrastBtn.style.setProperty('pointer-events', 'auto')
        contrastBtn.style.setProperty('display', 'block')
        accessabilityStatement.style.setProperty('pointer-events', 'auto')
        accessabilityStatement.style.setProperty('display', 'block')
    }
})

fontBtn.addEventListener('click', () => {
    if(fontFlag) {
        bodyElement.style.fontSize = '16px';
        fontFlag = false;
        fontBtn.style.border = "0px solid black"

    }
    else{
        bodyElement.style.fontSize = '32px';
        fontFlag = true;
        fontBtn.style.border = "2px solid black"
    }
})

contrastBtn.addEventListener('click', () => {
    if(contrastFlag) {
        bodyElement.style.filter = 'contrast(100%)';
        contrastFlag = false;
        contrastBtn.style.border = "0px solid black"
    }
    else{
        bodyElement.style.filter = 'contrast(200%)';
        contrastFlag = true;
        contrastBtn.style.border = "2px solid black"

    }
})

