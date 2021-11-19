let contrastFlag = false;
let fontFlag = false;
let accessibilityFlag = false;

let accessibilityBtn = document.getElementById("accessibilityBtn")
let bodyElement = document.querySelector('body');
let fontBtn = document.getElementById('fontSizeBtn');
let contrastBtn = document.getElementById('contrastBtn');
let accessibilityStatement = document.getElementById('accessibilityStatement');
let job_a_links = document.querySelectorAll('.job a')


// Get all the elements in the document which don't have child elements with position absolute or fixed.
function getNonFixedElements() {
    return document.querySelectorAll('body *:not(.position-absolute):not(.position-fixed):not(:has(.position-absolute):not(.position-fixed))');
}



job_a_links.forEach(function(link){
    link.tabIndex = -1;
})


// accessibility Function
function accessibility() {
    if(accessibilityFlag){
        accessibilityFlag = false;

        fontBtn.style.setProperty('pointer-events', 'none')
        fontBtn.style.setProperty('display', 'none')
        fontBtn.style.setProperty('visibility', 'hidden')

        contrastBtn.style.setProperty('pointer-events', 'none')
        contrastBtn.style.setProperty('display', 'none')
        contrastBtn.style.setProperty('visibility', 'hidden')

        accessibilityStatement.style.setProperty('pointer-events', 'none')
        accessibilityStatement.style.setProperty('display', 'none')
        accessibilityStatement.style.setProperty('visibility', 'hidden')

    }
    else{
        accessibilityFlag = true;


        fontBtn.style.setProperty('pointer-events', 'auto')
        fontBtn.style.setProperty('display', 'block')
        fontBtn.style.setProperty('visibility', 'visible')

        contrastBtn.style.setProperty('pointer-events', 'auto')
        contrastBtn.style.setProperty('display', 'block')
        contrastBtn.style.setProperty('visibility', 'visible')

        accessibilityStatement.style.setProperty('pointer-events', 'auto')
        accessibilityStatement.style.setProperty('display', 'block')
        accessibilityStatement.style.setProperty('visibility', 'visible')
        
    }
}

function fontSize() {
    if(fontFlag) {
        bodyElement.style.fontSize = '1.25rem';
        fontFlag = false;
        fontBtn.style.outline = "0px solid black"

    }
    else{
        bodyElement.style.fontSize = '1.75rem';
        fontFlag = true;
        fontBtn.style.outline = "2px solid black"
    }
}

function contrast() {
    if(contrastFlag) {
        contrastFlag = false;
        contrastBtn.style.outline = "0px solid black"
        bodyElement.style.backgroundColor = '#F2EDDF';

        let bodyElements = getNonFixedElements();
        bodyElements.forEach(function(element){
            element.style.filter = 'contrast(100%)';
        })

    }
    else{
        contrastFlag = true;
        contrastBtn.style.outline = "2px solid black";
        bodyElement.style.backgroundColor = 'white';

        let bodyElements = getNonFixedElements();
        bodyElements.forEach(function(element){
            element.style.filter = 'contrast(100%)';
        })
    }
}


accessibilityBtn.addEventListener('click', () =>{
    accessibility();
})
window.addEventListener('keydown', (e) =>{

    if(e.key === 'Enter' && document.activeElement == accessibilityBtn){
        accessibility();
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
