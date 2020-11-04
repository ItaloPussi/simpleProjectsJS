const tagsToIgnore = ['SCRIPT', 'NOSCRIPT', 'STYLE', 'SOURCE']
replaceText(document.body)


function replaceText(element){

	if (tagsToIgnore.includes(element.nodeName)) return

	if(element.hasChildNodes()){
		element.childNodes.forEach(replaceText)
	}else if(element.nodeType === Text.TEXT_NODE){
		element.textContent =  element.textContent.replace(/caralho/gi, "baralho")
		element.textContent =  element.textContent.replace(/porra/gi, "borra")
		element.textContent =  element.textContent.replace(/puta/gi, "porta")
		element.textContent =  element.textContent.replace(/cu/gi, "cool")
		element.textContent =  element.textContent.replace(/buceta/gi, "Paleta")
		element.textContent =  element.textContent.replace(/pinto/gi, "ponto")

		if(element.textContent.match(/italo/gi)){

			const newElement = document.createElement("span")
			newElement.innerHTML = element.textContent.replace(/(italo)/gi, 
				'<span class="rainbow">$1</span>')
			element.replaceWith(newElement)
		}
	}
}