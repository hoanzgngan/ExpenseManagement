const transactionRepo = require("../repos/transactionRepo");

exports.getAll = async (userId) => {
    return await transactionRepo.getAllByUser(userId);
};

exports.create = async({userId, categoryId, amount, date, note}) => {
    if (!categoryId || !amount || !date) {
        throw new Error ("Thiếu dữ liệu transaction")
    }
    return await transactionRepo.create({
        userId,
        categoryId,
        amount,
        date,
        note,
    })    
};

exports.delete = async (id) => {
    return await transactionRepo.delete(id);
}; 
 
exports.update = async (id, { categoryId, amount, date, note }) => {
    if (!categoryId || !amount || !date) {
        throw new Error("Thiếu dữ liệu cập nhật");
    }
    return await transactionRepo.update(id, { categoryId, amount, date, note });
};