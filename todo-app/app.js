const express=require("express");
const app=express();
const { Todo, User } = require("./models")
const Sequelize = require("sequelize");
const bodyParser = require("body-parser");
const path=require("path");
var csrf = require("tiny-csrf");
var cookieParser = require('cookie-parser');
const { request } = require("http");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const localStrategy = require("passport-local");
const user = require("./models/user");

app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());

app.use(express.urlencoded({extended:true}));
app.use(cookieParser("secret"));
// eslint-disable-next-line no-undef
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));

const flash = require("connect-flash");
app.use(session({
    secret:"secret",
    cookie:{
        maxAge: 24*60*60*1000
    }
}))
app.use(flash());

app.use(function(request, response, next) {
    response.locals.messages = request.flash();
    next();
});

// eslint-disable-next-line no-unused-vars
const { Op } = Sequelize;



app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy({
    usernameField: "email",
    passwordField: "password"
}, (username,password,done)=>{
    User.findOne({where:{email:username}})
    .then(async(user) =>{
        const result = await bcrypt.compare(password,user.password)
        if(result){
            return done(null,user);
        }
        else{
            return done(null,false,{message:"Invalid username or password"});
        }
        
    }).catch((error)=>{
        return done(error);
    })
}
));

passport.serializeUser((user,done)=>{
    console.log("Serializing user in session",user);
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    User.findByPk(id).then((user)=>{
        done(null,user);
    }).catch((error)=>{
        done(error,null);
    })
}
);


app.set("view engine","ejs");
app.get("/",async (request,response)=>{
        console.log("Generated CSRF Token:", request.csrfToken());
        response.render("index",{title:"Todo Application",csrfToken: request.csrfToken(),
        });
    });





app.get("/todos", connectEnsureLogin.ensureLoggedIn(), async(request,response)=>{
    const loggedInUser=request.user.id;
    const overdue= await Todo.overdueTodos(loggedInUser);
    const dueToday= await Todo.dueTodayTodos(loggedInUser);
    const dueLater= await Todo.dueLaterTodos(loggedInUser);
    const completedTodo = await Todo.completedTodos(loggedInUser);

    if(request.accepts("html")){
        console.log("Generated CSRF Token:", request.csrfToken());
        response.render("todo",{title:"Todo Application",overdue,dueToday,dueLater,completedTodo,csrfToken: request.csrfToken()});
    }
    else {
        response.json({overdue,dueToday,dueLater,completedTodo});
    }
})

app.get("/todos/:id", connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
    try {
      const todo = await Todo.findByPk(request.params.id);
      return response.json(todo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  });


app.post("/todos", connectEnsureLogin.ensureLoggedIn(),async (request,response)=>{
    console.log("Received CSRF Token:", request.body._csrf);
    console.log("Expected CSRF Token:", request.csrfToken());
    try{
        await Todo.addTodo({title: request.body.title,dueDate: request.body.dueDate,completed: false,userId:request.user.id})
        return response.redirect("/todos");
    }
    catch(error){
        if (error.name==="SequelizeValidationError"){
            error.errors.forEach((err) => request.flash("error", err.message));
        } else {
            request.flash("error", "Something went wrong");
        }
        response.redirect("/todos");
        
    }
    

})

app.put("/todos/:id", connectEnsureLogin.ensureLoggedIn(),async (request,response)=>{
    console.log("todo updated",request.params.id);
    const todo=await Todo.findByPk(request.params.id)
    try{
        
        const updatedTodo = await todo.setCompletionStatus(request.body.completed,request.user.id);
        return response.json(updatedTodo);
    }
    catch(error){
        console.log(error);
        return response.status(422).json(error);
    }
})

app.delete("/todos/:id",connectEnsureLogin.ensureLoggedIn(), async (request,response)=>{
    console.log("todo deleted",request.params.id,);
    try{
        await Todo.remove(request.params.id,request.user.id);
        return response.json({success:true})

    } 
    catch(error){
        console.log(error);
        return response.status(422).json(error);
    }
})


app.get("/signup",(request,response) => {
    response.render("signup", { title:"Sign-up",csrfToken: request.csrfToken()});
})


app.post("/users",async (request,response) => {
    const hashedPassword = await bcrypt.hash(request.body.password, saltRounds);
    console.log("hashed password",hashedPassword);
    try {
        const user=await User.create({
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            password: hashedPassword
        });
        request.login(user, (err) => {
            if (err) {
                console.log(err);
            }
            return response.redirect("/todos");
        });
    }
    catch(error){
        if (error.name === "SequelizeValidationError") {
            error.errors.forEach((err) => request.flash("error", err.message));
        } else {
            request.flash("error", "Something went wrong");
        }
        response.redirect("/signup");
    }    
})

app.get("/login", (request,response) => {
    response.render("login",{title:"Login",csrfToken: request.csrfToken()});
})

app.post("/session",passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
    }), 
    async (request,response) => {
    console.log("User in session",request.user);
    response.redirect("/todos");

    
})

app.get("/logout",(request,response,next)=>{
    request.logout((error) => {
        if (error) {return next(error);}
        response.redirect("/");
    })
})

module.exports=app;