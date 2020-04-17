$(function () {
    var email = "";
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
            email = $("input").val();

            memoryService.then(function (memory) {
                memory.insertData("GivenEmail", email);
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
                memory.insertData("TabletEmail", "");
            }, 500);
        }, function (error) {
            alert("Ocurre un error: " + error);
        });
    });

});
