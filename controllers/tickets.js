const { Ticket, TicketConvo } = require('../models/tickets');

exports.getAllTickets = (req, res) => {
    Ticket.find().then(result => {
        if (result.length >= 1) {
            return res.status(200).json({ success: true, data: result });
        } else {
            return res.status(404).json({ success: false, message: "No tickets" });
        }
    }).catch(err => {
        return res.status(500).json({ success: false, message: "Error getting tickets", error: err });
    });
};

exports.getOneTickets = (req, res) => {
    Ticket.findOne({ _id: req.params.id }).then(ticket => {
        if (ticket) {
            TicketConvo.find({ ticketId: req.params.id }).exec().then(convo => {
                return res.status(200).json({
                    success: true,
                    data: {
                        status: ticket.status,
                        customer: ticket.customer,
                        status: ticket.status,
                        date_created: ticket.date_created,
                        convo: convo,
                    }
                });
            }).catch(err => {
                return res.status(500).json({ success: false, message: "Error getting tickets", error: err });
            })
        } else {
            return res.status(404).json({ success: false, message: "No tickets" });
        }
    }).catch(err => {
        return res.status(500).json({ success: false, message: "Error getting tickets", error: err });
    });
};

exports.createTicket = (req, res) => {
    const createObj = {};
    for (const [objKey, value] of Object.entries(req.body)) {
        createObj[objKey] = value;
    }
    const ticket = new Ticket({
        customer: req.body.customer,
    });
    ticket.save().then(result => {
        res.status(201).json({ success: true, data: result })
    }).catch(err => {
        res.status(500).json({ success: 'false', message: "Error createing a ticket", error: err })
    })
};

exports.updateTicket = (req, res) => {
    const updateOps = {};
    for (const [objKey, value] of Object.entries(req.body)) {
        updateOps[objKey] = value;
    }
    Ticket.updateOne({ _id: req.params.id }, { $set: updateOps }, { new: true })
        .exec()
        .then((doc) => {
            res.status(200).json({ success: true, data: doc });
        })
        .catch((err) => {
            res.status(500).json({ success: false, message: "error updating the ticket", error: err });
        });
};

exports.sendMessage = (req, res) => {
    let authorType = ""
    Ticket.findById(req.body.ticketId).exec().then(result => {
        if (result) {
            console.log(result)
            console.log(req.body.author)
            if (result.customer == req.body.author) {
                const ticketConvo = new TicketConvo({
                    ticketId: req.body.ticketId,
                    message: req.body.message,
                    author: req.body.author,
                    authorType: 'customer',
                });
                ticketConvo.save().then(result => {
                    res.status(201).json({ success: true, data: result })
                }).catch(err => {
                    res.status(500).json({ success: false, message: err })
                })
            } else {
                const ticketConvo = new TicketConvo({
                    ticketId: req.body.ticketId,
                    message: req.body.message,
                    author: req.body.author,
                    authorType: 'responder',
                });
                ticketConvo.save().then(result => {
                    res.status(201).json({ success: true, data: result })
                }).catch(err => {
                    res.status(500).json({ success: false, message: err })
                })
            }
        } else {
            res.status(500).json({ success: false, message: "Message send failed" })
        }
    }).catch(err => {
        res.status(500).json({ success: false, message: "Message send failed" })
    });

};

exports.deleteTicket = (req, res) => {
    Ticket.deleteOne({ _id: req.params.id })
        .exec()
        .then(ticket => {
            if (ticket) {
                res.status(202).json({ success: true, message: 'Ticket deleted successfuly ' })
            } else {
                res.status(404).json({ success: false, message: 'Ticket id incorect' })
            }
        })
        .catch(err => {
            res.status(500).json({ success: true, message: 'Error deleting ticket', error: err })
        });
};