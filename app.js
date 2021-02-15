//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false});
//mongoose.connect("mongodb+srv://admin-ankita:*21*Annie*@cluster0.z2c8p.mongodb.net/blogDB", {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false});

const postSchema = new mongoose.Schema(
	{
		title: String,
		/*img: 
	     { 
	        data: Buffer, 
	        contentType: String 
	     },*/
		content: String
	});
const Post = mongoose.model("post", postSchema);

let posts = [];
  
app.get("/",function(req,res)
	{
		Post.find({}, function(err, posts)
		 {
		 	res.render("home", {posts: posts});
		 });
	});

app.get("/about",function(req,res)
	{
		res.render("about");
	});

app.get("/contact",function(req,res)
	{
		res.render("contact");
	});

app.get("/compose",function(req,res)
	{
		res.render("compose");
	});

app.get("/posts/:postId",function(req,res)
    {
    	const requestedPostId = req.params.postId;
    	Post.findById(requestedPostId, function(err,post)
    	 {
    	 	res.render("post",{id: requestedPostId, title: post.title, content: post.content});
    	 }); 	
    });

app.post("/compose",function(req,res)
	{
		Post.findOne({title: _.capitalize(req.body.postTitle)}, function(err,posts)
		 {
			if(!err)
			 {
		 		if(!posts)
		 		 {
		 		 	const newPost =new Post(
				 	 {
				 	 	title: _.capitalize(req.body.postTitle),
				 	 	content: req.body.postContent
				 	 });
					newPost.save();
					res.redirect("/");
		 		 }
		 		else
		 			res.redirect("/compose");
		 	 }
		 });
	 });
		
app.post("/delete",function(req,res)
	{
		const requestedPostId = req.body.remove;
		Post.findByIdAndDelete(requestedPostId, function(err)
		 {
		 	if(!err)
		 		console.log("Removed Post");
		 });
		res.redirect("/");
	});

let port = process.env.PORT;
if (port == null || port == "")
 {
	port = 3000;
 }

app.listen(port, function()
	{
		console.log("Server has started successfully.");
	});