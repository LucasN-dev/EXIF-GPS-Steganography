function checkCoord(id) {
    var coord = document.getElementById(id).value;
    console.log(coord);

    const regexLat = new RegExp('lat');
    const regexLng = new RegExp('lng');

    var regex = new RegExp('temp');

    if (regexLat.test(id)) {
        regex = new RegExp('^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$');
    } else if (regexLng.test(id)) {
        regex = new RegExp('^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$');
    }
    
    if (document.getElementById('randomCoords').checked) {
        return true
    } else {
        if (regex.test(coord)) {
            return true;
        } else {
            alert("Invalid coordinates");
            return false;
        }
    }
}

function checkJpg() {
    var file = document.getElementById('files');
    var fileName = file.value;
    var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
    if(ext == "jpg" || ext == "jpeg") {
        return true;
    } else {
        alert("Upload jpeg files only");
        file.focus();
        return false;
    }
}

function messageToDec(clearMessage) {
    clearMessage = clearMessage.toUpperCase();
    var decMessage = "";
    for (let i = 0; i < clearMessage.length; i++) {
        decMessage = decMessage + clearMessage.charCodeAt(i);
    }

    return decMessage;
}

function hideCoordsPicker() {
    if (document.getElementById('randomCoords').checked) {
        $('#customCoordsContainer').slideUp();
    } else {
        $('#customCoordsContainer').slideDown();
    }
}

function handleFileSelectEnc() {

    var message = messageToDec(document.getElementById('message').value);

    var splitterIndex = Math.floor(message.length/4);
    var firstpart = message.substr(0, splitterIndex);
    var secondpart = message.substr(splitterIndex, splitterIndex);
    var thirdpart = message.substr(2*splitterIndex, splitterIndex);
    var fourthpart = message.substr(3*splitterIndex);

    console.log(message.length + ' ' + splitterIndex + ' ' + 2*splitterIndex)

    console.log("Message: " + message);
    console.log("first: " + firstpart);
    console.log("sec: " + secondpart);
    console.log("third: " + thirdpart);
    console.log("fourth: " + fourthpart);

    // generate random coords
    var lat = Math.random() * (180) - 90;
    var lng = Math.random() * (180) - 90;

    if (!(document.getElementById('randomCoords').checked)) {
        lat = document.getElementById('latCust').value;
        lng = document.getElementById('lngCust').value;
    }

    console.log(lat);
    console.log(lng);
    
    var gpsIfd = {};
    gpsIfd[piexif.GPSIFD.GPSLatitudeRef] = lat < 0 ? 'S' : 'N';
    gpsIfd[piexif.GPSIFD.GPSLatitude] = piexif.GPSHelper.degToDmsRational(lat);
    gpsIfd[piexif.GPSIFD.GPSLongitudeRef] = lng < 0 ? 'W' : 'E';
    gpsIfd[piexif.GPSIFD.GPSLongitude] = piexif.GPSHelper.degToDmsRational(lng);

    // lat seconds
    gpsIfd[piexif.GPSIFD.GPSLatitude][2][0] = parseInt(firstpart,10);
    gpsIfd[piexif.GPSIFD.GPSLatitude][2][1] = parseInt(secondpart,10);

    //lng seconds
    gpsIfd[piexif.GPSIFD.GPSLongitude][2][0] = parseInt(thirdpart,10);
    gpsIfd[piexif.GPSIFD.GPSLongitude][2][1] = parseInt(fourthpart,10);

    

    console.log(gpsIfd[piexif.GPSIFD.GPSLatitude])
    console.log(gpsIfd[piexif.GPSIFD.GPSLongitude])

    var f = document.getElementById('files').files[0]; // FileList object
    if (!f.type.match('image/jpeg.*')) {
        alert("Upload jpeg files only");
        file.focus();
        return false;
    }

    // display text
    $('#clearMessage').html('Message: ' + document.getElementById('message').value.toUpperCase());
    $('#encodedMessage').html('Message encoded in decimals: ' + message);

    var coordsDecDegrees = piexif.GPSHelper.dmsRationalToDeg(gpsIfd[piexif.GPSIFD.GPSLatitude],gpsIfd[piexif.GPSIFD.GPSLatitudeRef]) + ', ' + piexif.GPSHelper.dmsRationalToDeg(gpsIfd[piexif.GPSIFD.GPSLongitude],gpsIfd[piexif.GPSIFD.GPSLongitudeRef]);

    $('#coordinatesDecDegrees').html('Coordinates in decimal degrees: ' + coordsDecDegrees);
    
    var coordsDMS = gpsIfd[piexif.GPSIFD.GPSLatitudeRef] + '; ' + gpsIfd[piexif.GPSIFD.GPSLatitude][0][0]/gpsIfd[piexif.GPSIFD.GPSLatitude][0][1] + '; ' + gpsIfd[piexif.GPSIFD.GPSLatitude][1][0]/gpsIfd[piexif.GPSIFD.GPSLatitude][1][1] + '; ' + gpsIfd[piexif.GPSIFD.GPSLatitude][2][0]/gpsIfd[piexif.GPSIFD.GPSLatitude][2][1] + ', ' + gpsIfd[piexif.GPSIFD.GPSLongitudeRef] + '; ' + gpsIfd[piexif.GPSIFD.GPSLongitude][0][0]/gpsIfd[piexif.GPSIFD.GPSLongitude][0][1] + '; ' + gpsIfd[piexif.GPSIFD.GPSLongitude][1][0]/gpsIfd[piexif.GPSIFD.GPSLongitude][1][1] + '; ' + gpsIfd[piexif.GPSIFD.GPSLongitude][2][0]/gpsIfd[piexif.GPSIFD.GPSLongitude][2][1];
    $('#coordinatesDMS').html('Coordinates in DMS: ' + coordsDMS);
    
    var coordsDMSRational = gpsIfd[piexif.GPSIFD.GPSLatitudeRef] + '; ' + gpsIfd[piexif.GPSIFD.GPSLatitude][0][0] + '/' + gpsIfd[piexif.GPSIFD.GPSLatitude][0][1] + '; ' + gpsIfd[piexif.GPSIFD.GPSLatitude][1][0] + '/' + gpsIfd[piexif.GPSIFD.GPSLatitude][1][1] + '; ' + gpsIfd[piexif.GPSIFD.GPSLatitude][2][0] + '/' + gpsIfd[piexif.GPSIFD.GPSLatitude][2][1] + ', ' + gpsIfd[piexif.GPSIFD.GPSLongitudeRef] + '; ' + gpsIfd[piexif.GPSIFD.GPSLongitude][0][0] + '/' + gpsIfd[piexif.GPSIFD.GPSLongitude][0][1] + '; ' + gpsIfd[piexif.GPSIFD.GPSLongitude][1][0] + '/' + gpsIfd[piexif.GPSIFD.GPSLongitude][1][1] + '; ' + gpsIfd[piexif.GPSIFD.GPSLongitude][2][0] + '/' + gpsIfd[piexif.GPSIFD.GPSLongitude][2][1];
    $('#coordinatesDMSRational').html('Coordinates in DMS as divisions of rational numbers: ' + coordsDMSRational);
    

    $('#image').hide();
    
    
    var reader = new FileReader();
    reader.onloadend = function(e) {
        var origin = piexif.load(e.target.result);
        console.log("original:");
        console.log(origin);

        var exifBytes = {};

        if (document.getElementById('eraseData').checked){
            var exifObj = {"GPS":gpsIfd};
            exifBytes = piexif.dump(exifObj);
        } else {
            origin["GPS"] = gpsIfd;
            exifBytes = piexif.dump(origin);
        }

        // insert exif binary into JPEG binary(DataURL)
        var jpeg = piexif.insert(exifBytes, e.target.result);
        
        // show JPEG modified exif
        var image = new Image();
        image.src = jpeg;
        //image.width = 200;
        
        image.className = "processedImage";

        $('#image').html(image);
        $('#image').show();
        $('#encDetailsContainer').show();
        $('#downloadButton').prop("href", image.src);
        $('#imageSpan').show();
        $('#downloadButton').show();

    };
    reader.readAsDataURL(f);
}