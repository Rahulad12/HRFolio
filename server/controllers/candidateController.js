import Candidate from "../model/Candidate.js";
import Reference from "../model/Reference.js";

const createCandidate = async (req, res) => {
    const {
        name, email, phone,
        technology, level, experience,
        expectedsalary, references
    } = req.body;
    try {
        const existingCandidate = await Candidate.findOne({ email });
        if (existingCandidate) {
            return res.status(400).json({
                success: false,
                message: "Candidate with this email already exists"
            });
        }

        // Step 1: Create candidate without reference
        const newCandidate = new Candidate({
            name, email, phone,
            technology, level, experience,
            expectedsalary
        })

        const savedCandidate = await newCandidate.save();

        // Step 2: Create references and associate with candidate
        if (references) {
            const referenceDocs = await Promise.all(references.map(async (ref) => {
                const newRef = await Reference.create({
                    ...ref,
                    candidate: savedCandidate._id,
                });
                return newRef._id;
            }));

            // Step 3: Update candidate to reference the new reference
            savedCandidate.references = referenceDocs;
            await savedCandidate.save();
        }

        // Step 4: Respond
        return res.status(201).json({
            success: true,
            message: "Candidate created successfully",
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getCandidateById = async (req, res) => {
    const { id } = req.params;
    try {
        const candidate = await Candidate.findById(id).select(" -updatedAt -__v").populate({
            path: "references",
            select: "-createdAt -updatedAt -__v -candidate"
        });
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" });
        }

        res.status(200).json({
            success: true,
            message: "Candidate fetched successfully",
            data: candidate
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
// const getAllCandidates = async (req, res) => {
//     try {
//         const candidates = await Candidate.find().select("-createdAt -updatedAt -__v").populate({
//             path: "references",
//             select: "-createdAt -updatedAt -__v -candidate"
//         })
//         if (candidates.length === 0) {
//             return res.status(404).json({ success: false, message: "No candidates found" });
//         }
//         res.status(200).json({
//             success: true,
//             message: "Candidates fetched successfully",
//             data: candidates
//         });

//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// }
const getAllCandidates = async (req, res) => {
    const { searchText, status } = req.query;
    console.log("searchText", searchText);
    console.log("status", status);
    try {
        // If no filter is passed, you can return an error or return all
        const query = {};

        if (searchText) {
            query.$or = [
                { name: { $regex: searchText, $options: "i" } },
                { technology: { $regex: searchText, $options: "i" } },
                { level: { $regex: searchText, $options: "i" } },
            ];
        }

        if (status) {
            query.status = { $regex: status, $options: "i" };
        }

        const candidates = await Candidate.find(query).select(
            "-updatedAt -__v -references"
        );

        if (!candidates.length) {
            return res
                .status(404)
                .json({ success: false, message: "No candidates found" });
        }

        return res.status(200).json({
            success: true,
            message: "Candidates fetched successfully",
            data: candidates,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};

const deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" });
        }
        return res.status(200).json({ success: true, message: "Candidate deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const updateCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!candidate) {
            return res.status(404).json({ success: false, message: "Candidate not found" });
        }
        return res.status(200).json({ success: true, message: "Candidate updated successfully", data: candidate });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const filterCandidate = async (req, res) => {
    const { name, technology, level, status } = req.query;

    try {
        // If no filter is passed, you can return an error or return all
        const query = {};

        if (name) {
            query.name = { $regex: name, $options: "i" };
        }
        if (technology) {
            query.technology = { $regex: technology, $options: "i" };
        }
        if (level) {
            query.level = { $regex: level, $options: "i" };
        }
        if (status) {
            query.status = { $regex: status, $options: "i" };
        }

        const candidates = await Candidate.find(query).select(
            "-createdAt -updatedAt -__v -references"
        );

        if (!candidates.length) {
            return res
                .status(404)
                .json({ success: false, message: "No candidates found" });
        }

        return res.status(200).json({
            success: true,
            message: "Candidates fetched successfully",
            data: candidates,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};


export { createCandidate, getCandidateById, getAllCandidates, deleteCandidate, filterCandidate, updateCandidate };