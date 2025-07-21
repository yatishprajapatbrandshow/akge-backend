const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  componentType: { type: String, required: true },
  componentName: { type: String, required: true },  // <-- Unique
  category: { type: String, required: true },
  status: { type: String, default: 'active' },
  addedon: { type: Date, default: Date.now },
  addedby: { type: String },
  editedon: { type: Date },
  editedby: { type: String },
  deleteflag: { type: Boolean, default: false }
});

module.exports = mongoose.model('Component', componentSchema);
