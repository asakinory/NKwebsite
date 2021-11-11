let contrastFlag = false;
let fontFlag = false;
let accessabilityFlag = false;

let accessabilityBtn = document.getElementById("accessibilityBtn")
let bodyElement = document.querySelector('body');
let fontBtn = document.getElementById('fontSizeBtn');
let contrastBtn = document.getElementById('contrastBtn');
let accessabilityStatement = document.getElementById('accessabilityStatement');


// Accessability Function
function accessability() {
    if(accessabilityFlag){
        accessabilityFlag = false;

        fontBtn.style.setProperty('pointer-events', 'none')
        fontBtn.style.setProperty('display', 'none')
        fontBtn.style.setProperty('visibility', 'hidden')

        contrastBtn.style.setProperty('pointer-events', 'none')
        contrastBtn.style.setProperty('display', 'none')
        contrastBtn.style.setProperty('visibility', 'hidden')

        accessabilityStatement.style.setProperty('pointer-events', 'none')
        accessabilityStatement.style.setProperty('display', 'none')
        accessabilityStatement.style.setProperty('visibility', 'hidden')

    }
    else{
        accessabilityFlag = true;


        fontBtn.style.setProperty('pointer-events', 'auto')
        fontBtn.style.setProperty('display', 'block')
        fontBtn.style.setProperty('visibility', 'visible')

        contrastBtn.style.setProperty('pointer-events', 'auto')
        contrastBtn.style.setProperty('display', 'block')
        contrastBtn.style.setProperty('visibility', 'visible')

        accessabilityStatement.style.setProperty('pointer-events', 'auto')
        accessabilityStatement.style.setProperty('display', 'block')
        accessabilityStatement.style.setProperty('visibility', 'visible')
        
    }
}

function fontSize() {
    if(fontFlag) {
        bodyElement.style.fontSize = '1.25rem';
        fontFlag = false;
        fontBtn.style.border = "0px solid black"

    }
    else{
        bodyElement.style.fontSize = '1.75rem';
        fontFlag = true;
        fontBtn.style.border = "2px solid black"
    }
}

function contrast() {
    if(contrastFlag) {
        bodyElement.style.filter = 'contrast(100%)';
        contrastFlag = false;
        contrastBtn.style.border = "0px solid black"
        bodyElement.style.backgroundColor = '#F2EDDF';
    }
    else{
        bodyElement.style.filter = 'contrast(200%)';
        contrastFlag = true;
        contrastBtn.style.border = "2px solid black";
        bodyElement.style.backgroundColor = 'white';
    }
}


accessabilityBtn.addEventListener('click', () =>{
    accessability();
})
window.addEventListener('keydown', (e) =>{

    if(e.key === 'Enter' && document.activeElement == accessabilityBtn){
        accessability();
    }
})

fontBtn.addEventListener('click', () => {
    fontSize();
})
fontBtn.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
        fontSize();
    }
})

contrastBtn.addEventListener('click', () => {
    contrast();
})
contrastBtn.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
        contrast();
    }
})
