class GitHub {
  constructor() {
    this.base = `https://api.github.com/users/`;
  }

  async ajaxUser(user) {
    var mykey = config.MY_ID;
    var secretkey = config.SECRET_KEY;

    // user URL
    const userURL = `${this.base}${user}?client_id${mykey}&client_secret='${secretkey}'`;

    // repos URL
    const reposURL = `${this.base}${user}/repos?client_id${mykey}&client_secret='${secretkey}'`;

    // get users
    const userData = await fetch(userURL);
    const response = await userData.json();

    // get repos
    const repoData = await fetch(reposURL);
    const result = await repoData.json();

    return {
      response,
      result
    };
  }
}

class UI {
  showFeedback(text, type) {
    const feedback = document.querySelector(".feedback");
    feedback.textContent = text;
    feedback.classList.add("showItem", type);

    setTimeout(function() {
      feedback.classList.remove("showItem", type);
      feedback.textContent = "";
    }, 1500);
  }

  getData(data) {
    console.log(data.response);
    const {
      avatar_url: avatar,
      name,
      public_repos: repos,
      html_url: link,
      message,
      login
    } = data.response;

    if (message === "Not Found") {
      this.showFeedback("user does not exist");
    } else {
      this.displayUser(avatar, link, name, login, repos);
      const searchUser = document.getElementById("searchUser");
      searchUser.value = "";
    }
  }

  displayRepos(userID, repos) {
    const reposBtn = document.querySelectorAll("[data-id]");
    reposBtn.forEach(btn => {
      console.log(userID);
      btn.dataset.id;
      if (btn.dataset.id === userID) {
        const parent = btn.parentNode;
        repos.forEach(repo => {
          const p = document.createElement("p");
          p.innerHTML = `<p><a href="${repo.html_url}" target="_blank">${repo.name}</a></p>`;
          parent.appendChild(p);
        });
      }
    });
  }

  displayUser(avatar, link, name, login, repos) {
    const usersList = document.getElementById("github-users");

    console.log(link);

    const singleUser = document.createElement("div");
    singleUser.classList.add("row", "single-user", "my-3");

    singleUser.innerHTML = ` <div class=" col-sm-6 col-md-4 user-photo my-2">
     <img src="${avatar}" class="img-fluid" alt="">
     </div>
     <div class="col-sm-6 col-md-4 user-info text-capitalize my-2">
     <h6>name : <span>${name}</span></h6>
     <h6>github : <a href="${link}" class="badge badge-primary">link</a> </h6>
     <h6>public repos : <span class="badge badge-success">${repos}</span> </h6>
     </div>
     <div class=" col-sm-6 col-md-4 user-repos my-2">
     <button type="button" data-id=${login} id="getRepos" class="btn reposBtn text-capitalize mt-3">
     get repos
     </button>
     </div> `;

    usersList.appendChild(singleUser);
  }
}

(function() {
  const ui = new UI();

  const github = new GitHub();

  const form = document.getElementById("searchForm");
  const user = document.getElementById("searchUser");

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const textValue = user.value;

    if (textValue === "") {
      ui.showFeedback("Field cannot be blank", "alert-danger");
    } else {
      ui.showFeedback("succesful", "alert-success");
      github
        .ajaxUser(textValue)
        .then(data => ui.getData(data))
        .catch(error => console.log(error));
    }
  });

  document
    .querySelector("#github-users")
    .addEventListener("click", function(e) {
      e.preventDefault();
      if (e.target.classList.contains("reposBtn")) {
        const userID = e.target.dataset.id;
        github
          .ajaxUser(userID)
          .then(data => ui.displayRepos(userID, data.result));
      }
    });
})();
