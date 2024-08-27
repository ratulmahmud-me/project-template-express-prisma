export const login = async (req, res) => {
    try {
        return res.status(200).json({ message: "Hello from login!" });
    } catch (error) {
        return next(error, req, res);
    }
}