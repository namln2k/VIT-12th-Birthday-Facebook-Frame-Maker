// Size of the final image
var finalSize;

// If the final size can't be determined, it's default value will be set to 1200
finalSize = 1200;

// Frame URL that is suitable for the user's file (400px, 800px, 1200px, 1600px, 2000px)
var frameUrl;

// When upload button is clicked, trigger the upload progress
function uploadFile(event) {
    // Selected file
    var selectedFile = event.target.files[0];

    // File reader
    var fileReader = new FileReader();

    // Init croppie
    $("#preview").croppie({
        // Viewport size
        viewport: {
            width: 500,
            height: 500,
        },
    });

    // When file is uploaded
    fileReader.onload = function (e) {
        // Bind uploaded image to croppie
        $("#preview").croppie("bind", {
            url: e.target.result,
        });

        var image = new Image();
        image.src = e.target.result;

        image.onload = function () {
            // Get the smaller side of the image
            uploadImgSize = this.width < this.height ? this.width : this.height;

            // Calculate the size of the final image
            finalSize = (Math.floor((uploadImgSize - 1) / 400) + 1) * 400;
            finalSize = finalSize > 2000 ? 2000 : finalSize;

            // Define the frame URL
            frameUrl = "./frames/frame" + finalSize + ".png";

            // Display the frame
            $("#frame").css("visibility", "visible");
            $("#frame").attr("src", frameUrl);
        };
    };

    fileReader.readAsDataURL(selectedFile);
}

// When download button is clicked, create the final image and allow user to download it
function confirmFile() {
    // Size of the final image to apply to croppie
    sizeOpt = { width: finalSize, height: finalSize };

    // Create the final image with croppie
    $("#preview")
        .croppie("result", {
            type: "canvas",
            size: sizeOpt,
            resultSize: sizeOpt,
        })
        .then(function (resp) {
            // Merge user's image with the frame
            mergeImages([resp, { src: frameUrl }]).then((b64) => {
                // Trigger download
                var downloadLink = $("<a>")
                    .attr("href", b64)
                    .attr("download", "img.png")
                    .css("visibility", "hidden")
                    .appendTo("body");
                downloadLink[0].click();
                downloadLink.remove();
            });
        });
}
