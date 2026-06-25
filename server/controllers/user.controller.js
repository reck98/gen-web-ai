export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.json({
                user: null,
            });
        }

        return res.json({
            user: req.user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: `Get Current User Error : ${error}`,
        });
    }
};
