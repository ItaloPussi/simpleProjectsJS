const url = './docs/sample.pdf'

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null,
    scale = 1.5
const canvas = document.querySelector("#pdf-render")
      ctx = canvas.getContext("2d")

// Render the page
const renderPage = num => {
    pageIsRendering = true

    // Get page
    pdfDoc.getPage(num).then(page => {
        // Set scale
        const viewport = page.getViewport({scale})
        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderCtx = {
            canvasContext: ctx,
            viewport
        }

        page.render(renderCtx).promise.then(()=>{
            pageIsRendering = false
            
            if(pageNumIsPending !== null){
                renderPage(pageNumIsPending)
                pageNumIsPending = null
            }
        })

        // Output current page
        document.querySelector("#page-num").textContent = num
    })
}

// Check for pages rendering
const queueRenderPage = num => {
    if(pageIsRendering){
        pageNumIsPending = num
    } else {
        renderPage(num)
    }
}

//  Show previous page
const showPreviousPage = () => {
    if(pageNum <=1) return
    pageNum --
    queueRenderPage(pageNum)
}

const showNextPage = () => {
    if(pageNum >= pdfDoc.numPages) return
    pageNum++
    queueRenderPage(pageNum)
}

// Get Document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_
    document.querySelector("#page-count").textContent = pdfDoc.numPages
    renderPage(pageNum)
}).catch(err => {
    // Display div
    const div = document.createElement("div")
    div.classList.add("error")
    div.appendChild(document.createTextNode(err.message))

    document.body.insertBefore(div, canvas)

    // Remove top bar
    document.querySelector(".top-bar").style.display = 'none'

})

// Button events
document.querySelector("#prev-page").addEventListener("click", showPreviousPage)
document.querySelector("#next-page").addEventListener("click", showNextPage)