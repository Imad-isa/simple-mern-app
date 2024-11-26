const { create,
    getAllEmployees,
    getEmployeeById,
    deleteEmployeeById,
    updateEmployeeById
} = require('../Controllers/Employee.js');

const { cloudinaryFileUploader } = require('../Middlewares/FileUplaoder.js');

const router = require('express').Router();

router.get('/', getAllEmployees)
router.get('/:id', getEmployeeById)
router.delete('/:id', deleteEmployeeById)
router.put('/:id', cloudinaryFileUploader.single('profileImage'), updateEmployeeById)
router.post('/', cloudinaryFileUploader.single('profileImage'), create);

module.exports = router;
