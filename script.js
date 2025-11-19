let score = 0;

function check(q, status) {
    if (status === "correct") {
        score++;
    }

    if (q === 2) {
        document.getElementById("result").innerHTML =
            "نتیجه شما: " + score + " از 2";
        score = 0;
    }
}
