$(function(){
    var name = "";
    var memoryService;

    try {
        QiSession(function (session) {
            memoryService = session.service("ALMemory");
        }, function () {
            alert("Desconectado");
        });
    } catch (err) {
        alert(err.message);
    }

    $("input").on('keyup', function (e) {
        if (e.which == 13) {
            name = $("input").val();

            memoryService.then(function (memory) {
                memory.insertData("GivenName", name);
                $("input").val("");
                $("input").blur();
            }, function (error) {
                alert("Ocurre un error: " + error);
            });
        } else {
            $(window).click()
        }
    });

    $(window).on('click', function () {
        memoryService.then(function (memory) {
            setTimeout(function () {
                memory.insertData("TabletName", "");
            }, 500);
        }, function (error) {
            alert("Ocurre un error: " + error);
        });
    });

});
