document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("loginForm");
    if (!form)
        return;
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var emailInput = document.getElementById("email");
        var passwordInput = document.getElementById("password");
        if (!emailInput || !passwordInput) {
            alert("เกิดข้อผิดพลาด");
            return;
        }
        var payload = {
            email: emailInput.value.trim(),
            password: passwordInput.value
        };
        fetch("/sports_rental_system/executive/api/login.php", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(function (res) {
            return res.json();
        })
            .then(function (data) {
            if (data.success) {
                window.location.href = "index.html";
            }
            else {
                alert(data.message || "เข้าสู่ระบบไม่สำเร็จ");
            }
        })
            .catch(function (err) {
            alert("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
            console.error(err);
        });
    });
});
