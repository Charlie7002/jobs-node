const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const getAllJobs = async (req, res) => {
	const jobs = await Job.find({ createdBy: req.user.userID }).sort('createdAt')
	res.status(StatusCodes.OK).json({ jobs })
}

const getJob = async (req, res) => {
	const {
		user: { userID },
		params: { id: jobID },
	} = req
	const job = await Job.find({ _id: jobID, createdBy: userID })
	if (!job) {
		throw new BadRequestError('No job found with given ID')
	}
	res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
	const job = await Job.create({ ...req.body, createdBy: req.user.userID })
	res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
	const {
		user: { userID },
		params: { id: jobID },
		body: { position, company },
	} = req

	if (company === '' || position === '') {
		throw new BadRequestError('Company or postion can not be empty')
	}

	const job = await Job.findByIdAndUpdate({ _id: jobID, createdBy: userID }, req.body, { new: true, runValidators: true })
	if (!job) {
		throw new BadRequestError('No job found with given ID')
	}
	res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
	const {
		user: { userID },
		params: { id: jobID },
	} = req
	await Job.findByIdAndRemove({ _id: jobID, createdBy: userID })
	res.json({ msg: `delete job ${jobID}` })
}

module.exports = {
	getJob,
	getAllJobs,
	createJob,
	updateJob,
	deleteJob,
}
