// HEADER INFO
// this was more or less directly taken from here: https://gbdev.io/pandocs/The_Cartridge_Header.html

const cgbFlag = {
  "00":"The game was made for the DMG",
  "80":"The game supports CGB enhancements, but is backwards compatible with monochrome Game Boys",
  "C0":"The game works on CGB only"
}

const newLicenseeCode = {
  "00": "None",
  "01": "Nintendo R&D1",
  "08": "Capcom",
  "13": "Electronic Arts",
  "18": "Hudson Soft",
  "19": "b-ai",
  "20": "kss",
  "22": "pow",
  "24": "PCM Complete",
  "25": "san-x",
  "28": "Kemco Japan",
  "29": "seta",
  "30": "Viacom",
  "31": "Nintendo",
  "32": "Bandai",
  "33": "Ocean/Acclaim",
  "34": "Konami",
  "35": "Hector",
  "37": "Taito",
  "38": "Hudson",
  "39": "Banpresto",
  "41": "Ubi Soft",
  "42": "Atlus",
  "44": "Malibu",
  "46": "angel",
  "47": "Bullet-Proof",
  "49": "irem",
  "50": "Absolute",
  "51": "Acclaim",
  "52": "Activision",
  "53": "American sammy",
  "54": "Konami",
  "55": "Hi tech entertainment",
  "56": "LJN",
  "57": "Matchbox",
  "58": "Mattel",
  "59": "Milton Bradley",
  "60": "Titus",
  "61": "Virgin",
  "64": "LucasArts",
  "67": "Ocean",
  "69": "Electronic Arts",
  "70": "Infogrames",
  "71": "Interplay",
  "72": "Broderbund",
  "73": "sculptured",
  "75": "sci",
  "78": "THQ",
  "79": "Accolade",
  "80": "misawa",
  "83": "lozc",
  "86": "Tokuma Shoten Intermedia",
  "87": "Tsukuda Original",
  "91": "Chunsoft",
  "92": "Video system",
  "93": "Ocean/Acclaim",
  "95": "Varie",
  "96": "Yonezawa/s’pal",
  "97": "Kaneko",
  "99": "Pack in soft",
  "A4": "Konami (Yu-Gi-Oh!)"
};
  
const cartridgeType = {
  "00": "ROM ONLY",
  "01": "MBC1",
  "02": "MBC1+RAM",
  "03": "MBC1+RAM+BATTERY",
  "05": "MBC2",
  "06": "MBC2+BATTERY",
  "08": "ROM+RAM 1",
  "09": "ROM+RAM+BATTERY 1",
  "0B": "MMM01",
  "0C": "MMM01+RAM",
  "0D": "MMM01+RAM+BATTERY",
  "0F": "MBC3+TIMER+BATTERY",
  "10": "MBC3+TIMER+RAM+BATTERY 2",
  "11": "MBC3",
  "12": "MBC3+RAM 2",
  "13": "MBC3+RAM+BATTERY 2",
  "19": "MBC5",
  "1A": "MBC5+RAM",
  "1B": "MBC5+RAM+BATTERY",
  "1C": "MBC5+RUMBLE",
  "1D": "MBC5+RUMBLE+RAM",
  "1E": "MBC5+RUMBLE+RAM+BATTERY",
  "20": "MBC6",
  "22": "MBC7+SENSOR+RUMBLE+RAM+BATTERY",
  "FC": "POCKET CAMERA",
  "FD": "BANDAI TAMA5",
  "FE": "HuC3",
  "FF": "HuC1+RAM+BATTERY"
};

const romSize = {
  "00": "32 KB (2 ROM banks, no banking needed)",
  "01": "64 KB (4 ROM banks",
  "02": "128 KB (8 ROM banks)",
  "03": "256 KB (16 ROM banks)",
  "04": "512 KB (32 ROM banks)",
  "05": "1 MB (64 ROM banks)",
  "06": "2 MB (128 ROM banks)",
  "07": "4 MB (256 ROM banks)",
  "08": "8 MB (512 ROM banks)",
  "52": "1.1 MB (72 ROM banks)",
  "53": "1.2 MB (80 ROM banks)",
  "54": "1.5 MB (96 ROM banks)"
};

const ramSize = {
  "00": "No RAM",
  "01": "Unused",
  "02": "8 KB",
  "03": "32 KB",
  "04": "128 KB",
  "05": "64 KB"
};

const destinationCode = {
  "00": "Japan (and possibly overseas)",
  "01": "Overseas only"
};

const oldLicenseeCode = {
  "00": "None",
  "01": "Nintendo",
  "08": "Capcom",
  "09": "Hot-B",
  "0A": "Jaleco",
  "0B": "Coconuts Japan",
  "0C": "Elite Systems",
  "13": "EA (Electronic Arts)",
  "18": "Hudsonsoft",
  "19": "ITC Entertainment",
  "1A": "Yanoman",
  "1D": "Japan Clary",
  "1F": "Virgin Interactive",
  "24": "PCM Complete",
  "25": "San-X",
  "28": "Kotobuki Systems",
  "29": "Seta",
  "30": "Infogrames",
  "31": "Nintendo",
  "32": "Bandai",
  "34": "Konami",
  "35": "HectorSoft",
  "38": "Capcom",
  "39": "Banpresto",
  "3C": ".Entertainment i",
  "3E": "Gremlin",
  "41": "Ubisoft",
  "42": "Atlus",
  "44": "Malibu",
  "46": "Angel",
  "47": "Spectrum Holoby",
  "49": "Irem",
  "4A": "Virgin Interactive",
  "4D": "Malibu",
  "4F": "U.S. Gold",
  "50": "Absolute",
  "51": "Acclaim",
  "52": "Activision",
  "53": "American Sammy",
  "54": "GameTek",
  "55": "Park Place",
  "56": "LJN",
  "57": "Matchbox",
  "59": "Milton Bradley",
  "5A": "Mindscape",
  "5B": "Romstar",
  "5C": "Naxat Soft",
  "5D": "Tradewest",
  "60": "Titus",
  "61": "Virgin Interactive",
  "67": "Ocean Interactive",
  "69": "EA (Electronic Arts)",
  "6E": "Elite Systems",
  "6F": "Electro Brain",
  "70": "Infogrames",
  "71": "Interplay",
  "72": "Broderbund",
  "73": "Sculptered Soft",
  "75": "The Sales Curve",
  "78": "t.hq",
  "79": "Accolade",
  "7A": "Triffix Entertainment",
  "7C": "Microprose",
  "7F": "Kemco",
  "80": "Misawa Entertainment",
  "83": "Lozc",
  "86": "Tokuma Shoten Intermedia",
  "8B": "Bullet-Proof Software",
  "8C": "Vic Tokai",
  "8E": "Ape",
  "8F": "I’Max",
  "91": "Chunsoft Co.",
  "92": "Video System",
  "93": "Tsubaraya Productions Co.",
  "95": "Varie Corporation",
  "96": "Yonezawa/S’Pal",
  "97": "Kaneko",
  "99": "Arc",
  "9A": "Nihon Bussan",
  "9B": "Tecmo",
  "9C": "Imagineer",
  "9D": "Banpresto",
  "9F": "Nova",
  "A1": "Hori Electric",
  "A2": "Bandai",
  "A4": "Konami",
  "A6": "Kawada",
  "A7": "Takara",
  "A9": "Technos Japan",
  "AA": "Broderbund",
  "AC": "Toei Animation",
  "AD": "Toho",
  "AF": "Namco",
  "B0": "Acclaim",
  "B1": "ASCII or Nexoft",
  "B2": "Bandai",
  "B4": "Square Enix",
  "B6": "HAL Laboratory",
  "B7": "SNK",
  "B9": "Pony Canyon",
  "BA": "Culture Brain",
  "BB": "Sunsoft",
  "BD": "Sony Imagesoft",
  "BF": "Sammy",
  "C0": "Taito",
  "C2": "Kemco",
  "C3": "Squaresoft",
  "C4": "Tokuma Shoten Intermedia",
  "C5": "Data East",
  "C6": "Tonkinhouse",
  "C8": "Koei",
  "C9": "UFL",
  "CA": "Ultra",
  "CB": "Vap",
  "CC": "Use Corporation",
  "CD": "Meldac",
  "CE": ".Pony Canyon or",
  "CF": "Angel",
  "D0": "Taito",
  "D1": "Sofel",
  "D2": "Quest",
  "D3": "Sigma Enterprises",
  "D4": "ASK Kodansha Co.",
  "D6": "Naxat Soft",
  "D7": "Copya System",
  "D9": "Banpresto",
  "DA": "Tomy",
  "DB": "LJN",
  "DD": "NCS",
  "DE": "Human",
  "DF": "Altron",
  "E0": "Jaleco",
  "E1": "Towa Chiki",
  "E2": "Yutaka",
  "E3": "Varie",
  "E5": "Epcoh",
  "E7": "Athena",
  "E8": "Asmik ACE Entertainment",
  "E9": "Natsume",
  "EA": "King Records",
  "EB": "Atlus",
  "EC": "Epic/Sony Records",
  "EE": "IGS",
  "F0": "A Wave",
  "F3": "Extreme Entertainment",
  "FF": "LJN"
};

// background maps
// name: start address, width, height, vram tile set
const bgMaps = {
  "Copyright Screen":   ["4A07", 20, 18, "Start-Set"],
  "Title Screen":       ["4B6F", 20, 18, "Start-Set"],
  "Music Type":         ["4CD7", 20, 18, "Game Play-Set"],
  "A-Type Select":      ["4E3F", 20, 18, "Game Play-Set"],
  "B-Type Select":      ["4FA7", 20, 18, "Game Play-Set"],
  "A-Playfield":        ["3E8F", 20, 18, "Game Play-Set"],
  "B-Playfield":        ["3FF7", 20, 18, "Game Play-Set"],
  "Mario & Luigi":      ["5214", 20, 18, "Game Play-Set"],
  "2P-Playfield":       ["537C", 20, 18, "Game Play-Set"],

  "Celebration":        ["510F", 10, 18, "Game Play-Set"],
  "Score Counter":      ["2889", 10, 18, "Game Play-Set"],

  "Mario Score":        ["54E4", 20,  4, "Celebration-Set"],
  "Luigi Score":        ["5534", 20,  6, "Celebration-Set"],

  "Platform":           ["51C4", 20,  4, "Celebration-Set"],
  "Scaffold (l)":       ["1429",  1,  7, "Celebration-Set"],
  "Scaffold (r)":       ["1430",  1,  7, "Celebration-Set"],
  "Buran Scaffold (l)": ["141B",  1,  7, "Celebration-Set"],
  "Buran Scaffold (r)": ["1422",  1,  7, "Celebration-Set"],

  "Pause":              ["2839",  8, 10, "Game Play-Set"],
  "Game Over":          ["2976",  8,  6, "Game Play-Set"]
};

// Tile Addresses in ROM (Start address, #Tiles, #BPP, show)
const tileAddressesInROM = {
  "ABC":                ["415F",  39, 1, true],
  "Game Play":          ["323F", 197, 2, true],
  "Celebration":        ["55AC", 207, 2, true],
  "Start Screen":       ["4297", 119, 2, true],
  "Partial":            ["4297",   9, 2, false]
};

// this contains the vRam Tile sets that can be loaded, there are 3 of them
const vRamTileSets = {
  "Start-Set":       [tileAddressesInROM["ABC"], 
                      tileAddressesInROM["Start Screen"]
                     ],
  "Game Play-Set":   [
                      tileAddressesInROM["ABC"], 
                      tileAddressesInROM["Partial"], 
                      tileAddressesInROM["Game Play"]
                     ],
  "Celebration-Set": [
                      tileAddressesInROM["Celebration"]
                     ]
};

// COLOR PALETTES
// this was taken from here: https://bulbapedia.bulbagarden.net/wiki/Color_palette_(Generations_I%E2%80%93II)
// at the moment, it only shows the background colors
const paletteLookup = {
  "BGB Emulator":        ["E0F8D0", "88C070", "346856", "081820"],
  "MGB-001":             ["F8F8F8", "A8A8A8", "585858", "080808"],
  "DMG-01":              ["B8F878", "80B050", "486828", "102000"],
  "MGB-101":             ["08F8F8", "08A8A8", "085858", "080808"],
  "SGB-1-A":             ["F8E8C8", "D89048", "A82820", "301850"],
  "SGB-1-B":             ["D8D8C0", "C8B070", "B05010", "000000"],
  "SGB-1-C":             ["F8C0F8", "E89850", "983860", "383898"],
  "SGB-1-D":             ["F8F8A8", "C08048", "F80000", "501800"],
  "SGB-1-E":             ["F8D8B0", "78C078", "688840", "583820"],
  "SGB-1-F":             ["D8E8F8", "E08850", "A80000", "004010"],
  "SGB-1-G":             ["000050", "00A0E8", "787800", "F8F858"],
  "SGB-1-H":             ["F8E8E0", "F8B888", "804000", "301800"],
  "SGB-2-A":             ["F0C8A0", "C08848", "287800", "000000"],
  "SGB-2-B":             ["F8F8F8", "F8E850", "F83000", "500058"],
  "SGB-2-C":             ["F8C0F8", "E88888", "7830E8", "282898"],
  "SGB-2-D":             ["F8F8A0", "00F800", "F83000", "000050"],
  "SGB-2-E":             ["F8C880", "90B0E0", "281060", "100810"],
  "SGB-2-F":             ["D0F8F8", "F89050", "A00000", "180000"],
  "SGB-2-G":             ["68B838", "E05040", "E0B880", "001800"],
  "SGB-2-H":             ["F8F8F8", "B8B8B8", "707070", "000000"],
  "SGB-3-A":             ["F8D098", "70C0C0", "F86028", "304860"],
  "SGB-3-B":             ["D8D8C0", "E08020", "005000", "001010"],
  "SGB-3-C":             ["E0A8C8", "F8F878", "00B8F8", "202058"],
  "SGB-3-D":             ["F0F8B8", "E0A878", "08C800", "000000"],
  "SGB-3-E":             ["F8F8C0", "E0B068", "B07820", "504870"],
  "SGB-3-F":             ["7878C8", "F868F8", "F8D000", "404040"],
  "SGB-3-G":             ["60D850", "F8F8F8", "C83038", "380000"],
  "SGB-3-H":             ["E0F8A0", "78C838", "488818", "081800"],
  "SGB-4-A":             ["F0A868", "78A8F8", "D000D0", "000078"],
  "SGB-4-B":             ["F0E8F0", "E8A060", "407838", "180808"],
  "SGB-4-C":             ["F8E0E0", "D8A0D0", "98A0E0", "080000"],
  "SGB-4-D":             ["F8F8B8", "90C8C8", "486878", "082048"],
  "SGB-4-E":             ["F8D8A8", "E0A878", "785888", "002030"],
  "SGB-4-F":             ["B8D0D0", "D880D8", "8000A0", "380000"],
  "SGB-4-G":             ["B0E018", "B82058", "281000", "008060"],
  "SGB-4-H":             ["F8F8C8", "B8C058", "808840", "405028"],
  "GBC: Up":             ["FFFFFF", "FFAD63", "843100", "000000"],
  "GBC: Up+A":           ["FFFFFF", "FF8484", "943A3A", "000000"],
  "GBC: Up+B":           ["FFE6C5", "CE9C84", "846B29", "5A3108"],
  "GBC: Down":           ["FFFFA5", "FF9494", "9494FF", "000000"],
  "GBC: Down+A":         ["FFFFFF", "FFFF00", "FF0000", "000000"],
  "GBC: Down+B":         ["FFFFFF", "FFFF00", "7B4A00", "000000"],
  "GBC: Left":           ["FFFFFF", "63A5FF", "0000FF", "000000"],
  "GBC: Left+A":         ["FFFFFF", "8C8CDE", "52528C", "000000"],
  "GBC: Left+B":         ["FFFFFF", "A5A5A5", "525252", "000000"],
  "GBC: Right":          ["FFFFFF", "52FF00", "FF4200", "000000"],
  "GBC: Right+A":        ["FFFFFF", "0BF3F1", "0063C5", "000000"],
  "GBC: Right+B":        ["000000", "008484", "FFDE00", "FFFFFF"],
  "GBC: Pokémon Red":    ["FFFFFF", "FF8484", "943A3A", "000000"],
  "GBC: Pokémon Blue":   ["FFFFFF", "63A5FF", "0000FF", "000000"],
  "GBC: Pokémon Green":  ["FFFFFF", "7BFF31", "0063C5", "000000"],
  "GBC: Pokémon Yellow": ["FFFFFF", "FFFF00", "FF0000", "000000"]
};

// stores the composition of object tiles (= Sprites)
// first entry: ROM tile set (see "tileAddressesInROM")
// #: position in ROM tile set (starts at 0)
//     flags: 
//       * "x" = mirror horizontally
//       * "y" = mirror vertically
//       * "d" = non-editable duplicate  <-- DEPRECTAED
//       * "n" = this tile will be rendered on a new line
// use "e" to indicate an empty tile, that is not editable
//
// a tile can have multiple flags 0-nxd: tile #0 on a new line,... 
// ...mirrored horizontally and as a non-editable duplicate
const spriteObjects = {
  
  // Borders
  "Score/Lines Border": 
    ["Game Play",
    "0","1","2", 
    "6-n","e","7",
    "16-n","18","17",
    "3-n","4","5"],
  
  "Next Box Border": 
    ["Game Play",
    "8","9","10",
    "11-n","e","12",
    "13-n","14","15"],

  "Outermost Border": 
    ["Game Play",
    "23","24","25",
    "26-n","e","27",
    "28-n","29","30"],

    "Dotted border":
    ["Game Play",
    "36","32","33","34","35",
    "37-n","39", "40", "41", "42"],

  "Bright border":
    ["Game Play",
    "49","50","51",
    "52-n", "e", "53",
    "54-n", "57", "58"
    ],
  
  "Nintendo": 
    ["Start Screen","12","9","10","11","10","e","13","14","15","16","17","18"],

  "Numbers":  
    ["ABC","0","1","2","3","4","5","6","7","8","9"],
  
  "Letters": 
    ["ABC",
    "10","11","12","13","14","15","16","17","18","19","20",
    "21","22","23","24","25","26","27","28","29","30","31",
    "32","33","34","35"],

  "Buran Energyia (Shuttle)":
    ["Celebration",
    "e","192","193","e",
    "e-n","197","198","e",
    "204-n","205","117","118",
    "164-n","165","166","167",
    "84-n","85","86","87",
    "68-n","69","70","71",
    "160-n","161","162","163",
    "156-n","157","158","159"],

  "Small rocket (missile)":
    ["Celebration",
    "168",   "168-x",
    "169-n", "169-x",
    "170-n", "170-x",
    "171-n", "171-x"],

   "Medium rocket (Titan II GLV)":
    ["Celebration",
    "152",   "152-x",
    "153-n", "153-x",
    "128-n", "128-x",
    "154-n", "154-x",
    "155-n", "155-x"],
    
  "Big rocket (Soyuz)":
    ["Celebration",
    "0",   "0-x",
    "16-n", "16-x",
    "79-n", "79-x",
    "128-n", "128-x",
    "128-n", "128-x",
    "129-n", "129-x",
    "151-n", "151-x"],

  "Playfield Wall":
    ["Game Play","75","76-n","77-n"],

  "Bright letters":
    ["Game Play",
    "72", "73", "74", "78", "79", "96", "97", "98", "99",
    "100-n", "101", "102", "103", "104", "105", "106", "107", "108",
    "110-n", "111", "112", "113", "114", "115", "116", "117", "118",
    "119-n", "150", "151"],
 
  // Pieces
  "L-Piece":              ["Game Play","84","84","84","84-n","e","e"],
  "J-Piece":              ["Game Play","81","81","81","e-n","e","81"],
  "I-Piece (horizontal)": ["Game Play","90","91","91","95"],
  "I-Piece (vertical)":   ["Game Play","80","88-n","88-n","89-n"],
  "O-Piece":              ["Game Play","83","83","83-n","83"],
  "Z-Piece":              ["Game Play","82","82","e","e-n","82","82"],
  "S-Piece":              ["Game Play","e","86","86","86-n","86","e"],
  "T-Piece":              ["Game Play","85","85","85","e-n","85","e"], 
  
  "Mario Head":["Game Play", "126", "126-x", "127-n", "127-x"],
  "Luigi Head":["Game Play", "144", "144-x", "145-n", "145-x"],
  
  "Rod":["Game Play", "131", "133-n", "132-n"],
  "Moon":["Game Play", "153", "154" ,"155-n", "156"],
  "Female Dancer":["Game Play", "137", "138", "e", "141", "142", "139-n", "140", "e", "170", "171"],
  "Violin Player":["Game Play",  "172", "173", "e", "174", "175", "176-n", "177", "e", "176", "177-d"],
  "Balalayka Player":["Game Play",  "185", "186", "e", "189", "186", "187-n", "188", "e", "187", "188"],
  "Bass Drum Player":["Game Play", "181", "182" ,"183-n", "184"],
  "Accordion Player":["Game Play",  "146", "146-x", "e", "148", "148-x", "147-n", "147-x", "e", "149", "149-x"],

  "Dome":[
    "Game Play", 
    "e-n", "158",
    "e-n", "159",
    "e-n", "160",
    "161-n", "162",
    "163-n", "164",
    "165-n", "166",
    "168-n", "e"],
}