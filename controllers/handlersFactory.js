const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
// send model and return async function
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }

    //In modern Mongoose, deleteOne() replaces remove().
    await document.deleteOne();
    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404),
      );
    }
    // trigger the save event when update document :o
    await document.save();
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);

    res.status(201).json({ data: document });
  });

exports.getOne = (Model, populateOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    //build query
    let query = Model.findById(id);
    if (populateOpt) {
      query = query.populate(populateOpt);
    }
    //execute query
    const document = await query;
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const docsCount = await Model.countDocuments();
    let apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(docsCount)
      .filter()
      .search(Model.modelName)
      .limitFields()
      .sort();

    const docs = await apiFeatures.mongooseQuery;
    res.status(200).json({
      results: docs.length,
      page: apiFeatures.paginationResult,
      data: docs,
    });
  });
