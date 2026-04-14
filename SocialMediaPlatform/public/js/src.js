console.log("JS LOADED");

let deleteForm = null;

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            console.log("DELETE CLICKED");
            deleteForm = this.closest("form");
            document.getElementById("confirmBox").style.display = "flex";
        });
    });

    document.getElementById("confirmBtn").addEventListener("click", () => {
        if (deleteForm) {
            deleteForm.submit();
        }
    });
    document.getElementById("cancelBtn").addEventListener("click", () => {
        document.getElementById("confirmBox").style.display = "none";
    });

});