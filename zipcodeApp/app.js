// Listen for submit
document.querySelector("#zipForm").addEventListener("submit", getLocationInfo)

// Listen for delete
document.querySelector("#output").addEventListener("click", deleteLocation)
// Input
const zip = document.querySelector("#zip")

function getLocationInfo(e){
    e.preventDefault()
    
    // Make request
    fetch(`http://api.zippopotam.us/us/${zip.value}`)
        .then(response => {
            if(response.status != 200){
                showIcon("remove")
                document.querySelector("#output").innerHTML = `
                <article class="message is-danger">
                    <div class="message-body">
                        Invalid Zipcode, please try again
                    </div>
                </article>`;
                throw Error(response.statusText)
            } else {
                showIcon("check")
                return response.json()
            }
        })
        .then(data => {
            // Show location info
            let output = ""
            data.places.forEach(place=>{
                output+= `
                    <article class="message is-primary">
                        <div class="message-header">
                            <p>Location info</p>
                            <button class="delete"></button>
                        </div>
                        <div class="message-body">
                            <ul>
                            <li><strong>City: </strong>${place['place name']}</li>
                            <li><strong>State: </strong>${place['state']}</li>
                            <li><strong>Longitude: </strong>${place['longitude']}</li>
                            <li><strong>Latitude: </strong>${place['latitude']}</li>
                            </ul>
                        </div>
                    </article>
                `
            })

            document.querySelector("#output").innerHTML = output
        })
        .catch(err => console.log(err))
    }

    function showIcon(icon){
        document.querySelector(".icon.remove-icon").style.display = 'none'
        document.querySelector(".icon.check-icon").style.display = 'none'
        
        // Show the correct icon
        document.querySelector(`.icon.${icon}-icon`).style.display = 'inline-flex'
    }

    function deleteLocation(e){
        if(e.target.className != 'delete') return
        document.querySelector(".message").remove()
        zip.value = ''
        document.querySelector(".icon.check-icon").style.display = 'none'
    }