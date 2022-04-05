import { Request, Response } from "express";
import { Pages, Prisma, PrismaClient } from '@prisma/client'
import PrismaDB from "../../../prisma";

function isNumeric(str: any) {
	if (typeof str != "string") return false // we only process strings!  
	// @ts-ignore
	return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
		   !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
  

class SubmissionController extends PrismaDB {
	get = async (req: Request, res: Response) => {
		const data = {} as any
		Object.keys(req.query).map(value => {if(isNumeric(req.query[value]) && value !== 'cursor') data[value] = Number(req.query[value])})
		
		var page_ids = []
		var submissions: any[] = []

		try {
			page_ids = await this.prisma.pages.findMany({
				take: 20,
				skip: 1,
				cursor: {
					id: Number(req.query.cursor)
				},
				select: {
					submissions: {
						include: {
							page: {
								select: {
									slug: true,
									id: true,
									title: true
								}
							},
							products: {
								select: {
									name: true,
									discounted_price: true
								}
							}
						}
					}
				},
				where: {
					userId: res.locals.user.id
				}
			})

			if(!page_ids) throw "Go Down Bitches"
			
			submissions = page_ids.map(value => value.submissions).flat()
		} catch (e) {
			console.log(e, "dsa")
			page_ids = await this.prisma.pages.findMany({
				take: 20,
				select: {
					submissions: {
						include: {
							page: {
								select: {
									slug: true,
									id: true,
									title: true
								}
							},
							products: {
								select: {
									name: true,
									discounted_price: true
								}
							}
						}
					}
				},
				where: {
					userId: res.locals.user.id
				}
			})
			
			if(!page_ids) {
				res.status(400).send({
					error: "Submissions not found",
					status: 400
				})
				return
			}
			console.log(page_ids, "page_ids")
			try {
				submissions = page_ids.map(value => value.submissions).flat()
			} catch (e) {
				console.log(e, "Dasdsadsasad")
				res.status(400).send({
					error: e,
					status: 400
				})
				return
			}
		}

		const return_data = {
			cursor: 0,
			data: [submissions]
		}

		res.status(200).send(return_data)
	}

	getTotalEarned = async (req: Request, res: Response) => {
		const total_earned = await this.prisma.submission.aggregate({
			_sum: {
				total_prices: true
			},
			where: {
				page: {
					userId: res.locals.user.id
				}
			}
		})

		if(!total_earned) {
			res.status(400).send({
				error: "Can't calculate",
				status: 400
			})
			return
		}

		res.status(200).send(total_earned)
	}

	post = async (req: Request, res: Response) => {
		let submissionData = req.body

		var submission
		try {
			submission = await this.prisma.submission.create({
				data: {
					...submissionData
				}
			})
		} catch (e) {
			console.log(e)
			res.status(400).send({
				error: e,
				status: 400
			})
			return
		}

		res.status(201).send(submission)
	}

	batch = async (req: Request, res: Response) => {
		const pageData: Prisma.Enumerable<Prisma.SubmissionCreateManyInput> = req.body

		var submissions

		try {
			submissions = await this.prisma.submission.createMany({
				data: pageData
			})
		} catch (e) {
			res.status(400).send({
				error: e,
				status: 400
			})
			return
		}

		res.status(201).send(submissions)
	}

	update = async (req: Request, res: Response) => {
		const { id, ...submissionData } = req.body

		var submission
		try {
			submission = await this.prisma.submission.update({
				where: {
					id: id
				},
				data: submissionData
			})
		} catch (e) {
			res.status(400).send({
				error: e,
				status: 400
			})
			return
		}

		res.status(200).send(submission)
	}

	delete = async (req: Request, res: Response) => {
		const { id } = req.query
		var submission

		try {
			submission = await this.prisma.submission.delete({
				where: {
					id: Number(id)
				}
			})
		} catch (e) {
			res.status(400).send({
				error: e,
				status: 400
			})
			return
		}

		res.status(204).send(submission)
	}
}

export default SubmissionController