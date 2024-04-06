const BASE_URL = "https://crudcrud.com/api/e6c34e8c3aeb4901b394f74c8e3804b1/posts";
const USERBASE_URL = "https://crudcrud.com/api/e6c34e8c3aeb4901b394f74c8e3804b1/users";

window.onload = () => {
  if (loggedIn()) {
    console.log("Du är loggad in");
    userLoggedIn();
  } else {
    console.log("Inte inloggad");
    userLoggedOut()
  }
};
const userOutput = document.querySelector("#userOutput");
const getTime= ()=>{
  const today= new Date();
  const hours= today.getHours();
  let minutes=today.getMinutes();
  if(minutes<10){
  minutes+= 0+minutes
  }
  const year= today.getFullYear();
  const month= today.getMonth()+1;
  const day= today.getDay();
  return `${year}/${month}/${day} ${hours}:${minutes}`
}
const getLoggedInUser= ()=>{
  return JSON.parse(sessionStorage.getItem("loggedInUser"));
 }
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const showSignInBtn = document.querySelector("#showSignInBtn");
showSignInBtn.addEventListener("click", () => {
  document.getElementById("signInForm").classList.add("active");
});

const showRegisterBtn = document.querySelector("#showRegisterBtn");
showRegisterBtn.addEventListener("click", () => {
  document.getElementById("registerContainer").classList.add("active");
});
const closeSignIn = document.querySelector("#closeSignIn");
closeSignIn.addEventListener("click", () => {
  document.getElementById("signInForm").classList.remove("active");
});
const closeRegister = document.querySelector("#closeRegister");
closeRegister.addEventListener("click", () => {
  document.getElementById("registerContainer").classList.remove("active");
});
const submitBtn = document.querySelector("#submitBtn");
submitBtn.addEventListener("click", async(e) => {
  e.preventDefault();
  await postInformation();
});

const registerUser = async () => {
  const userExistMsg = document.querySelector("#userExist");
  const registerUsername = document.querySelector("#registerUsername").value.toLowerCase();
  const registerPassword = document.querySelector("#registerPassword").value;
  const firstName = document.querySelector("#firstName").value;
  const lastName = document.querySelector("#lastName").value;
  const userEmail = document.querySelector("#userEmail").value;
  if (registerUsername.length < 4) {
    userExistMsg.innerHTML = "Användarnamnet måste ha minst 4 tecken";
  } else if (registerPassword.length < 7) {
    userExistMsg.innerHTML = "Lösenordet måste ha minst 7 tecken";
  } else if (await ifUserExist(registerUsername)) {
    userExistMsg.innerHTML = "Användarnamnet är upptaget";
  } else {
    const user = {
      firstname: firstName,
      lastname: lastName,
      email: userEmail,
      username: registerUsername,
      password: registerPassword,
      myPosts: [],
      likedPost:[],
      comments:[]
    };
    try {
      const res = await fetch(USERBASE_URL, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(user),
      });
    } catch (error) {
      console.error("Något blev fel att skicka informationen till databasen", error);
    }
    document.querySelector("#registerUsername").value = "";
    document.querySelector("#registerPassword").value = "";
    document.getElementById("registerContainer").classList.remove("active");
    document.querySelector("#firstName").value = "";
    document.querySelector("#lastName").value = "";
    document.querySelector("#userEmail").value = "";
  }
};
const ifUserExist = async (username) => {
  try {
    const res = await fetch(USERBASE_URL);
    if (!res.ok) {
      throw new Error("Något är fel med servern");
    }
    const data = await res.json();
    for (const user of data) {
      if (user.username === username) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Något blev fel med att hämta informationen", error);
  }
};
const checkLogin = async (username, password) => {
  try {
    const res = await fetch(USERBASE_URL);
    if (!res.ok) {
      throw new Error("Något är fel på serversidan");
    }
    const data = await res.json(); 
    console.log(data);
    for (const user of data) {
      if (user.username === username && user.password === password) {
        console.log(user.username);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Något blev fel med hämtningen");
  }
};
const setLoginstatus = (status) => {
  sessionStorage.setItem("loggedIn", status ? "true" : "false");
};
const loggedIn = () => {
  return sessionStorage.getItem("loggedIn") === "true";
};
const loginUser = async () => {
  try {
    const userName = document.querySelector("#userName").value.toLowerCase();
    const userPassword = document.querySelector("#userPassword").value;
    if (await checkLogin(userName, userPassword)) {
      setLoginstatus(true);
     const userID= await fetchUserID(userName)
     const user= {user:userName,
      token: userID}
      sessionStorage.setItem("loggedInUser", JSON.stringify(user));
      
      userLoggedIn()
    } else {
      let errorLogin = document.querySelector("#errorLogin");
      errorLogin.innerHTML = "Fel användarnamn/lösenord";
      setTimeout(() => {
        errorLogin.innerHTML = "";
      }, 3000);
    }
  } catch (error) {
    console.error("Något blev fel med inloggninen", error);
  }
};
const fetchUserID= async (username)=>{
  try{
    const res= await fetch(USERBASE_URL);
    const data= await res.json();
    const user= data.find(user=> user.username===username);
    return user._id;

  }catch(error){
    console.error("Något blev fel med att hämta id")
  }
}
const userLoggedIn = () => {
  const userInterface = document.querySelector("#userInterface");
  userInterface.innerHTML = "";
  userInterface.style.alignItems = "center";
  let loggoutButton = document.createElement("button");
  loggoutButton.classList.add("user-button");
  loggoutButton.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> Logga ut`;
  loggoutButton.addEventListener("click", ()=>{
    userLoggedOut()
  })
  
  let welcomeMessage = document.createElement("p");
  let text = JSON.parse(sessionStorage.getItem("loggedInUser"));
  welcomeMessage.innerHTML = `Välkommen, ${capitalizeFirstLetter(text.user)}`;
  userInterface.appendChild(welcomeMessage);
  userInterface.appendChild(loggoutButton);
};
const userLoggedOut = () => {
  const userInterface = document.querySelector("#userInterface");
  userInterface.innerHTML = "";
  const signInButton= document.createElement("button");
  signInButton.classList.add("user-button");
  signInButton.classList.add("sign");
  signInButton.innerHTML=`<i class="fa-solid fa-lock"></i> Logga in`
  signInButton.addEventListener("click", ()=>{
    document.querySelector("#signInForm").classList.add("active")
  })
  const registerButton= document.createElement("button");
  registerButton.classList.add("user-button");
  registerButton.classList.add("register");
  registerButton.innerHTML=`<i class="fa-solid fa-user"></i> Registrera`
  registerButton.addEventListener("click", ()=>{
    console.log(registerButton)
    document.getElementById("registerContainer").classList.add("active");
  })
  userInterface.appendChild(signInButton);
  userInterface.appendChild(registerButton);
  setLoginstatus(false);
sessionStorage.removeItem("loggedInUser")
};
const loginBtn = document.querySelector("#loginBtn");
loginBtn.addEventListener("click", async () => {
  await loginUser();
});

const postInformation = async () => {
  const titleInput = document.querySelector("#titleInput").value;
  const imgUrl = document.querySelector("#imgUrl").value;
  let textInput = document.querySelector("#textInput").value;
 
  try {
    if(!loggedIn()){
      alert("du måste vara inloggad på sidan");
      return;
    }
    if (!titleInput && !imgUrl && !textInput) {
      console.log("Detta blev fel");
      return;
    } 

    
    const blogPost = {
      createdBy:{
        userID: getLoggedInUser().token,
        user: getLoggedInUser().user
      },
      date: getTime(),
      headline: titleInput,
      image: imgUrl,
      text: textInput,
      likes: [],
      comments: [],

    };
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(blogPost),
    });
    const newPostData= await res.json();
    const postID= newPostData._id;
    const title= newPostData.headline;
    await addPostToUser(postID,title);
    await fetchPost();
    document.querySelector("#titleInput").value = "";
    document.querySelector("#imgUrl").value = "";
    document.querySelector("#textInput").value = "";
  } 
   catch (error) {
    console.error("Något blev fel med post", error);
  }
};

const addPostToUser = async(id, title)=>{
  let user;
  const loggedInUser= getLoggedInUser()
  try{ 
    
    const response= await fetch(`${USERBASE_URL}/${loggedInUser.token}`);
    const userData= await response.json();
    const postInformation= {
      postID: id,
      postTitle: title
    }
    userData.myPosts.push(postInformation)
   user=userData
  }
  catch(error){
  console.error("Något blev fel att hämta ID:et till inlägget", error)
  }

  try{
    const updatedInformation={
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        username: user.username,
        password: user.password,
        myPosts: user.myPosts,
        likedPost:user.likedPost,
        comments:user.comments
      };
 
    const putRespone= await fetch(`${USERBASE_URL}/${loggedInUser.token}`,{
      method:"PUT",
      headers:{"Content-type": "application/json"},
      body:JSON.stringify(updatedInformation)
    })
    if(!putRespone.ok){
      throw new Error("Något blev fel med att lägga upp på servern", putRespone)
    }
    console.log("Inlägget las till i arrayet")
  }
  catch(error){
    console.error("Något blev fel", error)
  }
}
const fetchPost = async () => {
  try {
    userOutput.innerHTML = "";
    const res = await fetch(BASE_URL);
    if (!res.ok) {
      throw new Error("Något blev fel med hämtning från url");
    }
    const posts = await res.json();
    posts.forEach((post) => {
    showPost(post);
    });
  } catch (error) {
    console.error("Något blev fel med konverteringen av informationen", error);
  }
};

const editBox = document.querySelector("#editBox");

const showPost = async(post) => {
  let blogContainer = document.createElement("div");
  let headline = document.createElement("h2");
  let image = document.createElement("img");
  let blogpost = document.createElement("p");

  blogContainer.classList.add("blog-post");

  headline.classList.add("bloggheadline");
  headline.innerHTML = post.headline;

  image.classList.add("bloggimg");
  image.src = post.image;

  let buttonContainer = document.createElement("div");
  let deleteButton = document.createElement("button");
  let editButton = document.createElement("button");
  let likeButton = document.createElement("button");

  likeButton.classList.add("user-interface");
  likeButton.innerHTML = `<i class="fa-regular fa-heart"></i>`;
  likeButton.classList.add("red");

  deleteButton.classList.add("user-interface");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can "></i>`;
  editButton.innerHTML = `<i class="fa-solid fa-pen white"></i>`;
  editButton.classList.add("user-interface");
  editButton.classList.add("white");
  let likeContainer = document.createElement("div");
  let likeCounter = document.createElement("p");
  if (!post.likes) {
    likeCounter.innerHTML = `Inga likes`;
  } else {
    likeCounter.innerHTML = `${post.likes} personer gillar detta`;
  }
  likeCounter.style.fontStyle = "italic";
  likeContainer.style.display = "flex";
  likeContainer.style.alignItems = "center";
  likeContainer.style.gap = "5px";

  let commentButton = document.createElement("button");
  commentButton.classList.add("submit-btn");
  commentButton.innerHTML = "Kommentera";

  let commentArea = document.createElement("textarea");
  commentArea.classList.add("comment");

  likeContainer.appendChild(likeCounter);
  likeContainer.appendChild(likeButton);

  commentButton.addEventListener("click", async () => {
    await commentPost(commentArea, post);
    commentArea.value = "";
  });

  likeButton.addEventListener("click", async () => {
    await likePost(post);
  });
  editButton.addEventListener("click", async () => {
    await editPost(post);
  });
  deleteButton.addEventListener("click", async () => {
    await deletePost(post);
  });

  let commentList = document.createElement("ul");
  commentList.style.listStyleType = "none";
  commentList.style.display = "flex";
  commentList.style.gap = "5px";
  commentList.style.flexDirection = "column";

  if (post.comments) {
    post.comments.forEach((comment) => {
      let comments = document.createElement("li");
      comments.classList.add("comments");
      comments.innerHTML = comment;

      commentList.appendChild(comments);
    });
  }

  buttonContainer.classList.add("button-box");

  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);

  blogpost.classList.add("blogg-text");
  blogpost.innerHTML = post.text;

  blogContainer.appendChild(headline);
  blogContainer.appendChild(image);
  blogContainer.appendChild(blogpost);
  blogContainer.appendChild(likeContainer);
  blogContainer.appendChild(commentList);
  blogContainer.appendChild(commentArea);
  blogContainer.appendChild(commentButton);
  blogContainer.appendChild(buttonContainer);

  userOutput.appendChild(blogContainer);
};

/* const likePost = async (post) => {
  console.log(post);
  const updatePost = {
    headline: post.headline,
    image: post.image,
    text: post.text,
    likes: post.likes + 1,
    comments: post.comments,
  };
  try {
    const res = await fetch(`${BASE_URL}/${post._id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(updatePost),
    });
    console.log(res)
    await fetchPost();
  } catch (error) {
    console.error("Något blev fel med gillningen", error);
  }
}; */
const likePost = async (post) => {
  console.log(post);
  const updatePost = {
    createdBy:{
      userID: post.createdBy.userID,
      user: post.createdBy.user
    },
    headline: post.headline,
    image: post.image,
    text: post.text,
    likes: post.likes,
    comments: post.comments,
  };
  updatePost.likes.push(getLoggedInUser().user)
  try {
    const res = await fetch(`${BASE_URL}/${post._id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(updatePost),
    });
    await addLikeToUser(post)
    await fetchPost();
  } catch (error) {
    console.error("Något blev fel med gillningen", error);
  }
};
const addLikeToUser= async(post)=>{
  let user;
  try{
  const response= await fetch(`${USERBASE_URL}/${getLoggedInUser().token}`)
  const data = await response.json();
  const like= {
    postID: post._id,
    title: post.headline
  }
  user=data;
  user.likedPost.push(like)

  }
  catch(error){
    console.error("Något blev fel att hæmta anvændaren")
  }

  try{
    const updatedInformation={
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      username: user.username,
      password: user.password,
      myPosts: user.myPosts,
      likedPost:user.likedPost,
      comments:user.comments
    };
  
  const res = await fetch(`${USERBASE_URL}/${getLoggedInUser().token}`,{
    method: "PUT",
    headers: {"Content-type":"application/json"},
    body: JSON.stringify(updatedInformation)
  })
  }
  catch(error){
    console.error("Något blev fel med att lægga till liken", error)
  }
}
const checkIfLiked= async(post)=>{
  try{
    const res =await fetch(`${USERBASE_URL}/${getLoggedInUser().token}`)
    const data = await res.json();
    for (const user of data) {
      if (user.likedPost.postID === post._id) {
        return true;
      }
    }
   return false;
  }
  catch(error){
    console.error("Något blev fel med kontrolleringen om inlegget var gillat eller ej")
  }
}
const removeLike= async(post)=>{
  
}

const commentPost = async (comment, post) => {
  let userInput = comment.value;
  if (!userInput) {
    console.log("Du måste skriva något");
  }
  const updatePost = {
    headline: post.headline,
    image: post.image,
    text: post.text,
    likes: post.likes,
    comments: post.comments,
  };
  updatePost.comments.push(userInput);
  try {
    const res = await fetch(`${BASE_URL}/${post._id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(updatePost),
    });
    await fetchPost();
  } catch (error) {
    console.error("Något blev fel med att uppdatera kommentaren");
  }
};

const deletePost = async (post) => {
  console.log(post);
  try {
    const res = await fetch(`${BASE_URL}/${post._id}`, {
      method: "DELETE",
    });
    console.log(res.ok);
    await fetchPost();
  } catch (error) {
    console.error("FAILED to delete post", error);
  }
};
const editPost = async (post) => {
  const title = prompt("Redigera headline", post.headline);
  const imageUrl = prompt("Byt url till bild");
  const newText = prompt("Redigera texten", post.text);

  if (!newText && !imageUrl && !title) {
    alert("du måste skriva något/ändra texten");
  } else {
    const updatePost = {
      headline: title,
      image: imageUrl,
      text: newText,
      likes: post.likes,
      comments: post.comments,
    };
    try {
      const res = await fetch(`${BASE_URL}/${post._id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(updatePost),
      });
      await fetchPost();
    } catch (error) {
      console.error("något blev fel med redigeringen av texten", error);
    }
  }
};
const signInForm = document.querySelector("#signInForm");
/* fetchPost(); */
