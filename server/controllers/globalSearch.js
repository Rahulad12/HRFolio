import Candidate from "../model/Candidate.js";

export const SearchCandidates = async (req, res) => {
    try {
        const searchText = req.query.searchText || "";

        if (!searchText.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search text is required",
            });
        }

        const query = {
            $or: [
                { name: { $regex: searchText, $options: "i" } },
                { technology: { $regex: searchText, $options: "i" } },
                { level: { $regex: searchText, $options: "i" } },
            ],
        };

        const candidates = await Candidate.find(query);

        if (!candidates.length) {
            return res.status(404).json({
                success: false,
                message: "No candidates found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Candidates fetched successfully",
            data: candidates,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
