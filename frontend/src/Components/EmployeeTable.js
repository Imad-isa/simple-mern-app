import React from 'react'
import { Link } from 'react-router-dom'
import { DeleteEmployeeById } from '../Api/api';
import { notify } from '../utility/utils';


function EmployeeTable({
    employees, pagination,fetchEmployees, handleUpdateEmployee
}) {
    const headers = ['Name', 'Email', 'Phone', 'Department', 'Actions'];
    const { currentPage, totalPages } = pagination;

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            handlePagination(currentPage + 1);
        }
    };

    const handlePagination = (currentPage) => {
        fetchEmployees('', currentPage, 5)
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            handlePagination(currentPage - 1);
        }
    };

    const handleDeleteEmployee = async (id) => {
        try {
            const { success, message } = await DeleteEmployeeById(id);

            if(success)
            {
                notify(message, 'success')
            } else {
                notify(message, 'error')
            }
            fetchEmployees();

        } catch (error) {
            console.error(error);
            notify('Failed to delete Employee', 'error');
        }
    }

    const TableRow = ({ employee }) => {
    }
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <>
            <table className='table table-striped'>
                <thead>
                    <tr>
                        {
                            headers.map((header, i) => (
                                <th key={i}>{header}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        employees.length === 0 ? <TableRow>Data Not Found</TableRow> 
                            : employees.map((emp) => (
                                <TableRow employee={emp} key={emp._id} />
                            ))
                    }
                </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center my-3">
                <span className="badge bg-primary">Page {currentPage} of {totalPages}</span>
                <div>
                    <button
                        className="btn btn-outline-primary me-2"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    {pageNumbers.map(page => (
                        <button
                            key={page}
                            className={`btn btn-outline-primary me-1 ${currentPage === page ? 'active' : ''}`}
                            onClick={() => handlePagination(page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        className="btn btn-outline-primary ms-2"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>

        </>
    )
}

export default EmployeeTable;