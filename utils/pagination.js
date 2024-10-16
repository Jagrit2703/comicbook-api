exports.getPaginationParams = (req) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const startKey = req.query.start_key || null;

    return {
        limit,
        startKey
    };
};
