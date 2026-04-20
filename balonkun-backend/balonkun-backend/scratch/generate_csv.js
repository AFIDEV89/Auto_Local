import fs from 'fs';

const rawData = `
### Citroen
* C3 (VD ID: 664)
* C3 (VD ID: 245)
* C5 (VD ID: 284)
* Citroen (VD ID: 713)

### Aprilia
* Aprilia (VD ID: 689)

### Audi 
* Audi (VD ID: 717)

### BMW 
* BMW (VD ID: 718)

### Bajaj
* AVENGER 160 (VD ID: 224)
* Bajaj CT 100 (VD ID: 690)
* Dicscover 110 (VD ID: 171)
* Platina (VD ID: 169)
* Pulsar 125 (VD ID: 174)
* PULSAR 200NS (VD ID: 178)
* Pulsar125 (VD ID: 175)

### Chevrolet
* AVEO (VD ID: 207)
* AVEO (VD ID: 240)
* Beat (VD ID: 213)
* Chevrolet (VD ID: 714)
* CRUZE (VD ID: 208)
* SAIL (VD ID: 209)
* SPARK (VD ID: 214)

### Datsun
* Datsun (VD ID: 709)

### Ford
* ECO SPORT (VD ID: 249)
* FIGO 12 (VD ID: 51)
* FIGO 15 (VD ID: 52)
* Ford (VD ID: 706)
* FREESTYLE (VD ID: 47)
* FREESTYLE (VD ID: 48)

### Honda (2W & 4W)
* Accord (VD ID: 667)
* Amaze (VD ID: 281)
* Brio (VD ID: 666)
* Brio (VD ID: 698)
* City (VD ID: 234)
* CIVIC (VD ID: 58)
* CIVIC (VD ID: 59)
* CRV (VD ID: 668)
* HONDA (VD ID: 640)
* WRV (VD ID: 665)
* BIG WING Hness (VD ID: 157)
* BIG WING CB 350 RS (VD ID: 364)
* Aviator (VD ID: 152, 463)
* Aviator PLUS (VD ID: 495)
* C.B. Shine BS6 (VD ID: 663)
* Dio 110 (VD ID: 151, 204)
* DIO 125 BS6 (VD ID: 691)
* Hornet (VD ID: 692, 448, 480)
* Livo (VD ID: 142, 445, 477, 444, 476)
* Navi (VD ID: 156, 447, 479)
* Shine OLD/SP (VD ID: 200, 202)
* SP 125/160 (VD ID: 140, 437, 469, 203, 439, 471)
* Unicorn BS4 (VD ID: 153)
* X-BLADE (VD ID: 449, 481)

### Hero
* C.B.Z Extreme DUAL SEAT (VD ID: 132)
* CD DAWN (VD ID: 123)
* Glamour New (VD ID: 121)
* Passion Plus/Pro (VD ID: 109, 111)
* SPLENDOR OLD (VD ID: 198)
* Super Splendor (VD ID: 117, 118)

### Hyundai
* Alcazar 6 (VD ID: 102)
* Aura (VD ID: 31, 94, 12)
* Creta (VD ID: 18, 95, 19, 34)
* Elantra (VD ID: 677)
* EXTER (VD ID: 251)
* i10 Nios (VD ID: 10, 11, 30, 257)
* I20 (VD ID: 258)
* Ioniq (VD ID: 678)
* Kona Electric (VD ID: 676)
* SANTA FE (VD ID: 697)
* Santro (VD ID: 1)
* Venue (VD ID: 6, 7, 27, 28, 41, 42, 60, 61, 62)

### ISUZU
* ISUZU (VD ID: 715)

### Jawa 
* JAVA BS6 (VD ID: 661, 194)

### Jeep 
* Jeep (VD ID: 712)

### KIA
* KIA (VD ID: 702)
* SELTOS (VD ID: 9, 29, 658)

### MG
* Gloster1 (VD ID: 669)
* MG (VD ID: 711)
* ZS EV (VD ID: 103)

### Mahindra
* Alturas (VD ID: 674)
* Mahindra (VD ID: 701)
* MARAZZO 8 (VD ID: 45, 46)
* Rexton (VD ID: 84, 85, 670)
* SCR 7 (VD ID: 81, 82, 83)
* Thar (VD ID: 219)
* XUV 300 (VD ID: 40, 39, 5, 38, 4, 26, 3)
* Xuv 400 (VD ID: 672)

### Mercedes-Benz
* Mercedes-Benz (VD ID: 716)

### Nissan
* MAGNITE (VD ID: 74)
* Nissan (VD ID: 707)

### Ola
* S1 Classic (VD ID: 696)

### PIAGGIO
* Aprilia SXR 160 (VD ID: 504)

### Renault
* DUSTER (VD ID: 232)
* KIGER (VD ID: 76)
* Renault (VD ID: 704)
* TRIBER (VD ID: 64)

### Skoda
* Skoda (VD ID: 710)

### Suzuki
* ACCESS OLD (VD ID: 227)
* GIXXER BS4/BS6 (VD ID: 192, 193)

### TATA
* Altroz (VD ID: 13, 14)
* HARRIER (VD ID: 56, 57)
* HEXA (VD ID: 71, 72, 73)
* Nexon1 (VD ID: 105, 671)
* PUNCH (VD ID: 77)
* SAFARI 211 (VD ID: 100)
* TATA (VD ID: 703)
* TIAGO-1 (VD ID: 66, 67)
* Tigor (VD ID: 16, 17, 33)
* TIGOR211 (VD ID: 69, 70)
* Zest (VD ID: 699)

### TVS
* Apache 160 / 4V (VD ID: 163, 164)
* I QUBE (VD ID: 693)
* Jupiter 110/125 (VD ID: 166, 226, 167)
* PEP+ (VD ID: 695)
* RAIDER BS6 (VD ID: 168)

### Toyota
* Altis (VD ID: 679)
* Camry (VD ID: 686)
* COROLA (VD ID: 683)
* Etios (VD ID: 685)
* Glanza (VD ID: 37, 25, 24, 36, 87, 88, 86)
* Innova / Crysta (VD ID: 681, 89, 90)
* LAND CRUSER ZX (VD ID: 682)
* Toyota (VD ID: 705)
* VELFIRE (VD ID: 684)
* Yaris (VD ID: 680)

### VW (Volkswagen)
* Polo (VD ID: 108, 106)
* VW (VD ID: 708)

### Yamaha
* AEROX (VD ID: 688)
* FZ-X SINGLE (VD ID: 182)
* MT 15 V1 V2 (VD ID: 694)
* NEW FZ DUAL SEAT (VD ID: 225)
* R15-V4 DUAL (VD ID: 183)
`;

const lines = rawData.split('\\n');
let currentMake = '';
let csvContent = 'Make,Model,Vehicle Details ID,Vehicle Type\\n';

const twoWheelersBrands = ['Aprilia', 'Bajaj', 'Hero', 'TVS', 'Yamaha', 'Jawa', 'Ola', 'PIAGGIO', 'Suzuki'];

const hondaTwoWheelers = [
    'BIG WING Hness', 'BIG WING CB 350 RS', 'Aviator', 'Aviator PLUS',
    'C.B. Shine BS6', 'Dio 110', 'DIO 125 BS6', 'Hornet', 'Livo', 'Navi',
    'Shine OLD/SP', 'SP 125/160', 'Unicorn BS4', 'X-BLADE'
];

for (const line of lines) {
    if (line.startsWith('### ')) {
        currentMake = line.replace('### ', '').trim();
    } else if (line.startsWith('* ')) {
        const itemLine = line.replace('* ', '').trim();
        const match = itemLine.match(/(.+?)\\s*\\(VD ID:\\s*(.+?)\\)/);
        if (match) {
            const modelName = match[1].trim();
            const vdId = match[2].trim();
            const vdIds = vdId.split(',').map(id => id.trim());
            
            let vehicleType = '4W';
            
            if (twoWheelersBrands.some(brand => currentMake.includes(brand))) {
                vehicleType = '2W';
            } else if (currentMake.includes('Honda')) {
                if (hondaTwoWheelers.includes(modelName)) {
                    vehicleType = '2W';
                }
            }
            
            const cleanMake = currentMake.replace(' (2W & 4W)', '').replace(' (Volkswagen)', '').trim();
            
            // Generate rows. If there are multiple VD IDs, we place them with | separator in one row,
            // or quote the column so it doesn't break CSV. 
            // Better to wrap multiple VD IDs in quotes
            const finalIds = vdIds.length > 1 ? '"' + vdIds.join(', ') + '"' : vdIds[0];
            
            csvContent += '"' + cleanMake + '","' + modelName + '",' + finalIds + ',' + vehicleType + '\\n';
        }
    }
}

fs.writeFileSync('D:/Autoform_Local/empty_make_models.csv', csvContent, 'utf-8');
console.log('CSV generated at D:/Autoform_Local/empty_make_models.csv');
