/////////////////////////////////////////////////////////////////////////////////////////
//
// ROM HEX Editor and Game Genie code patcher
//
/////////////////////////////////////////////////////////////////////////////////////////
// 
// Todo:
// -----
// * Clean up the mess!!!
//   1) global variables
//   2) each DOM element as a variable (in DOM elements ready envent listener)
//   3) event listeners
// * functions gg2Addr() and addr2Gg(). Also improve it
// * function highlightAnimation()
// * outsource the modal in its own HTML File
// 
// Tasks for the future:
// --------------------
// * make the header data editable
// * maybe make some tweaks easier
// * add a ROM map (https://datacrystal.romhacking.net/wiki/Tetris_(Game_Boy):ROM_map)
// * add a RAM map (https://datacrystal.romhacking.net/wiki/Tetris_(Game_Boy):RAM_map)
// * check out how difficult it is to work with ROMs that require ROM bank switching
//    * maybe the banks are at fixed positions - then it shouldn't be a problem
// * identify the tiles and make them editable
// 
// Tasks for the distant future (maybe?):
// -------------------------------------
// * find the OP-codes and also show these in assembly style
// * identify tables and tile maps
// 
// Tolstoj & ChatGPT 2023
//
/////////////////////////////////////////////////////////////////////////////////////////

const disabledButtonText = "nothing to apply - add a code first";
let e_ggCode;
var autoApply = false;

// toggle to automatically apply GG Codes
document.getElementById('autoApplyToggle').addEventListener('change', function() {
  autoApply = this.checked;
});


//**************************************************************************************/
// (2) DOM CONTENT LOADED
//**************************************************************************************/
document.addEventListener('DOMContentLoaded', function() {
  
  // get the DOM elements
  e_ggCode = document.getElementById("ggCode");
  e_romAddr = document.getElementById("romAddr");
  e_oldVal = document.getElementById("oldVal");
  e_newVal = document.getElementById("newVal");
  e_applyCode = document.getElementById("applyCode");
  e_searchInput = document.getElementById("searchInput");

  e_applyCode.setAttribute("title", disabledButtonText);

  // create the background map outline
  document.getElementById(currentMino).click();
  addMatrix();

  // populate the dropdown with the BM map addresses
  const selectElement = document.getElementById("BGMapSelector");

  for (const key in bgMapAddress) {
    const option = document.createElement("option");
    option.value = bgMapAddress[key];
    option.text = key;
    selectElement.appendChild(option);
  }

  // piece orientation (N,E,S,W)
  const selectElements = {
    pieceOri: { element: document.getElementById("pieceOri"), links: ".copyLink.pieceSpawn" },
    nClearedLines: { element: document.getElementById("nClearedLines"), link: document.getElementById("nClearedLinesCode") }
  };
  
  function handleSelectChange() {
    const selectedOptions = Object.values(selectElements).reduce((options, { element }) => {
      options[element.id] = parseInt(element.value, 16);
      return options;
    }, {});

    // Accessing selected option values
    const pieceOriValue = selectedOptions.pieceOri;
    const imageNames = {0: "n.png", 1: "e.png", 2: "s.png", 3: "w.png"};
    const orientationImage = document.getElementById("orientationImage")
    orientationImage.src = "images/" + imageNames[pieceOriValue];
   
    for (const key in selectElements) {
      const { element, links, link } = selectElements[key];
  
      if (key === "pieceOri") {
        const pieceLinks = document.querySelectorAll(links);
        pieceLinks.forEach(link => {
          const { textContent, dataset: { north } } = link;
          const updatedDigit = ((parseInt(north, 16) + selectedOptions.pieceOri) % 16).toString(16).toUpperCase();
          link.textContent = textContent.replace(/(\w)(\w)(.*)/, `$1${updatedDigit}$3`);
          link.classList.add('link-animation');
          setTimeout(() => link.classList.remove('link-animation'), 1010);
        });
      } else if (key === "nClearedLines") {
        const { textContent } = link;
        const updatedLinkText = textContent.replace(/^../, selectedOptions.nClearedLines.toString(16).padStart(2, '0')).toUpperCase();
        link.textContent = updatedLinkText;
        link.classList.remove('inactive');
        link.classList.add('link-animation');
        setTimeout(() => link.classList.remove('link-animation'), 1010);
      }
    }
  }
  
  for (const key in selectElements) {
    selectElements[key].element.addEventListener("change", handleSelectChange);
  }
  
  // Add event listener for "input" event
  e_ggCode.addEventListener("input", handleInput);

  var accordion = document.querySelector('.accordion');
  var panel = document.querySelector('.panel');

  accordion.addEventListener('click', function() {
    this.classList.toggle('active');
    panel.classList.toggle('active');

    var accordionSymbol = this.querySelector('.accordion-symbol');
    if (this.classList.contains('active')) {
      accordionSymbol.textContent = '-';
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      accordionSymbol.textContent = '+';
      panel.style.maxHeight = 0;
    }
  });

  // pressing enter either applies a gg code or searches an address, depending on the scope
  document.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
      if (event.target === e_ggCode) {
        applyCode();
      } else if (event.target === e_searchInput) {
        searchAndSelectCell();
      }
    }
  });

  // Get all the link elements
  const copyLinks = document.querySelectorAll('.copyLink');

  // Add click event listener to each link
  copyLinks.forEach(function(linkElement) {
    linkElement.addEventListener('click', function(event) {
      event.preventDefault();
      const textToCopy = linkElement.textContent;
      e_ggCode.value = textToCopy;

      // when a link is clicked add the GG code and make the link green if it worked
      handleInput();
      if (applyCode()) {
        this.classList.add('clicked');
      }
    });
  });



  // Generate 8x8 table with ID "tileTable"
  var table = document.getElementById('tileTable');

  var count = 0;
  for (var i = 0; i < 8; i++) {
    var row = document.createElement('tr');

    for (var j = 0; j < 8; j++) {
      var cell = document.createElement('td');
      cell.id = 'tilePixel' + count.toString().padStart(2, '0');
      row.appendChild(cell);
      count++;
    }

    table.appendChild(row);
  }


});


//**************************************************************************************/
// (3) FUNCTIONS
//**************************************************************************************/


  // save the bg map and close the modal
  function saveBGMap() {
    var olElement = document.getElementById("selectable");
    var imgElements = olElement.querySelectorAll("li img");
    var startAddress = document.getElementById("BGMapStartAddress").value;
  
    var currentAddress = parseInt(startAddress, 16);
  
    imgElements.forEach(function(imgElement) {
      var src = imgElement.getAttribute("src");
      var imageName = src.split("/").pop().split(".")[0];
  
      // Convert the current address to a 4-digit hex value
      var hexAddress = currentAddress.toString(16).toUpperCase().padStart(4, '0');
  
      var td = document.getElementById(hexAddress);
      td.textContent = imageName;
  
      // Increment the current address
      currentAddress++;
    });
  
    document.getElementById("BG-myModal").style.display = "none";
    scrollToAddress(startAddress);
    document.getElementById("createFileBtn").removeAttribute("disabled");
    addToLog("*Background map starting at address $" + startAddress + " overwritten.");

  }
  
  
//------------------------------------------------------------------------------------------

// close the bg map modal without saving
  function closeBGModal(){
    document.getElementById("BG-myModal").style.display = "none";
  }

//------------------------------------------------------------------------------------------

// Adds text to the Log
function addToLog(logText){
  const log = document.getElementById("log");
  log.value = logText + "\n" + log.value;
  enableDownload();
  updateChecksums(true);
}

//------------------------------------------------------------------------------------------

// enables download button if changes were made
function enableDownload() {
var button = document.getElementById("createFileBtn");
button.removeAttribute("disabled");
}

//------------------------------------------------------------------------------------------

// scrolls to and highlights address (User search)
function searchAndSelectCell() {
  const searchInput = document.getElementById('searchInput');
  const address = searchInput.value.trim();
  if(address != "") scrollToAddress(address);
}

//------------------------------------------------------------------------------------------

// gets the Tile Data (8x8)
function getTileData(startAddress, isOneBPP) {
  // Get the text contents of the <td> elements
  var tdElements = document.querySelectorAll('td');
  var startIndex = Array.from(tdElements).findIndex(td => td.id === startAddress);
  var endIndex = startIndex + (isOneBPP ? 8 : 16);
  var hexValues = Array.from(tdElements).slice(startIndex, endIndex).map(td => td.textContent);

  // Convert the hex values to binary and concatenate them
  var binaryValue = hexValues.map(hexValue => parseInt(hexValue, 16).toString(2).padStart(8, '0')).join('');

  console.log(binaryValue);

  // Populate the existing table with ID "tileTable"
  var table = document.getElementById('tileTable');

  if (table) {
    var rows = table.getElementsByTagName('tr');

    for (var i = 0; i < 8; i++) {
      var cells = rows[i].getElementsByTagName('td');
      for (var j = 0; j < 8; j++) {
        var cellValue = binaryValue[i * 8 + j];
        cells[j].style.backgroundColor = cellValue === '0' ? 'white' : 'black';
      }
    }
  } else {
    console.log('Table with ID "tileTable" does not exist.');
  }
}



//------------------------------------------------------------------------------------------

// Checksums
function updateChecksums(updateInRom) {
  let headerChecksum = 0;
  const hexValueCellElements = document.querySelectorAll('.hexValueCell');

  hexValueCellElements.forEach(element => {
    const hexValue = parseInt(element.textContent.trim(), 16);
    if (!isNaN(hexValue)) {
      if (element.id >= '0134' && element.id <= '014C') { // ignore the global checksum addresses for the header checksum
        headerChecksum -= hexValue + 1;
      }
    }
  });

  headerChecksum &= 0xFF; // Keep only the lower 8 bits

  const headerChecksumField = document.getElementById('headerChecksum');
  headerChecksumField.value = headerChecksum.toString(16).toUpperCase().padStart(2, '0');

  let globalChecksum = 0;

  hexValueCellElements.forEach(element => {
    const hexValue = parseInt(element.textContent.trim(), 16);
    if (!isNaN(hexValue)) {
      if (element.id !== '014E' && element.id !== '014F') {
        globalChecksum += hexValue;
      }
    }
  });

  globalChecksum &= 0xFFFF; // Keep only the lower 16 bits

  const globalChecksumField = document.getElementById('globalChecksum');
  globalChecksumField.value = globalChecksum.toString(16).toUpperCase().padStart(4, '0');

  if (updateInRom) {
    const checksumDigits = headerChecksum.toString(16).toUpperCase().padStart(2, '0');
    const td014D = document.getElementById('014D');
    td014D.textContent = checksumDigits;

    const digits014E = globalChecksum.toString(16).toUpperCase().padStart(4, '0').slice(0, 2);
    const digits014F = globalChecksum.toString(16).toUpperCase().padStart(4, '0').slice(2, 4);

    const td014E = document.getElementById('014E');
    const td014F = document.getElementById('014F');
    td014E.textContent = digits014E;
    td014F.textContent = digits014F;
  }
}

//------------------------------------------------------------------------------------------

// Game title changes in header data
function handleGameTitleKeydown(event) {
  if (event.key === 'Enter') {
    event.target.blur();
  }
}

function validateGameTitle(event) {
  const gameTitleCell = document.getElementById('gameTitle');
  const titleBefore = gameTitleCell.getAttribute('data-titleBefore');

  const input = event.target.textContent.trim().toUpperCase();
  const validInput = input.replace(/[^A-Z]/g, '').slice(0, 16);

  if (validInput.length === 0 || validInput !== input) {
    gameTitleCell.textContent = titleBefore;
    gameTitleCell.setAttribute('data-titleBefore', titleBefore);
    displayToast('invalidGameTitle');
    return;
  }

  gameTitleCell.textContent = validInput;
  gameTitleCell.setAttribute('data-titleBefore', validInput);

  const gameTitle = validInput;
  let hexValues = '';
  let currentIndex = 0;

  for (let i = 0; i < 16; i++) {
    const cellID = '01' + (0x34 + i).toString(16).padStart(2, '0').toUpperCase();
    const targetCell = document.getElementById(cellID);
    if (targetCell) {
      targetCell.textContent = '';
      if (currentIndex < gameTitle.length) {
        const char = gameTitle[currentIndex];
        const asciiCode = char.charCodeAt(0);
        const hexValue = asciiCode.toString(16).padStart(2, '0').toUpperCase();
        targetCell.textContent = hexValue;
        currentIndex++;
        hexValues += hexValue;
      } else {
        targetCell.textContent = '00';
      }
    }
  }

  displayToast('gameTitleChanged');
  const logMessage = 'Game title changed to "' + gameTitle + '"';
  addToLog(logMessage);
  updateChecksums(true);
  scrollToAddress("0134");
}

//------------------------------------------------------------------------------------------

// Loads a ROM file
function validateFile(event) {

  maxFileSize = 3000; // files can't be bigger than that

  var file = event.target.files[0];

  // Check if a file is selected
  if (!file) {
    alert('Please select a file.');
    return false;
  }

  // Check the file extension
  var fileExtension = file.name.split('.').pop().toLowerCase();
  if (fileExtension !== 'gb') {
    alert('Only .gb files are allowed.');
    hideLoadingAnimation();
    return false;
  }

  // Check the file size
  var fileSize = file.size / 1024; // in KB
  if (fileSize > maxFileSize) {
    alert('File size should be less than or equal to ' + round(maxFileSize/1000) + ' MB.');
    hideLoadingAnimation();
    return false;
  }

  // add the file name to the field patchRomName
  var patchRomNameInput = document.getElementById("patchRomName");
  var fileNameWithoutExtension = file.name.replace(".gb", "");
  patchRomNameInput.value = fileNameWithoutExtension + "-modified";

  // Show loading animation
  showLoadingAnimation();

  // Read the file data
  var reader = new FileReader();
  reader.onload = function (event) {
    // File loading completed
    hideLoadingAnimation();

    var fileData = event.target.result;
    var hexData = convertToHex(fileData);
      
      // Create a MutationObserver to detect changes in the table
      var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
          if (mutation.type === 'childList' && mutation.target.id === 'hexViewer' && mutation.target.childNodes.length > 0) {
            
            // Table has been populated, get the title
            obtainHeaderData();
            
            // Disconnect the observer after obtaining the title
            observer.disconnect();
          }
        }
      });

      // Start observing changes in the table
      observer.observe(document.getElementById('hexViewer'), { childList: true });

      // Display or process the hex data
      displayHexData(hexData);

      // change the view wrapper = content / wrapper 2 = chose file
      document.getElementById('wrapper').style.display = 'block';
      document.getElementById('wrapper2').style.display = 'none';
    };

    reader.readAsArrayBuffer(file);
    
    return true;

  }

  function createFileFromHexData() {
    const table = document.getElementById('hexViewer');
    const rows = table.rows;

    // Create a Uint8Array to hold the file data
    const fileSize = (rows.length - 1) * 16;
    const fileData = new Uint8Array(fileSize);

    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].cells;

      for (let j = 1; j < cells.length; j++) {
        const cell = cells[j];
        const hexValue = cell.textContent || '00';
        const byteValue = parseInt(hexValue, 16);
        fileData[(i - 1) * 16 + (j - 1)] = byteValue;
      }
    }

    // Create a Blob from the Uint8Array
    const blob = new Blob([fileData]);

    // Create a download link and trigger the download
    newFileName = 'modified_ROM.gb';
    fileNameFromInput = document.getElementById("patchRomName").value + ".gb";
    if(fileNameFromInput != "") newFileName = fileNameFromInput;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = newFileName;
    link.click();
    displayToast("GLHF");
    addToLog(`Game saved as "${newFileName}"`);
  }

  function convertToHex(fileData) {
    const view = new DataView(fileData);
    const hexValues = [];

    for (let i = 0; i < view.byteLength; i++) {
      const hex = view.getUint8(i).toString(16).toUpperCase().padStart(2, '0');
      hexValues.push(hex);
    }

    return hexValues;
  }

  function displayHexData(hexData) {
    const table = document.getElementById('hexViewer');
    table.innerHTML = '';

    // Create the header row
    const headerRow = table.insertRow();
    headerRow.id = 'headerRow';
    const addressHeader = document.createElement('th');
    addressHeader.textContent = '$';
    headerRow.appendChild(addressHeader);

    for (let i = 0; i < 16; i++) {
      const hexDigit = i.toString(16).toUpperCase();
      const headerCell = document.createElement('th');
      headerCell.textContent = hexDigit;
      headerRow.appendChild(headerCell);
    }

    for (let i = 0; i < hexData.length; i += 16) {
      const row = table.insertRow();
      const addressCell = row.insertCell();
      const hexValueCells = [];

      const address = i.toString(16).toUpperCase().padStart(4, '0').slice(0,3) + "_";
      const addressID = i.toString(16).toUpperCase().padStart(4, '0');
      addressCell.innerHTML = `<a href="#${addressID}"></a>${address}`;
      addressCell.className = "baseAddress";
      addressCell.id = address;

      for (let j = 0; j < 16; j++) {
        const hexValue = hexData[i + j] || '';
        const hexValueCell = row.insertCell();
        hexValueCell.className = 'hexValueCell';
        hexValueCell.textContent = hexValue;
      
        const cellID = addressID.slice(0, 3) + j.toString(16).toUpperCase();
        hexValueCell.id = cellID;
        hexValueCells.push(hexValueCell);
        
        // header data
        if (cellID >= '0000' && cellID <= '014F'){
          hexValueCell.classList.add('header');
          hexValueCell.contentEditable = false;
        } else {
          hexValueCell.contentEditable = true;
        }
        
        // checksum data
        if (cellID === '014D' || cellID === '014E' || cellID === '014F') hexValueCell.classList.add('checksum');

      }
      
      hexValueCells.forEach(cell => {
        cell.addEventListener('focus', function() {
          const cell = event.target;
          if (!cell.hasAttribute('data-previous-value')) {
            cell.setAttribute('data-previous-value', cell.textContent);
          }
        });

        // Set data-previous-value attribute on page load if it's a valid 2-digit hex value
        const originalValue = cell.textContent;
        if (/^[0-9A-Fa-f]{2}$/.test(originalValue)) {
          cell.setAttribute('data-previous-value', originalValue);
        }

        cell.addEventListener('input', function(event) {
          const cell = event.target;
          let value = cell.textContent;

          // Remove non-hex characters
          value = value.replace(/[^0-9A-Fa-f]/g, '');

          if (value.length > 1) {
            // Restrict length to 2 digits
            value = value.slice(0, 2);

            // Remove any leading zeros and convert to uppercase
            value = value.padStart(2, '0').slice(-2).toUpperCase();
          }

          cell.textContent = value;
        });

        // pressing Enter leaves the cell
        cell.addEventListener('keydown', function(event) {
          if (event.key === 'Enter') {
            event.target.blur();
          }
        });

        cell.addEventListener('blur', function(event) {
          const cell = event.target;
          const value = cell.textContent;
          const previousValue = cell.getAttribute('data-previous-value');

          // Check if the value is not a valid 2-digit hex value
          if (!/^[0-9A-Fa-f]{2}$/.test(value)) {
            // Restore original value
            cell.textContent = previousValue || '';
            return;
          }

          // Check if the value has changed
          if (previousValue && previousValue.toLowerCase() !== value.toLowerCase()) {
            cell.classList.add('edited');
            addToLog("Address $" + cell.id + " | " + previousValue + " > " + value + " (" + formattedTime() + "), manually altered");
          } else {
            cell.classList.remove('edited');
          }

          cell.setAttribute('data-previous-value', value);
        });


      });
      
    }

    // update the checksums, but no need to write them to the ROM yet
    updateChecksums(false);
    
    // Open the modal at the beginning 
    // wait 1 second - like this the positioning should be correct
    const openModalButton = document.getElementById("openModalButton");
    setTimeout(function() {
      openModalButton.click();
    }, 1000);

  }

    // Loading animation
    function showLoadingAnimation() {
      document.getElementById("loadingAnimation").style.display = "block";
      document.getElementById("wrapper2").style.display = "none";
    }
  
    function hideLoadingAnimation() {
      document.getElementById("loadingAnimation").style.display = "none";
    }

  //------------------------------------------------------------------------------------------
  
  // Scrolls to and highlights an address
  function scrollToAddress(address) {
    let returnValue = false;
  
    if (/^[0-9a-fA-F]+$/.test(address)) { // only do, if the address is hex
      const oriAddr = parseInt(address, 16);
      address = (oriAddr - 16).toString(16).toUpperCase().padStart(4, '0');
      const targetAddress = address.slice(0, -1) + "0";
      const anchorElement = document.getElementById(targetAddress);
  
      // check if the address exists - if not, show red toast
      if (anchorElement) {
        anchorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
        // Apply the pulsate animation after a slight delay
        setTimeout(function() {
          if (oriAddr === 0x0134) {
            for (let i = 0; i <= 15; i++) {
              const cellId = 0x0134 + i;
              const tdElement = document.getElementById(cellId.toString(16).toUpperCase().padStart(4, '0'));
              tdElement.style.animation = 'pulsate 2s';
  
              // Reset the animation after it completes
              tdElement.addEventListener('animationend', function() {
                tdElement.style.animation = '';
              });
            }
          } else {
            const tdElement = document.getElementById(oriAddr.toString(16).toUpperCase().padStart(4, '0'));
            tdElement.style.animation = 'pulsate 2s';
  
            // Reset the animation after it completes
            tdElement.addEventListener('animationend', function() {
              tdElement.style.animation = '';
            });
          }
        }, 500); // Adjust the delay as needed
  
        returnValue = true;
      } else {
        // show message and erase the non-sensical input
        displayToast("wrongAddress");
        const searchInput = document.getElementById("searchInput");
        searchInput.value = "";
        searchInput.focus();
      }
    }
  
    return returnValue;
  }

//------------------------------------------------------------------------------------------

// display a toast
let toastQueue = [];
let canCall = true;
const maxToastQueueLen = 3; // maximum size of the toastQueue

function displayToast(id) {
  toastQueue.push(id);

  if (toastQueue.length > maxToastQueueLen) {
    toastQueue.splice(0, toastQueue.length - maxToastQueueLen);
  }

  if (toastQueue.length === 1) {
    showNextToast();
  }
}

function showNextToast() {
  if (!toastQueue.length) return;

  let id = toastQueue[0];
  /*if (id !== 'rowsFull' || canCall) {
    if (id === 'rowsFull') {
      canCall = false;
      setTimeout(() => {
        canCall = true;
      }, 10000);
    }*/
    var toast = document.getElementById(id);
    setTimeout(function() {
      toast.classList.add("show");
    }, 10);
    setTimeout(function() {
      toast.classList.remove("show");
      toastQueue.shift();
      showNextToast();
    }, 2500);
  }
//}

//------------------------------------------------------------------------------------------

// populates header data 
function obtainHeaderData() {
  
  // (1) Game title
  let gameTitle = "";
  let i = 308;
  let thisHex = "";

  while (true) {
      const thisAddress = i.toString(16).padStart(4, "0");
      const element = document.getElementById(thisAddress);

      if (!element) {
          break; // Exit the loop if the element does not exist
      }

      thisHex = element.textContent;
      if (i === 323 || thisHex === "00") {
          break; // Exit the loop if the end condition is met
      }

      const thisAsciiValue = String.fromCharCode(parseInt(thisHex, 16));
      gameTitle += thisAsciiValue;
      i++;
  }

  // (2) Header data
  const thisCgbFlag = cgbFlag[document.getElementById("0143").textContent] || "Unknown";
  const thisCartridgeType = cartridgeType[document.getElementById("0147").textContent] || "Unknown";
  const thisRomSize = romSize[document.getElementById("0148").textContent] || "Unknown";
  const thisRamSize = ramSize[document.getElementById("0149").textContent] || "Unknown";
  const thisDestinationCode = destinationCode[document.getElementById("014A").textContent] || "Unknown";
  var thisSgbFlag = "No Super Game Boy enhancements for this game";
  if(document.getElementById("0146").textContent == "03"){
      thisSgbFlag = "This game contains Super Game Boy enhancements";
  }

  let licenseeCode = "";
  const licensee = document.getElementById("014B").textContent;
  if (licensee !== "33") {
      licenseeCode = oldLicenseeCode[licensee] || "Unknown";
  } else {
      const licenseeCode1 = newLicenseeCode[document.getElementById("0144").textContent] || "";
      const licenseeCode2 = newLicenseeCode[document.getElementById("0145").textContent] || "";

      licenseeCode = licenseeCode1; 
      if(licenseeCode2 != "" && licenseeCode1 != ""){
          licenseeCode += " / ";
      }
      licenseeCode += licenseeCode2;
  }

  // Populate the second column of the existing table with header data
  document.getElementById("gameTitle").textContent = gameTitle;
  document.getElementById("gameTitle").setAttribute('data-titleBefore', gameTitle);
  document.getElementById("thisCgbFlag").textContent = thisCgbFlag;
  document.getElementById("thisSgbFlag").textContent = thisSgbFlag;
  document.getElementById("thisCartridgeType").textContent = thisCartridgeType;
  document.getElementById("thisRomSize").textContent = thisRomSize;
  document.getElementById("thisRamSize").textContent = thisRamSize;
  document.getElementById("thisDestinationCode").textContent = thisDestinationCode;
  document.getElementById("licenseeCode").textContent = licenseeCode;
}

//------------------------------------------------------------------------------------------

// this woks, but now we need to make sure, the correct VRAM is loaded

function getBGMap(id) {
  const startIndex = parseInt(id, 16);
  const endIndex = startIndex + 359;

  document.getElementById("BG-myModal").style.display = "flex";

  const selectableList = document.getElementById("selectable");
  const imageElements = selectableList.getElementsByTagName("img");

  for (let i = 0; i < imageElements.length; i++) {
    const cellId = (startIndex + i).toString(16).padStart(2, '0').toUpperCase();
    const cellContent = document.getElementById(cellId).textContent;
    const newFileName = cellContent + ".png";
    imageElements[i].setAttribute("src", "images/green/" + newFileName);
  }
  
  document.getElementById("BGMapStartAddress").value = id;
  
}

//------------------------------------------------------------------------------------------

// tab group
function openTab(event, tabName) {
  var i, tabContent, tab;

  tabContent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }

  tab = document.getElementsByClassName("tab");
  for (i = 0; i < tab.length; i++) {
    tab[i].className = tab[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";

  event.currentTarget.className += " active";
}