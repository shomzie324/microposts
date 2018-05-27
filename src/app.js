import { http } from "./http";
import { ui } from "./ui";

// Get posts when DOM loads
document.addEventListener("DOMContentLoaded", getPosts);

// Listen for submit post
document.querySelector(".post-submit").addEventListener("click", submitPost);

// Listen for edit state
document.querySelector("#posts").addEventListener("click", enableEdit);

// Listen for cancel button click
document.querySelector(".card-form").addEventListener("click", cancelEdit);

// Listen for delete button click
document.querySelector("#posts").addEventListener("click", deletPost);

// get posts from api then use UI controller to display them
function getPosts() {
    http.get("http://localhost:3000/posts")
        .then(data => ui.showPosts(data))
        .catch(err => console.log(err));
}

// submit post to back end api
function submitPost() {

    const title = document.querySelector("#title").value;
    const body = document.querySelector("#body").value;
    const id = document.querySelector("#id").value;

    const data = {
        title,
        body
    }

    if (title === "" || body === "") {
        ui.showAlert("please fill in all fields", "alert alert-danger");
    } else {
        // check for id
        if(id === ""){
        // create post
        http.post("http://localhost:3000/posts", data)
        .then(data => {
            ui.showAlert("Post Added.", "alert alert-success");
            ui.clearFields();
            getPosts();
        })
        .catch(err => console.log(err));
        } else {
            // update post
            http.put(`http://localhost:3000/posts/${id}`, data)
        .then(data => {
            ui.showAlert("Post Updated.", "alert alert-success");
            ui.changeFormState("add");
            getPosts();
        })
        .catch(err => console.log(err));
        }
    }
}

// delete posts
function deletPost(e){
    if(e.target.parentElement.classList.contains("delete")){
        const id = e.target.parentElement.dataset.id;
        if(confirm("Are you sure you want to delete this post?")){
            http.delete(`http://localhost:3000/posts/${id}`)
            .then(data => {
                ui.showAlert(data, "alert alert-success");
                getPosts();
            })
            .catch(err => console.log(err));
        }
    }

    e.preventDefault();
}

// Enable edit state
function enableEdit(e) {
    if (e.target.parentElement.classList.contains("edit")) {
        const id = e.target.parentElement.dataset.id;
        const body = e.target.parentElement.previousElementSibling.textContent;
        const title = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;

        const data = {
            id,
            title,
            body
        }

        // fill form with current post
        ui.fillForm(data);
    }

    e.preventDefault();
}

// cancel edit state
function cancelEdit(e){
    if(e.target.classList.contains('post-cancel')){
        ui.changeFormState('add');
    }

    e.preventDefault();;
}