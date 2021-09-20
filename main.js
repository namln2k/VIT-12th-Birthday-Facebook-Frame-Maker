var finalSize;
var frameUrl;

function uploadFile(event) {
    var selectedFile = event.target.files[0];

    var fileReader = new FileReader();

    $('#preview').croppie({
        viewport: {
            width: 500,
            height: 500
        }
    });

    fileReader.onload = function (e) {
        $("#preview").croppie('bind', {
            url: e.target.result
        });

        var image = new Image();
        image.src = e.target.result

        image.onload = function () {
            uploadImgSize = this.width < this.height ? this.width : this.height;

            finalSize = (Math.floor((uploadImgSize - 1) / 400) + 1) * 400;
            finalSize = finalSize > 2000 ? 2000 : finalSize;

            frameUrl = "./frames/frame" + finalSize + ".png"

            $("#frame").attr("src", frameUrl);
            $("#frame").css("visibility", "visible");
        };
    }

    fileReader.readAsDataURL(selectedFile);
}

function confirmFile() {
    sizeOpt = { width: finalSize, height: finalSize };
    $("#preview").croppie('result', {
        type: "canvas",
        size: sizeOpt,
        resultSize: sizeOpt
    }).then(function (resp) {
        alert("Vào console copy gửi e cái link với :v")
        console.log(resp);
        mergeImages([resp, { src: frameUrl }]).then(b64 => {
            var a = $("<a>")
                .attr("href", b64)
                .attr("download", "img.png")
                .appendTo("body");
            a[0].click();
            a.remove();
        });
    });
}