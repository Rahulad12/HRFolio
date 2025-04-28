import Candidate from "../model/Candidate.js"

export const SearchCandidates = async (req, res) => {
    const { searchText } = req.query;

    try {
        if (searchText === "") {
            return;
        }

        const query = {};
        query.$or = [
            { name: { $regex: searchText, $options: "i" } },
            { technology: { $regex: searchText, $options: "i" } },
            { level: { $regex: searchText, $options: "i" } },
        ]

        const candidates = await Candidate.find(query);
        if (!candidates.length) {
            return res
                .status(404)

                .json({ success: false, message: "No candidates found" });
        }
        return res.status(200).send(candidates)

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })

    }
}