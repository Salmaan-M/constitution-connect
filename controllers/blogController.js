const mongoose = require("mongoose");
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");

//GET ALL BLOGS
exports.getAllBlogsController = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).populate("user");
    if (!blogs) {
      return res.status(200).send({
        success: false,
        message: "No Blogs Found",
      });
    }
    return res.status(200).send({
      success: true,
      BlogCount: blogs.length,
      message: "All Blogs lists",
      blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error While Getting Blogs",
      error,
    });
  }
};

//Create Blog
exports.createBlogController = async (req, res) => {
  try {
    const { title, description, image, user } = req.body;
    //validation
    if (!title || !description || !image || !user) {
      return res.status(400).send({
        success: false,
        message: "Please Provide ALl Fields",
      });
    }
    const exisitingUser = await userModel.findById(user);
    //validaton
    if (!exisitingUser) {
      return res.status(404).send({
        success: false,
        message: "unable to find user",
      });
    }

    const newBlog = new blogModel({ title, description, image, user });
    const session = await mongoose.startSession();
    session.startTransaction();
    await newBlog.save({ session });
    exisitingUser.blogs.push(newBlog);
    await exisitingUser.save({ session });
    await session.commitTransaction();
    await newBlog.save();
    return res.status(201).send({
      success: true,
      message: "Blog Created!",
      newBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error WHile Creting blog",
      error,
    });
  }
};

//Update Blog
exports.updateBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;
    const blog = await blogModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Blog Updated!",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error WHile Updating Blog",
      error,
    });
  }
};

//SIngle Blog
exports.getBlogByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "blog not found with this is",
      });
    }
    return res.status(200).send({
      success: true,
      message: "fetch single blog",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "error while getting single blog",
      error,
    });
  }
};

//Delete Blog
exports.deleteBlogController = async (req, res) => {
    try {
      // Sanitize the input ID
      const blogId = req.params.id.trim();
  
      // Validate the ID format
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).send({
          success: false,
          message: "Invalid Blog ID",
        });
      }
  
      // Find and delete the blog
      const blog = await blogModel.findByIdAndDelete(blogId).populate("user");
      if (!blog) {
        return res.status(404).send({
          success: false,
          message: "Blog not found",
        });
      }
  
      // Remove the blog reference from the user
      await blog.user.blogs.pull(blog);
      await blog.user.save();
  
      return res.status(200).send({
        success: true,
        message: "Blog Deleted!",
      });
    } catch (error) {
      console.error("Error in deleteBlogController:", error);
      return res.status(500).send({
        success: false,
        message: "Error While Deleting Blog",
        error,
      });
    }
  };

//GET USER BLOG
exports.userBlogController = async (req, res) => {
    try {
      // Sanitize the input ID
      const userId = req.params.id.trim();
  
      // Validate the ID format
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send({
          success: false,
          message: "Invalid User ID",
        });
      }
  
      // Find user and populate blogs
      const userBlog = await userModel.findById(userId).populate("blogs");
  
      if (!userBlog) {
        return res.status(404).send({
          success: false,
          message: "Blogs not found with this ID",
        });
      }
  
      return res.status(200).send({
        success: true,
        message: "User blogs fetched successfully",
        userBlog,
      });
    } catch (error) {
      console.error("Error in userBlogController:", error);
      return res.status(500).send({
        success: false,
        message: "Error in fetching user blogs",
        error,
      });
    }
  };
  