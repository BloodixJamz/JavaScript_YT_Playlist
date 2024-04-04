// Function to make AJAX request
function fetchData(url) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);

                //console.log(data.message); //[0]

                //Here we are gonna handle the type of values returned
                const receivedData = data.json;

                //console.log(typeof test);
                
                switch (typeof receivedData) {
                    case 'object': // ARRAY IS RETURNED
                        document.querySelector('#dataDisplay').append(createTable(data.json));
                        break;

                    case 'string':  // STRING IS RETURNED 
                        document.querySelector('#dataDisplay').innerText = data.json;
                        break;

                    case 'number': // INT/Float IS RETURNED
                        document.querySelector('#dataDisplay').innerText = data.json;
                        break;

                    default:
                        document.querySelector('#dataDisplay').innerText = 'Format is not supported.';
                        //console.log('Format is not supported.');
                        break;
                }

                //document.querySelector('#dataDisplay').innerText = data.message;

            } else {
                console.error('Error fetching data:', xhr.status);
            }
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
}



// ref : https://stackoverflow.com/questions/1078118/how-do-i-iterate-over-a-json-structure
function createTable(array) {

    // Create the table
    var tableHTML = document.createElement("table");
  
    for (var i = 0; i < array.length; i++){
        //document.write("<br><br>array index: " + i);

        const obj = array[i];

        // Create the title row
        const trTitle = document.createElement("tr");

        // Append the row to the table
        tableHTML.append(trTitle);

        // Create the values rows
        const tr = document.createElement("tr");

        for (var title in obj){

            var value = obj[title];

            if (i === 0)
            {
                // Create the title cell element
                const th = document.createElement("th");

                // Put the value into the title cell innerText
                th.innerText += title;

                // Apppend the title cell to the row
                trTitle.append(th);
            }

            
            // Create the cell element
            const td = document.createElement("td");

            // Put the value into the cell innerText
            td.innerText += value;

            // Apppend the cell to the row
            tr.append(td);
            

            //document.write("<br> - " + title + ": " + value);
        }

        // Append the row to the table
        tableHTML.append(tr);
    }
        
    return tableHTML;
}







/** OLD WAY TO FETCH MUSIC AND DISPLAY IT ON TEMPLATE **/
async function fetchMusic(url) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = async function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);

                //console.log(data.message); //[0]

                //Here we are gonna handle the type of values returned
                const receivedData = data.json;
                //console.log(typeof test);

                switch (typeof receivedData) {
                    case 'object': // ARRAY IS RETURNED
                        const htmlTable = await createTableMusic(data.json);
                        document.querySelector('#dataDisplay').append(htmlTable);
                        break;

                    case 'string':  // STRING IS RETURNED 
                        document.querySelector('#dataDisplay').innerText = data.json;
                        break;

                    case 'number': // INT/Float IS RETURNED
                        document.querySelector('#dataDisplay').innerText = data.json;
                        break;

                    default:
                        document.querySelector('#dataDisplay').innerText = 'Format is not supported.';
                        //console.log('Format is not supported.');
                        break;
                }

                //document.querySelector('#dataDisplay').innerText = data.message;

            } else {
                console.error('Error fetching data:', xhr.status);
            }
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
}






/** OLD WAY TO PRINT TABLE MUSIC ON THE TEMPLATE **/
async function createTableMusic(array) {

    const response = await fetch('/api/fetch_video_id');
    if (!response.ok) {
        throw new Error('Failed to fetch video ID');
    }
    const songValues = await response.json();
    //console.log(songValues.json);

    
    let db_id = null;


    // Init delete row title
    const thDel = document.createElement("th");
    thDel.innerText = "Delete";

    // Create the table
    var tableHTML = document.createElement("table");

    for (var i = 0; i < array.length; i++){
        //document.write("<br><br>array index: " + i);

        const songArray = array[i];

        // Create the title row
        const trTitle = document.createElement("tr");

        // Create the values rows
        const tr = document.createElement("tr");

        let delButton = false;

        for (var title in songArray){

            if (i === 0)
            {
                // Create the title cell element
                const th = document.createElement("th");

                // Put the value into the title cell innerText
                th.innerText += title;

                // Apppend the title cell to the row
                trTitle.append(th);

                trTitle.append(thDel);

                // Append the row to the table
                tableHTML.append(trTitle);
            }

           
            var value = songArray[title];

            db_id = songValues.json[i]['id'];

            for (var s = 0; s < songValues.json.length; s ++){
                //let video_author = songValues.json[s]['author']
                let video_name = songValues.json[s]['name']
                let video_id = songValues.json[s]['video_id']

                //console.log(video_name, video_id);
                //console.log(video_name, value);
                if (value === video_name)
                {
                    //console.log(video_name, value);

                    tr.addEventListener('click', function() {
                        //test(video_id);
                        playNextVideo(video_id);
                    });
                }
            }
                
    
            // Create the cell element
            const td = document.createElement("td");

            // Put the value into the cell innerText
            td.innerText += value;

            // Apppend the cell to the row
            tr.append(td);

            // Append the row to the table
            tableHTML.append(tr);

            //document.write("<br> - " + title + ": " + value);
        }


        // Init the delete button at the end of the table
        if (!delButton){
            // Init delete button
            const tdDel = document.createElement("td");

            const button = document.createElement("button");
            button.innerText = "Del"

            //console.log(db_id);

            button.addEventListener('click', function() {
                //test(video_id);
                deleteSong(db_id);
            });

            tdDel.append(button);
            tr.append(tdDel);

            delButton = true;
        }
    }

    return tableHTML;
}




/** Allow to delete songs by clicked on the button on the table **/
async function deleteSong(id) {
    const response = await fetch('/api/delete_song', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-HTTP-Method-Override': 'DELETE' // Method override header
        },
        body: JSON.stringify({ id }) // Sending id in the body
    });
      
    if (!response.ok) {
        throw new Error('Failed to delete video');
    }
}