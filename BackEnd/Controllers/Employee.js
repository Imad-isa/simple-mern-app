const EmployeeModel = require("../Models/EmployeeModel.js");

const create = async (req,res) => {
   try {
    const body = req.body;
    const profileImag = req?.file ? req?.file?.path : null;
    body.profileImag = profileImag;

    const employee = new EmployeeModel(body);

    await employee.save();

    res.status(201).json({  messag: 'Employee Creatd', success: true});
    
    } catch (error) {
        console.log('Error', error);
        res.status(500).json({
            messag: 'Internal Server Error',
            success: false,
            error: error
        });
    }
}

const getAllEmployees = async (req,res) => {
    try {

          // Getting page and limit from query parameters
          let { page, limit, search } = req.query;

            // Set default values if they are not provide
            page = parseInt(page) || 1;
            limit = parseInt(limit) || 10;

              // Calculate the number of documents to skip
             const skip = (page - 1) * limit;

               // Build the search criteri
             let  searchCriteria = {};

             if(search) 
             {
                searchCriteria = {
                    name: {
                        $regex: search,
                        $options: 'i' // / case insensitive

                    }
                }
             }
               // Get the total number of employees for pagination info
               const totalEmployees = await EmployeeModel.countDocuments(searchCriteria);

                 // Fetch the employees with pagination
                 const emps = await EmployeeModel.find(searchCriteria)
                              .skip(skip)
                              .limit(limit)
                              .sort({ updatedAt: -1});

                               // Calculate total pages
        const totalPages = Math.ceil(totalEmployees / limit);

        res.status(200)
        .json({
            messag: 'success',
            success:true,
            data: {
                employees: emps,
                pagination: {
                    totalEmployees,
                    currentPage: page,
                    totalPages,
                    pageSize: limit
                }
            }
        });
} catch (error) {
    console.log(error);
    res.status(500).json({
        message: 'Internal Server Error',
        success: false,
        error: error
    });
}};

const getEmployeeById = async (req,res) => {
    try {
        const id = req.params.id;
        const employee = await EmployeeModel.findOne({ _id: id });

        res.status(200) 
        .json({
            message: 'Employee Details',
            success: true,
            data: employee
        });
    }  catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: err
        });
    }
}

const deleteEmployeeById = async (req,res) => {
    try {
        const id = req.params.id;
        await EmployeeModel.deleteOne({_id:id});

        res.status(200)
        .json({
            messag: 'Employee Deleted Successfully',
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: error
        })
    }
}

const updateEmployeeById = async (req,res) => {
    try {
         const {id} = req.params;
         const {name,email,phone,department,salary} = req.body;
         let updateData = {
            name,email,phone,department,salary,updatedAt: new Date()
         };

         if(req.file)
         {
            updateData.profileImag = req.file.path;
         }
         const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if(!updatedEmployee)
        {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200)
        .json({
            message: 'Employee Updated Successfully',
            success: true,
            data: updatedEmployee
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    create,
    getAllEmployees,
    getEmployeeById,
    deleteEmployeeById,
    updateEmployeeById
}