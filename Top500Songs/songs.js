// 4th redo of Assignment. Adding efficiency and simplicity each time. 

//Question 1: Reading in Json data
var songArray = JSON.parse(json);
console.log(songArray);

//Question 2: populating songTable 

// Originally, populating the tables involed a lot of code. But then I found a helpful 


function mainTable(data){
    var table = document.getElementById('songTable');   // getting id from table. It is in bodyu now so dont loose titles
    table.innerHTML = "";

	    for (var i = 0; i < data.length; i++){          // iterate through array and populate each row with object under colomn names
		    var row = `<tr>
                            <td>${data[i].rank}</td> 
                            <td>${data[i].title}</td> 
                            <td>${data[i].artist}</td> 
                            <td>${data[i].album}</td> 
                            <td>${data[i].year}</td> 
					    </tr>`
            table.innerHTML += row  // use innerHTML to set text inside table
        }
        selectAllYears();
}
//mainTable(songArray);

// I found this very helpful video https://www.youtube.com/watch?v=eS-FVnhjvEQ which allowed me to greatly simplify my code for populating table. 

//Question 3: Filtering data by year range
//3.1: creating years as options

function selectAllYears() {
    // Start Year
    let selectYear = 1947;
    var option = document.getElementById('option1');

    for (let i = 1947; i <= 2010; i++) {  // iterating through all necessary years 
        let selected = (i === selectYear ?  ' selected' : '');
        option += '<option value="' + i + '"' + selected + '>' + i + '</option>'; 
    }
    document.getElementById("selectYearStart").innerHTML = option;
    // End Year
    let selectYear2 = 2009;

    var option2 = document.getElementById('option2');

    for (let i = 1947; i <= 2010; i++) {
        let selected2 = (i === selectYear2 ? ' selected' : '');
        option2 += '<option value="' + i + '"' + selected2 + '>' + i + '</option>';  
    }
    document.getElementById("selectYearEnd").innerHTML = option2;
}

// https://www.html-code-generator.com/javascript/drop-down/year-month-day I found the following webpage when I was looking 
// for somwhere to copy  all the years as options from. I used this to help with creating a framework for inputing all the 
// uears as options. 

// 3.2: creating a function to filter the array based on a start and end year

function years(startDate, endDate, data){
         var filteredData = [];       

        for (var i = 0; i < data.length;i++){   // iterating through all the data and removing songs from array which do not fit 
            var year = data[i].year             // date range 

            if (year >= startDate && year <= endDate){
                filteredData.push(data[i])             // which every elements meet these requirements are added to new array
            }
        }
        
    return filteredData
}

// 3.3: implementing the onlick function 

function allYears(){
    var startDate = document.getElementById("selectYearStart").value;
    var endDate = document.getElementById("selectYearEnd").value;
    if (startDate > endDate){
        alert("Start date must be less than end date.")
    }
    else {
        console.log('Start Date: ', startDate, 'End Date: ', endDate);
        var filteredData = years(startDate, endDate, songArray);    // the previous function is called with the user's inputted data         
        mainTable(filteredData);
    }                               // This new array is then run through the function to populate the table
}

// the tableList() function calls on the mainTable() function. It specifies which 25 objects are to be looped through and 
// entered into the table. 


//Question 4: Filtering data by artist 

//4.1: creating a function to filter array based on if artist element includes a value

function searchArtist(value, data) {
    var filteredData = [];

    for (var i = 0; i < data.length;i++){
        value = value.toLowerCase();         // converting to lower case to allow for nonsensitive search 
        var artist = data[i].artist.toLowerCase(); 

        if (artist.includes(value)){    // use includes to allow even partially typed names to match to artists 
            filteredData.push(data[i])
        }
    }
    return filteredData
}

//4.2: implementing the onkeyup function 

function slelectArtist(){                   // this function is called with onkeyup so it is uodated every letter that is typed in
    var value = document.getElementById("selectArtist").value;
    console.log('Value: ', value);
    var filteredData= searchArtist(value, songArray);
    mainTable(filteredData);                              // I only include the main populating function now in search becasue
    //tableList(filteredData, table, rows, current_page);  // using the pagination ones with search meant some items were getting excluded form search. 
    //SetupPages(songArray, pagination_element, rows);
}

//Further Extentions: Filter by title 

// Title

function searchTitle(value, data) {       // searching for title is exact same conept as artist 
    var filteredData = [];

    for (var i = 0; i < data.length;i++){
        value = value.toLowerCase();
        var title = data[i].title.toLowerCase();

        if (title.includes(value)){
            filteredData.push(data[i])
        }
    }
    return filteredData
}

function selectTitle(){
    var value = document.getElementById("selectTitle").value;
    console.log('Value: ', value);
    var filteredData = searchTitle(value, songArray);
    mainTable(filteredData);
}

// Only display 25 results per page: 

// This was a later edit after the required questions 
// I did not know how to move through each page by pressing a button yet, 
// but I knew how I would go about putting only 25 results per page. 

var table = document.getElementById('songTable'); 
let current_page = 1;
let rows = 25;

function tableList (data, wrapper, pageRows, page) {
	wrapper.innerHTML = "";                // set this to empty to ensure every time we call this function table is empty. So it doesnt keep adding items on top of one another
	page--;                                // page starts on 1 but array starts at 0, so need to minus 1. 
	let start = pageRows * page;          
	let end = start + pageRows;
    var ItemsOnPage = []                   // I used the same concept as searching for specifc strings
    for (let i = start; i < end; i++){     // Iterate through data and only keep 25 items per that page. 
        ItemsOnPage.push(data[i]);         // depending on paghe number, those items will be kept. 
    } 
    //return ItemsOnPage;
    console.log(ItemsOnPage);                   // checking to see if we change page number only that 25 song range is displayed.
    mainTable(ItemsOnPage);         // Now this new section of array is passed into populating table function with selected 25 objects                   
}
// Making buttons to scroll through the pages. 

/* Originally, I had two buttons in my html file: 'previous page' & 'next page'. I used queryselector and
add event listner to specify a function to happen on each click of these buttons. One to move to previous page abd 
one next. However, I came across this youtube video  https://www.youtube.com/watch?v=IqYiVHrO2U8 which explained how to have
page numbers and cycle through them. I have used this code but edited it for my table. 
*/

var pagination_element = document.getElementById('pagination');
function SetupPages (data, wrapper, pageRows) {
	wrapper.innerHTML = "";

	let pageNum = data.length / pageRows; 
	for (let i = 1; i < pageNum + 1; i++) {
		let btn = buttonClick(i, data);   // every button has current page (i) and every button has some data correspondiong to it. 
		wrapper.appendChild(btn);
	}
}

function buttonClick (page, data) {
	let button = document.createElement('button'); // creating a button
	button.innerText = page;    // want each button label to be equal to the page number it will display 

	if (current_page == page) {  // if the page passed through is equal to this page then the button is 
        button.classList.add('active');  // set to active i.e. it is the active page
    }                                    

	button.addEventListener('click', function () {   
		current_page = page;   // whichever button the user clicks on will be equal to the current page
		tableList(data, table, rows, current_page);

		let current_btn = document.querySelector('.pagenum button.active'); // These next three liens are for CSS 
		current_btn.classList.remove('active');                         // so that buttons change colour to show which page 
		button.classList.add('active');                             // the user is on. 
	});

	return button;
}

tableList(songArray, table, rows, current_page);
SetupPages(songArray, pagination_element, rows);
// The biggest problem I am encountering is that if I search for somehting it works but when i click next
// page it doesnt work properly. To partially solve this I made the searching and year selecting involve only the
// main table function. So every time you search you loose pagination but at least the search is accurate. 

