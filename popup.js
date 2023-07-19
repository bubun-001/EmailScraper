let scrapeEmails = document.getElementById('scrapEmails');
let list = document.getElementById('emailList');

// Handler to receive emails from content script
chrome.runtime.onMessage.addListener((request , sender , sendResponse) => {

    // get emails 
     let emails = request.emails;
     
     // Display emails on popup
     if(emails==null || emails.length==0){
        // No emails
        let li= document.createElement('li');
        li.innerText = "No emails found";
        list.appendChild(li);
     } else {
        // Display emails 
        emails.forEach((email) => {
            let li= document.createElement('li');
            li.innerText = email;
            list.appendChild(li);
        });
     }
});

// Button's click event listener 

scrapeEmails.addEventListener("click", async ()=>{
     // get current active tab
     let [tab] = await chrome.tabs.query({active:true , currentWindow: true});

     // Execute script to parse emails on page
     chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: scrapeEmailsFromPage,

     });
})

// Function to scrape emails
function scrapeEmailsFromPage() {
    const emailRegEx = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;

    // parse emails from the HTML of the page
    let emails = document.body.innerHTML.match(emailRegEx);

    // send emails to popup
    chrome.runtime.sendMessage({emails});
}