const categoryRepo = require("../repos/categoryRepo");

exports.getAll = async (userId) => {
    return await categoryRepo.getAllByUser(userId);
};

exports.create = async ({name, type, icon, userId}) => {
    if (!name || !type){
        throw new Error("Thiếu name hoặc type");
    }

    return await categoryRepo.create({name, type, icon, userId});
};

exports.delete = async (id) => {
    return await categoryRepo.delete(id);
};


//DONE