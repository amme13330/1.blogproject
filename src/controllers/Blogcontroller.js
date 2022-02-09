const BlogModel = require('../models/BlogModels')
const AuthorModel = require('../models/AuthorModel')

//-------This function is for Blog creation and entry-------//
const myBlogCreation = async function (req, res) {
    try {
        let data = req.body;
        let authorId = req.body.authorId;//     Assigned the auther id in variable to check it is valid or not
        let validId = await AuthorModel.findById(authorId);
        if (!validId) {
            return res.status(400).send({ msg: "The given id is INVALID" });
        }
        else {
            data.publishedAt = Date();
            let savedData = await BlogModel.create(data)
            return res.status(201).send({ data: savedData });
        }
    }
    catch (err) {
        return res.status(500).send({ msg: err.message });
    }
}

//----This function shows the blog which are not deleted and are published as per the user filter----
const returnBlogsFiltered = async function (req, res) {
    try {
        let foundBlogs = await BlogModel.find({ isDeleted: false, isPublished: true });
        if (foundBlogs.length) {
            return res.status(200).send({ status: true, data: foundBlogs });
        }
        else {
            return res.status(404).send({ status: false, msg: "No Blog is found" });
        }
    }
    catch (err) {
        return res.status(500).send({ msg: err.message });
    }
}

//-------------This function is for updating the blog as per the user inputs-----------
const updateData = async function (req, res) {
    try {

        let blogId = req.params.id;
        let data = await BlogModel.findOne({ _id: blogId });
        if (!data) {
            return res.status(404).send({ status: false, msg: "Provide valid BlogId" });
        }
        if (data.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "This Blog is no longer exists" });
        }

        if (req.validate._id != data.authorId) {
            return res.send({ status: "false", msg: "User not Authorized" });
        }
        let update = req.body;

        if (update) {
            if (update.title) {
                data.title = update.title;
            }
            if (update.publishedAt) {
                data.publishedAt = update.publishedAt;
                data.isPublished = true
            }
            if (update.subcategory) {
                data.subcategory.push(update.subcategory);
            }
            if (update.Body) {
                data.Body = update.Body;
            }
            if (update.tags) {
                data.tags.push(update.tags);
            }
            data.save();
        }
        else {
            return res.status(400).send({ msg: "Please provide data to update" });
        }
        return res.status(200).send({ msg: "Succesful", data: data });
    }
    catch (err) {
        return res.status(400).send({ msg: err.message });
    }
}

//-------This function authorises the user and flags the blog document as deleted--------------
const deleteBlog = async function (req, res) {
    try {

        let id = req.params.id
        let data = await BlogModel.findOne({ _id: id });
        if (!data) {
            return res.status(404).send({ status: false, msg: "Blog id doesnot exits" });
        }
        if (req.validate._id != data.authorId) {
            return res.status(401).send({ status: false, msg: "User not Authorized to delete Blog" });
        }
        if (data.isDeleted == true) {
            return res.send({ msg: "This book is allready deleted" });
        }
        data.isDeleted = true;
        data.deletedAt = Date();
        data.save();
        res.status(200).send({ msg: "succesful", data });

    }
    catch (err) {
        res.status(500).send({ msg: "Some error occured" });
    }
}

//------------This function is for find the specific field in our blog then delete that Particular Blog----------
const deleteSpecific = async function (req, res) {
    try {
        let obj = { isPublished: true };

        if (req.query.category) {
            obj.category = req.query.category
        }
        if (req.query.authorId) {
            obj.authorId = req.query.authorId;
        }
        if (req.query.tag) {
            obj.tag = req.query.tag
        }
        if (req.query.subcategory) {
            obj.subcategory = req.query.subcategory
        }
        let data = await BlogModel.findOne(obj);
        if (!data) {
            return res.status(404).send({ status: false, msg: "The given data is Invalid" });
        }
        if (req.validate._id != data.authorId) {
            return res.status(401).send({ status: false, msg: "User not Authorized to delete Blog" });
        }
        if (data.isDeleted == true) {
            return res.send({ msg: "This book is allready deleted" });
        }
        data.isDeleted = true;
        data.deletedAt = Date();
        data.save();
        res.status(200).send({ msg: "succesful", data: data });
    }
    catch (err) {
        res.status(500).send({ msg: err });
    }
}
module.exports.myBlogCreation = myBlogCreation
module.exports.returnBlogsFiltered = returnBlogsFiltered
module.exports.updateData = updateData;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteSpecific = deleteSpecific;
