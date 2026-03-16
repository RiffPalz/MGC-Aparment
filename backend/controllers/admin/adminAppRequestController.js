import {
    getAllApplicationRequests,
    deleteApplicationRequest,
    getApplicationRequestStats
} from "../../services/admin/adminAppRequestService.js";


/* GET ALL APPLICATION REQUESTS */
export const getAllApplicationRequestsController = async (req, res) => {
    try {

        const applications = await getAllApplicationRequests();

        return res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to fetch application requests"
        });

    }
};



/* DELETE APPLICATION REQUEST */
export const deleteApplicationRequestController = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await deleteApplicationRequest(id);

        return res.status(200).json({
            success: true,
            message: result.message
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
};



/* GET APPLICATION REQUEST STATS */
export const getApplicationRequestStatsController = async (req, res) => {
    try {

        const stats = await getApplicationRequestStats();

        return res.status(200).json({
            success: true,
            stats
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to fetch application statistics"
        });

    }
};