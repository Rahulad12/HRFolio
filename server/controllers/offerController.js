import Offer from "../model/Offer.js";

const createOffer = async (req, res) => {
    const { candidate, email, position, salary, startDate, responseDeadline, status } = req.body

    try {
        const existingOffer = await Offer.findOne({ candidate })
        if (existingOffer) {
            return res.status(400).json({ success: false, message: "Offer already exists for this candidate" })
        }

        const offers = await Offer.create({ candidate, email, position, salary, startDate, responseDeadline, status })
        if (!offers) {
            return res.status(400).json({ success: false, message: "Offer not created" })
        }
        return res.status(200).json({ success: true, message: "Offer created successfully", data: offers })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

const getOffer = async (req, res) => {
    try {
        const offer = await Offer.find().select(' -__v').populate({
            path: "candidate",
            select: " -__v"
        })
        if (offer.length === 0) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }
        return res.status(200).json({ success: true, message: "Offer fetched successfully", data: offer });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getOfferById = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id).select(' -__v');
        if (!offer) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }
        return res.status(200).json({ success: true, message: "Offer fetched successfully", data: offer });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

const getOfferByCandidates = async (req, res) => {
    try {
        const offer = await Offer.find({ candidate: req.params.id }).select(' -__v');
        if (offer.length === 0) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }
        return res.status(200).json({ success: true, message: "Offer fetched successfully", data: offer });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateOffer = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!offer) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }
        return res.status(200).json({ success: true, message: "Offer updated successfully", data: offer });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export { createOffer, getOffer, getOfferByCandidates, getOfferById, updateOffer }

