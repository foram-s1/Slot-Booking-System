const mongoose = require('mongoose')

var EventSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	startTime: {
		type: String,
		required: true
	},
	endTime: {
		type: String,
		required: true
	},
	startDate: {
		type: String,
		required: true
	},
	endDate: {
		type: String,
		required: true
	},
	classRoom: {
		type: String,
		required: true
	},
	description: String,
	adminNote: { type: String, default: "" },
	user_id: String,
	status: {
		type: String,
		default: "Pending"
	}
})

const Event = module.exports = mongoose.model('event', EventSchema)
